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

const ALLOWED_NEEDS = new Set([
  "Automatisation IA",
  "Stratégie Growth B2B",
  "Développement Web/App",
  "Audit & Conseil Digital",
]);

const ALLOWED_BUDGETS = new Set([
  "< 2 000 €",
  "2 000 € - 5 000 €",
  "5 000 € - 10 000 €",
  "> 10 000 €",
]);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validatePayload(b: unknown): { ok: true; data: ContactPayload } | { ok: false } {
  if (!b || typeof b !== "object") return { ok: false };
  const o = b as Record<string, unknown>;
  const fullName = typeof o.fullName === "string" ? o.fullName.trim() : "";
  const email = typeof o.email === "string" ? o.email.trim() : "";
  const company = typeof o.company === "string" ? o.company.trim() : "";
  const need = typeof o.need === "string" ? o.need : "";
  const budget = typeof o.budget === "string" ? o.budget : "";
  const message = typeof o.message === "string" ? o.message.trim() : "";

  if (fullName.length < 2 || fullName.length > 100) return { ok: false };
  if (email.length > 255 || !EMAIL_RE.test(email)) return { ok: false };
  if (company.length > 100) return { ok: false };
  if (!ALLOWED_NEEDS.has(need)) return { ok: false };
  if (!ALLOWED_BUDGETS.has(budget)) return { ok: false };
  if (message.length < 10 || message.length > 2000) return { ok: false };

  return { ok: true, data: { fullName, email, company, need, budget, message } };
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

    let raw: unknown;
    try {
      raw = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid request" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const validation = validatePayload(raw);
    if (!validation.ok) {
      console.warn("[send-contact-email] payload validation failed");
      return new Response(
        JSON.stringify({ error: "Invalid request" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    const body = validation.data;
    console.log("[send-contact-email] payload accepted:", {
      need: body.need,
      budget: body.budget,
      hasCompany: Boolean(body.company),
    });

    const resend = new Resend(apiKey);

    // NOTE: tant que gif-tech.fr n'est pas vérifié sur Resend,
    // - on envoie DEPUIS onboarding@resend.dev (autorisé sans domaine)
    // - on envoie VERS l'adresse propriétaire du compte Resend (mode test)
    // Une fois le domaine vérifié sur resend.com/domains, remplacez :
    //   FROM -> "GiF-Tech <contact@gif-tech.fr>"
    //   TO   -> "contact@gif-tech.fr"
    const FROM = "GiF-Tech <onboarding@resend.dev>";
    const TO = Deno.env.get("CONTACT_TO_EMAIL") || "farago.giuseppe@gmail.com";

    const html = `
      <h2>Nouvelle demande de contact — GiF-Tech</h2>
      <p><strong>Nom :</strong> ${escapeHtml(body.fullName)}</p>
      <p><strong>Email :</strong> <a href="mailto:${escapeHtml(body.email)}">${escapeHtml(body.email)}</a></p>
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
      replyTo: body.email,
      subject: `Nouveau lead — ${body.fullName} (${body.need})`,
      html,
    });

    if (error) {
      console.error("[send-contact-email] Resend error:", error);
      return new Response(
        JSON.stringify({ error: "Email could not be sent. Please try again later." }),
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
      JSON.stringify({ error: "Email could not be sent. Please try again later." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});