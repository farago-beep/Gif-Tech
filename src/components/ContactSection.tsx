import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Send, Calendar, Building2, Briefcase, CheckCircle2, Sparkles } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { trackFormSubmissionSuccess, trackCalendlyClick } from "@/lib/gtm";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const needs = [
  "Automatisation IA",
  "Stratégie Growth B2B",
  "Développement Web/App",
  "Audit & Conseil Digital",
];

const budgets = [
  "< 2 000 €",
  "2 000 € - 5 000 €",
  "5 000 € - 10 000 €",
  "> 10 000 €",
];

const contactSchema = z.object({
  fullName: z.string().trim().min(2, "Veuillez renseigner votre nom et prénom").max(100),
  email: z.string().trim().email("Adresse email invalide").max(255),
  company: z.string().trim().max(100).optional(),
  need: z.string().min(1, "Sélectionnez un type de besoin"),
  budget: z.string().min(1, "Sélectionnez un budget estimé"),
  message: z.string().trim().min(10, "Décrivez votre projet (10 caractères minimum)").max(2000),
  rgpd: z.literal(true, { errorMap: () => ({ message: "Vous devez accepter la politique de confidentialité" }) }),
});

type FormState = {
  fullName: string;
  email: string;
  company: string;
  need: string;
  budget: string;
  message: string;
  rgpd: boolean;
};

const initialState: FormState = {
  fullName: "",
  email: "",
  company: "",
  need: "",
  budget: "",
  message: "",
  rgpd: false,
};

