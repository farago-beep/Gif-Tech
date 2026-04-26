import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Check, ArrowRight, Bot, Mail, FileText, BarChart3, Users, Workflow, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackCTAClick } from "@/lib/gtm";

type Need = {
  id: string;
  label: string;
  hint: string;
  icon: typeof Bot;
  recos: string[];
};

const needs: Need[] = [
  { id: "emails", label: "Gagner du temps sur les emails", hint: "Tri & réponses", icon: Mail, recos: ["Agent IA de tri", "Réponses suggérées", "Classification automatique"] },
  { id: "devis", label: "Automatiser mes devis", hint: "Génération en 1 clic", icon: FileText, recos: ["Générateur de devis IA", "Extraction de cahier des charges", "Envoi automatisé"] },
  { id: "kpi", label: "Piloter mes indicateurs", hint: "Dashboard temps réel", icon: BarChart3, recos: ["Dashboard sur mesure", "Alertes intelligentes", "Rapports hebdo automatisés"] },
  { id: "crm", label: "Mieux gérer mes clients", hint: "CRM intelligent", icon: Users, recos: ["CRM léger sur mesure", "Lead scoring IA", "Relances automatiques"] },
  { id: "process", label: "Automatiser mes process", hint: "Workflows internes", icon: Workflow, recos: ["Workflows n8n / Make", "Intégrations API", "Documents auto-générés"] },
  { id: "rdv", label: "Simplifier la prise de RDV", hint: "Booking & rappels", icon: Calendar, recos: ["Module booking intégré", "Rappels SMS/email", "Synchronisation agenda"] },
];

const tierFor = (n: number) => {
  if (n <= 1) return { label: "Pack Démarrage", price: "1 500 – 3 000 €", weeks: "2 – 3 semaines" };
  if (n <= 3) return { label: "Pack Croissance", price: "3 000 – 6 000 €", weeks: "4 – 6 semaines" };
  return { label: "Pack Transformation", price: "6 000 – 15 000 €", weeks: "6 – 10 semaines" };
};

const AIConfigurator = () => {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string) =>
    setSelected((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const recos = useMemo(() => {
    const all = needs.filter((n) => selected.includes(n.id)).flatMap((n) => n.recos);
    return Array.from(new Set(all));
  }, [selected]);

  const tier = tierFor(selected.length);

  const scrollToContact = () => {
    trackCTAClick("configurateur_devis_detaille", "configurateur");
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="configurateur" className="relative py-28 bg-background overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] rounded-full bg-cyan/5 blur-[120px]" />

      <div className="container mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center mb-14"
        >
          <span className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.25em] uppercase text-cyan border border-cyan/30 bg-cyan/5 px-3 py-1.5 rounded-full">
            <Sparkles className="w-3 h-3" /> Configurateur IA
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-semibold text-foreground mt-5 leading-tight">
            Construisez votre <span className="text-gradient-cyan italic font-normal">solution sur mesure</span>
          </h2>
          <p className="text-foreground/60 mt-5 leading-relaxed">
            Cochez vos besoins. Nous générons instantanément une pré-préconisation et une estimation indicative.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
          {/* Needs */}
          <div className="lg:col-span-3 grid sm:grid-cols-2 gap-3">
            {needs.map((n) => {
              const active = selected.includes(n.id);
              const Icon = n.icon;
              return (
                <button
                  type="button"
                  key={n.id}
                  onClick={() => toggle(n.id)}
                  className={`group text-left p-5 rounded-xl border transition-all duration-300 ${
                    active
                      ? "border-cyan/50 bg-cyan/5 glow-cyan"
                      : "border-border/60 bg-card hover:border-cyan/30 hover:bg-cyan/5"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition ${
                      active ? "bg-cyan/15 border border-cyan/40" : "bg-muted/60 border border-border/40 group-hover:border-cyan/30"
                    }`}>
                      <Icon className={`w-4 h-4 ${active ? "text-cyan" : "text-foreground/60"}`} />
                    </div>
                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition ${
                      active ? "bg-cyan border-cyan" : "border-border"
                    }`}>
                      {active && <Check className="w-3 h-3 text-primary-foreground" strokeWidth={3} />}
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="font-display text-base font-semibold text-foreground">{n.label}</div>
                    <div className="font-mono text-[11px] tracking-wider uppercase text-foreground/45 mt-1">
                      {n.hint}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Result panel */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 rounded-2xl border border-cyan/20 bg-card/80 backdrop-blur-sm p-7 shadow-card">
              <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.25em] uppercase text-cyan mb-4">
                <Bot className="w-3.5 h-3.5" /> Pré-préconisation
              </div>

              <AnimatePresence mode="wait">
                {selected.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="py-8 text-center"
                  >
                    <div className="w-14 h-14 mx-auto rounded-2xl border border-cyan/20 bg-cyan/5 flex items-center justify-center mb-4">
                      <Sparkles className="w-5 h-5 text-cyan/70" />
                    </div>
                    <p className="text-sm text-foreground/55 leading-relaxed">
                      Sélectionnez un ou plusieurs besoins pour découvrir une solution adaptée.
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="filled"
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  >
                    <div className="mb-5">
                      <div className="text-2xl font-display font-semibold text-foreground tracking-tight">
                        {tier.label}
                      </div>
                      <div className="font-mono text-[11px] tracking-wider uppercase text-foreground/50 mt-1">
                        {tier.price} · {tier.weeks}
                      </div>
                    </div>

                    <div className="space-y-2 mb-6">
                      {recos.slice(0, 6).map((r) => (
                        <div key={r} className="flex items-start gap-2 text-sm text-foreground/75">
                          <div className="w-4 h-4 rounded-full bg-cyan/15 border border-cyan/30 flex items-center justify-center mt-0.5 shrink-0">
                            <Check className="w-2.5 h-2.5 text-cyan" strokeWidth={3} />
                          </div>
                          {r}
                        </div>
                      ))}
                    </div>

                    <Button
                      onClick={scrollToContact}
                      className="w-full bg-gradient-gold text-primary-foreground font-semibold shadow-gold hover:opacity-95 group"
                    >
                      Demander un devis détaillé
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <p className="text-[11px] text-foreground/40 text-center mt-3">
                      Estimation indicative. Devis précis sous 48h.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIConfigurator;
