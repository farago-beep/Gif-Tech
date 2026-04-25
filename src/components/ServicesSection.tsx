import { motion } from "framer-motion";
import { Bot, Globe2, BarChart3, Users } from "lucide-react";

const services = [
  {
    icon: Bot,
    title: "Automatisation IA",
    description:
      "Agents IA, traitement de documents, génération de devis, classification d'emails. Vos tâches répétitives, déléguées à la machine.",
    tags: ["LLM", "RAG", "n8n"],
    isAI: true,
  },
  {
    icon: Globe2,
    title: "Plateformes Web sur mesure",
    description:
      "Sites métiers, espaces clients, portails B2B. Architecture moderne, performance et SEO au cœur de chaque projet.",
    tags: ["React", "TypeScript", "SEO"],
    isAI: false,
  },
  {
    icon: BarChart3,
    title: "Dashboards de pilotage",
    description:
      "Visualisez vos KPIs en temps réel. Décisions éclairées, rapports automatisés et alertes intelligentes.",
    tags: ["Analytics", "BI", "Realtime"],
    isAI: true,
  },
  {
    icon: Users,
    title: "CRM intelligent",
    description:
      "Centralisez prospects, clients et opportunités. Scoring IA, relances automatisées et reporting commercial.",
    tags: ["CRM", "Lead scoring", "API"],
    isAI: true,
  },
];

const ServicesSection = () => {
  return (
    <section id="services" className="relative py-28 bg-background overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div className="container mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mb-16"
        >
          <span className="font-mono text-[11px] tracking-[0.25em] uppercase text-gold">
            // Solutions
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-semibold text-foreground mt-4 leading-tight">
            Quatre leviers pour <span className="text-gradient-gold italic font-normal">accélérer</span> votre activité
          </h2>
          <p className="text-foreground/60 mt-5 leading-relaxed">
            Nous combinons expertise produit, intelligence artificielle et exécution rigoureuse
            pour livrer des solutions qui génèrent du ROI dès les premiers mois.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className={`group relative bg-card rounded-2xl p-8 border transition-all duration-500 hover:-translate-y-1 ${
                s.isAI
                  ? "border-cyan/20 hover:border-cyan/50 hover:shadow-cyan"
                  : "border-border/60 hover:border-gold/40 hover:shadow-card-hover"
              }`}
            >
              {/* AI cyan top liseré */}
              {s.isAI && (
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />
              )}

              <div className="flex items-start justify-between mb-6">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                    s.isAI
                      ? "bg-cyan/10 border border-cyan/30 group-hover:glow-cyan"
                      : "bg-gold/10 border border-gold/20 group-hover:glow-gold"
                  }`}
                >
                  <s.icon className={`w-5 h-5 ${s.isAI ? "text-cyan" : "text-gold"}`} />
                </div>
                {s.isAI && (
                  <span className="font-mono text-[10px] tracking-wider uppercase text-cyan border border-cyan/30 px-2 py-1 rounded-md">
                    IA
                  </span>
                )}
              </div>

              <h3 className="text-2xl font-display font-semibold text-foreground mb-3 tracking-tight">
                {s.title}
              </h3>
              <p className="text-foreground/60 leading-relaxed text-[15px] mb-6">
                {s.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {s.tags.map((t) => (
                  <span
                    key={t}
                    className="font-mono text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-md bg-muted/60 text-foreground/60 border border-border/40"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