const ContactSection = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [values, setValues] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = contactSchema.safeParse(values);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof FormState, string>> = {};
      result.error.errors.forEach((err) => {
        const k = err.path[0] as keyof FormState;
        if (!fieldErrors[k]) fieldErrors[k] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("send-contact-email", {
        body: {
          fullName: values.fullName,
          email: values.email,
          company: values.company,
          need: values.need,
          budget: values.budget,
          message: values.message,
        },
      });

      if (error || (data && (data as { error?: string }).error)) {
        console.error("Erreur envoi formulaire:", error || data);
        toast({
          title: "Envoi impossible",
          description: "Une erreur est survenue. Réessayez ou écrivez-nous à contact@gif-tech.fr.",
          variant: "destructive",
        });
        return;
      }

      setSuccess(true);
      trackFormSubmissionSuccess("contact_b2b", {
        has_company: Boolean(values.company),
        budget: values.budget,
        need: values.need,
      });
      setValues(initialState);
    } catch (err) {
      console.error("Exception envoi formulaire:", err);
      toast({
        title: "Erreur réseau",
        description: "Impossible de joindre le serveur. Réessayez dans un instant.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const errorClass = "mt-1.5 text-xs text-red-400/90 font-medium";

  return (
    <section id="contact" className="relative py-28 bg-navy-deep overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-25" />
      <div className="absolute -top-40 -right-40 w-[34rem] h-[34rem] rounded-full bg-gold/10 blur-[120px]" />

      <div className="container mx-auto px-6 relative">
        <div className="grid lg:grid-cols-5 gap-10 max-w-6xl mx-auto">
          {/* Left — pitch */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <span className="font-mono text-[11px] tracking-[0.25em] uppercase text-gold">
              // Démarrer un projet
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-semibold text-foreground mt-4 leading-tight">
              Parlons de votre <span className="text-gradient-gold italic font-normal">prochain levier</span>.
            </h2>
            <p className="text-foreground/60 mt-5 leading-relaxed">
              Un échange de 30 minutes pour cadrer vos enjeux, valider la faisabilité
              et vous remettre un plan d'action concret. Sans engagement.
            </p>

            <div className="mt-8 space-y-3">
              <a
                href="https://calendly.com"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackCalendlyClick()}
                className="flex items-center gap-3 p-4 rounded-xl border border-cyan/30 bg-cyan/5 hover:bg-cyan/10 hover:border-cyan/50 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-cyan/15 border border-cyan/30 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-cyan" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-foreground">Réserver un créneau</div>
                  <div className="font-mono text-[11px] tracking-wider uppercase text-foreground/45 mt-0.5">
                    30 min · Visio
                  </div>
                </div>
                <span className="font-mono text-[11px] text-cyan opacity-0 group-hover:opacity-100 transition">→</span>
              </a>

              <a
                href="mailto:contact@gif-tech.fr"
                className="flex items-center gap-3 p-4 rounded-xl border border-border/60 hover:border-gold/40 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-gold" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-foreground">contact@gif-tech.fr</div>
                  <div className="font-mono text-[11px] tracking-wider uppercase text-foreground/45 mt-0.5">
                    Réponse sous 24h
                  </div>
                </div>
              </a>
            </div>
          </motion.div>

          {/* Right — form */}
          <div className="lg:col-span-3 relative">
            <AnimatePresence mode="wait">
              {success ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="bg-card/80 backdrop-blur-sm border border-border/60 rounded-2xl p-10 md:p-14 shadow-card text-center min-h-[520px] flex flex-col items-center justify-center"
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 14 }}
                    className="relative w-20 h-20 rounded-full bg-emerald-500/15 border border-emerald-400/40 flex items-center justify-center mb-6"
                  >
                    <div className="absolute inset-0 rounded-full bg-emerald-400/20 blur-xl" />
                    <CheckCircle2 className="w-10 h-10 text-emerald-400 relative" strokeWidth={2.2} />
                  </motion.div>
                  <motion.h3
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="text-2xl md:text-3xl font-display font-semibold text-foreground"
                  >
                    Merci, votre demande est <span className="text-gradient-gold italic font-normal">bien reçue</span>.
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="text-foreground/65 mt-4 max-w-md leading-relaxed"
                  >
                    Giuseppe a bien reçu votre demande. Une réponse vous sera adressée
                    sous 24h avec les prochaines étapes.
                  </motion.p>
                  <motion.button
                    type="button"
                    onClick={() => setSuccess(false)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-8 font-mono text-[11px] tracking-[0.2em] uppercase text-cyan hover:text-gold transition"
                  >
                    ← Envoyer une autre demande
                  </motion.button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  noValidate
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="bg-card/80 backdrop-blur-sm border border-border/60 rounded-2xl p-8 md:p-10 space-y-6 shadow-card"
                >
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="font-mono text-[10px] tracking-[0.2em] uppercase text-foreground/50 mb-2 block">
                        Nom & Prénom *
                      </label>
                      <Input
                        value={values.fullName}
                        onChange={(e) => setField("fullName", e.target.value)}
                        placeholder="Jean Dupont"
                        maxLength={100}
                        aria-invalid={!!errors.fullName}
                        className={`bg-muted/40 border-border/60 h-12 ${errors.fullName ? "border-red-400/60" : ""}`}
                      />
                      {errors.fullName && <p className={errorClass}>{errors.fullName}</p>}
                    </div>
                    <div>
                      <label className="font-mono text-[10px] tracking-[0.2em] uppercase text-foreground/50 mb-2 block">
                        Email professionnel *
                      </label>
                      <Input
                        type="email"
                        value={values.email}
                        onChange={(e) => setField("email", e.target.value)}
                        placeholder="jean@entreprise.fr"
                        maxLength={255}
                        aria-invalid={!!errors.email}
                        className={`bg-muted/40 border-border/60 h-12 ${errors.email ? "border-red-400/60" : ""}`}
                      />
                      {errors.email && <p className={errorClass}>{errors.email}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="font-mono text-[10px] tracking-[0.2em] uppercase text-foreground/50 mb-2 block">
                      <Building2 className="w-3 h-3 inline mr-1" /> Entreprise (optionnel)
                    </label>
                    <Input
                      value={values.company}
                      onChange={(e) => setField("company", e.target.value)}
                      placeholder="Nom de votre société"
                      maxLength={100}
                      className="bg-muted/40 border-border/60 h-12"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="font-mono text-[10px] tracking-[0.2em] uppercase text-foreground/50 mb-2 block">
                        <Sparkles className="w-3 h-3 inline mr-1" /> Type de besoin *
                      </label>
                      <Select value={values.need} onValueChange={(v) => setField("need", v)}>
                        <SelectTrigger
                          aria-invalid={!!errors.need}
                          className={`bg-muted/40 border-border/60 h-12 ${errors.need ? "border-red-400/60" : ""}`}
                        >
                          <SelectValue placeholder="Sélectionnez un besoin" />
                        </SelectTrigger>
                        <SelectContent>
                          {needs.map((n) => (
                            <SelectItem key={n} value={n}>{n}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.need && <p className={errorClass}>{errors.need}</p>}
                    </div>
                    <div>
                      <label className="font-mono text-[10px] tracking-[0.2em] uppercase text-foreground/50 mb-2 block">
                        <Briefcase className="w-3 h-3 inline mr-1" /> Budget estimé *
                      </label>
                      <Select value={values.budget} onValueChange={(v) => setField("budget", v)}>
                        <SelectTrigger
                          aria-invalid={!!errors.budget}
                          className={`bg-muted/40 border-border/60 h-12 ${errors.budget ? "border-red-400/60" : ""}`}
                        >
                          <SelectValue placeholder="Sélectionnez une fourchette" />
                        </SelectTrigger>
                        <SelectContent>
                          {budgets.map((b) => (
                            <SelectItem key={b} value={b}>{b}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.budget && <p className={errorClass}>{errors.budget}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="font-mono text-[10px] tracking-[0.2em] uppercase text-foreground/50 mb-2 block">
                      Description du projet *
                    </label>
                    <Textarea
                      value={values.message}
                      onChange={(e) => setField("message", e.target.value)}
                      rows={5}
                      maxLength={2000}
                      placeholder="Contexte, problématique actuelle, résultats attendus…"
                      aria-invalid={!!errors.message}
                      className={`bg-muted/40 border-border/60 resize-none ${errors.message ? "border-red-400/60" : ""}`}
                    />
                    {errors.message && <p className={errorClass}>{errors.message}</p>}
                  </div>

                  <div>
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <Checkbox
                        checked={values.rgpd}
                        onCheckedChange={(c) => setField("rgpd", c === true)}
                        className="mt-0.5 border-border/70 data-[state=checked]:bg-gold data-[state=checked]:border-gold data-[state=checked]:text-primary-foreground"
                      />
                      <span className="text-xs text-foreground/60 leading-relaxed group-hover:text-foreground/80 transition">
                        J'accepte que mes informations soient utilisées pour traiter ma demande,
                        conformément à la <a href="#" className="text-cyan hover:text-gold underline underline-offset-2">politique de confidentialité</a> (RGPD).
                      </span>
                    </label>
                    {errors.rgpd && <p className={errorClass}>{errors.rgpd}</p>}
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-gold text-primary-foreground font-semibold py-6 text-base shadow-gold hover:opacity-95"
                  >
                    {loading ? "Envoi en cours…" : (
                      <>Envoyer ma demande<Send className="w-4 h-4 ml-2" /></>
                    )}
                  </Button>

                  <p className="font-mono text-[10px] tracking-wider uppercase text-foreground/40 text-center">
                    Réponse sous 24h · Confidentialité garantie
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
