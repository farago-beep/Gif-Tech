import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Send, Calendar, Building2, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { trackFormSubmissionSuccess, trackCalendlyClick } from "@/lib/gtm";

const budgets = [
  "< 3 000 €",
  "3 000 – 6 000 €",
  "6 000 – 15 000 €",
  "15 000 – 30 000 €",
  "> 30 000 €",
  "À définir",
];

const ContactSection = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const form = e.target as HTMLFormElement;
      const data = new FormData(form);
      trackFormSubmissionSuccess("contact_b2b", {
        has_company: Boolean(data.get("company")),
        budget: (data.get("budget") as string) || "non_renseigne",
      });
      toast({
        title: "Demande envoyée",
        description: "Nous revenons vers vous sous 24 à 48h avec une proposition cadrée.",
      });
      form.reset();
    }, 1000);
  };

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
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-3 bg-card/80 backdrop-blur-sm border border-border/60 rounded-2xl p-8 md:p-10 space-y-6 shadow-card"
          >
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="font-mono text-[10px] tracking-[0.2em] uppercase text-foreground/50 mb-2 block">
                  Nom *
                </label>
                <Input required name="name" placeholder="Jean Dupont" maxLength={100} className="bg-muted/40 border-border/60 h-11" />
              </div>
              <div>
                <label className="font-mono text-[10px] tracking-[0.2em] uppercase text-foreground/50 mb-2 block">
                  Email *
                </label>
                <Input required type="email" name="email" placeholder="jean@entreprise.fr" maxLength={255} className="bg-muted/40 border-border/60 h-11" />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="font-mono text-[10px] tracking-[0.2em] uppercase text-foreground/50 mb-2 block">
                  <Building2 className="w-3 h-3 inline mr-1" /> Entreprise
                </label>
                <Input name="company" placeholder="Nom de votre société" maxLength={100} className="bg-muted/40 border-border/60 h-11" />
              </div>
              <div>
                <label className="font-mono text-[10px] tracking-[0.2em] uppercase text-foreground/50 mb-2 block">
                  <Briefcase className="w-3 h-3 inline mr-1" /> Budget estimé
                </label>
                <Select name="budget">
                  <SelectTrigger className="bg-muted/40 border-border/60 h-11">
                    <SelectValue placeholder="Sélectionnez une fourchette" />
                  </SelectTrigger>
                  <SelectContent>
                    {budgets.map((b) => (
                      <SelectItem key={b} value={b}>{b}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="font-mono text-[10px] tracking-[0.2em] uppercase text-foreground/50 mb-2 block">
                Décrivez votre projet *
              </label>
              <Textarea
                required
                name="description"
                rows={5}
                maxLength={2000}
                placeholder="Contexte, problématique actuelle, résultats attendus…"
                className="bg-muted/40 border-border/60 resize-none"
              />
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
              Réponse sous 24 à 48h · Confidentialité garantie
            </p>
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
