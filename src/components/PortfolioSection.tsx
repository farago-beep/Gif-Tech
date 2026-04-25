import { motion } from "framer-motion";
import { ExternalLink, ShoppingBag, FileText, Compass, GraduationCap } from "lucide-react";

const projects = [
  {
    title: "Winty Dream",
    category: "E-commerce",
    description:
      "Boutique en ligne spécialisée Disney, Funko Pop et Loungefly. Catalogue, panier et expérience d'achat immersive.",
    tags: ["E-commerce", "Catalogue", "UX"],
    icon: ShoppingBag,
    accent: "from-fuchsia-500/20 to-purple-500/20",
    url: "https://id-preview--f8de5223-4784-44a1-910a-d7b8b16cb243.lovable.app",
    status: "EN COURS",
  },
  {
    title: "Renovation Quotes Pro",
    category: "Devis intelligents",
    description:
      "Plateforme de demande de devis pour pros de la rénovation. Formulaire intelligent par catégorie et estimation rapide.",
    tags: ["Devis", "Form IA", "B2B"],
    icon: FileText,
    accent: "from-gold/25 to-orange-500/15",
    url: "https://id-preview--14a9f869-1a93-4f30-aea6-d757807b0dd7.lovable.app",
    status: "EN COURS",
  },
  {
    title: "DigitalCareer",
    category: "Conseil & Coaching",
    description:
      "Site vitrine pour cabinet de conseil emploi digital. Coaching personnalisé, optimisation CV et prise de rendez-vous.",
    tags: ["Coaching", "Booking", "Landing"],
    icon: Compass,
    accent: "from-cyan/20 to-blue-500/15",
    url: "https://id-preview--5770c17e-fd2f-4843-9782-9a7e9fd4e55c.lovable.app",
    status: "EN COURS",
  },
  {
    title: "École Ethic",
    category: "Formation Digitale",
    description:
      "Plateforme pour école du digital responsable. Présentation des formations, pédagogie, témoignages et inscription.",
    tags: ["Formation", "Newsletter", "EdTech"],
    icon: GraduationCap,
    accent: "from-emerald-500/20 to-teal-500/15",
    url: "https://id-preview--042b153d-ff17-4e2c-9ccf-bcdb231d953a.lovable.app",
    status: "EN COURS",
  },
];

const PortfolioSection = () => {
  return (
    <section id="portfolio" className="relative py-28 bg-navy-deep overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan/30 to-transparent" />

      <div className="container mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mb-16"
        >
          <span className="font-mono text-[11px] tracking-[0.25em] uppercase text-gold">
            // Portfolio · Études de cas
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-semibold text-foreground mt-4 leading-tight">
            Des projets qui <span className="text-gradient-gold italic font-normal">livrent du ROI</span>
          </h2>
          <p className="text-foreground/60 mt-5 leading-relaxed">
            Sélection de plateformes en production ou en cours de déploiement pour nos clients.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.a
                key={p.title}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group relative bg-card rounded-2xl overflow-hidden border border-border/60 hover:border-gold/40 transition-all duration-500 hover:-translate-y-1 hover:shadow-card-hover"
              >
                {/* Visual header */}
                <div className={`relative h-44 bg-gradient-to-br ${p.accent} overflow-hidden`}>
                  <div className="absolute inset-0 bg-grid opacity-40" />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />

                  <div className="relative z-10 h-full flex items-center justify-center">
                    <div className="w-16 h-16 rounded-2xl bg-background/40 backdrop-blur-md flex items-center justify-center border border-foreground/10">
                      <Icon className="w-7 h-7 text-foreground/90" />
                    </div>
                  </div>

                  {/* Status badge with pulse */}
                  <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/60 backdrop-blur-md border border-gold/30">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-gold opacity-75 animate-ping" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-gold" />
                    </span>
                    <span className="font-mono text-[10px] tracking-[0.2em] text-gold font-medium">
                      {p.status}
                    </span>
                  </div>

                  <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-background/60 backdrop-blur-md border border-foreground/10 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all">
                    <ExternalLink className="w-4 h-4 text-foreground/80" />
                  </div>
                </div>

                <div className="p-7">
                  <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-gold">
                    {p.category}
                  </span>
                  <h3 className="text-xl font-display font-semibold text-foreground mt-2 mb-3 tracking-tight">
                    {p.title}
                  </h3>
                  <p className="text-foreground/60 text-sm leading-relaxed mb-5">
                    {p.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {p.tags.map((t) => (
                      <span
                        key={t}
                        className="font-mono text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-md bg-muted/60 text-foreground/60 border border-border/40"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;
