import { Resend } from "npm:resend@4.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface ContactPayload {
  fullName: string;
  email: string;
  company?: string;
  need: string;
  budget: string;
  message: string;
}

const escapeHtml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  try {
    const apiKey = Deno.env.get("RESEND_API_KEY");
    if (!apiKey) {
      console.error("RESEND_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const body = (await req.json()) as ContactPayload;
    console.log("[send-contact-email] payload received:", {
      email: body?.email,
      need: body?.need,
      budget: body?.budget,
      hasCompany: Boolean(body?.company),
    });

    if (!body?.fullName || !body?.email || !body?.need || !body?.budget || !body?.message) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const resend = new Resend(apiKey);

    // NOTE: tant que gif-tech.fr n'est pas vérifié sur Resend,
    // on envoie depuis onboarding@resend.dev (autorisé sans domaine).
    const FROM = "GiF-Tech <onboarding@resend.dev>";
    const TO = "contact@gif-tech.fr";

    const html = `
      <h2>Nouvelle demande de contact — GiF-Tech</h2>
      <p><strong>Nom :</strong> ${escapeHtml(body.fullName)}</p>
      <p><strong>Email :</strong> ${escapeHtml(body.email)}</p>
      <p><strong>Entreprise :</strong> ${escapeHtml(body.company || "—")}</p>
      <p><strong>Besoin :</strong> ${escapeHtml(body.need)}</p>
      <p><strong>Budget :</strong> ${escapeHtml(body.budget)}</p>
      <hr/>
      <p><strong>Message :</strong></p>
      <p style="white-space:pre-wrap">${escapeHtml(body.message)}</p>
    `;

    const { data, error } = await resend.emails.send({
      from: FROM,
      to: [TO],
      reply_to: body.email,
      subject: `Nouveau lead — ${body.fullName} (${body.need})`,
      html,
    });

    if (error) {
      console.error("[send-contact-email] Resend error:", error);
      return new Response(
        JSON.stringify({ error: "Failed to send email", details: error }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    console.log("[send-contact-email] sent successfully, id:", data?.id);
    return new Response(
      JSON.stringify({ ok: true, id: data?.id }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("[send-contact-email] unexpected error:", err);
    return new Response(
      JSON.stringify({ error: "Unexpected error", message: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});