import { motion } from "framer-motion";
import { ExternalLink, ShoppingBag, FileText, Compass, GraduationCap } from "lucide-react";

const projects = [
  {
    title: "Winty Dream",
    category: "E-commerce",
    description:
      "Boutique en ligne spécialisée dans les produits Disney, Funko Pop et Loungefly. Catalogue produit, panier et expérience d'achat immersive.",
    tags: ["E-commerce", "Catalogue", "UX Design"],
    icon: ShoppingBag,
    color: "from-[hsl(280,40%,25%)] to-[hsl(320,35%,35%)]",
    url: "https://id-preview--f8de5223-4784-44a1-910a-d7b8b16cb243.lovable.app",
    status: "En cours",
  },
  {
    title: "Renovation Quotes Pro",
    category: "Devis en Ligne",
    description:
      "Plateforme de demande de devis pour les professionnels de la rénovation. Formulaire intelligent par catégorie de services avec estimation rapide.",
    tags: ["Devis", "Formulaire", "Rénovation"],
    icon: FileText,
    color: "from-[hsl(var(--gold))] to-[hsl(30,50%,40%)]",
    url: "https://id-preview--14a9f869-1a93-4f30-aea6-d757807b0dd7.lovable.app",
    status: "En cours",
  },
  {
    title: "DigitalCareer",
    category: "Consulting & Coaching",
    description:
      "Site vitrine pour un cabinet de consulting emploi digital. Coaching personnalisé, optimisation CV, préparation entretiens et prise de rendez-vous.",
    tags: ["Coaching", "Booking", "Landing Page"],
    icon: Compass,
    color: "from-[hsl(var(--navy))] to-[hsl(var(--navy-light))]",
    url: "https://id-preview--5770c17e-fd2f-4843-9782-9a7e9fd4e55c.lovable.app",
    status: "En cours",
  },
  {
    title: "École Ethic",
    category: "Formation Digitale",
    description:
      "Plateforme pour une école du digital responsable. Présentation des formations certifiantes, pédagogie, témoignages et inscription newsletter.",
    tags: ["Formation", "Newsletter", "Pédagogie"],
    icon: GraduationCap,
    color: "from-[hsl(160,40%,30%)] to-[hsl(180,35%,25%)]",
    url: "https://id-preview--042b153d-ff17-4e2c-9ccf-bcdb231d953a.lovable.app",
    status: "En cours",
  },
];

const PortfolioSection = () => {
  return (
    <section id="portfolio" className="py-24 bg-muted/50">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-gold font-body text-sm tracking-[0.25em] uppercase">
            Portfolio
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mt-3">
            Projets en cours
          </h2>
          <p className="text-muted-foreground mt-4 max-w-lg mx-auto font-body">
            Découvrez les solutions digitales que je développe actuellement pour
            des clients dans différents secteurs.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, i) => {
            const Icon = project.icon;
            return (
              <motion.a
                key={project.title}
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-500 hover:-translate-y-1"
              >
                <div
                  className={`h-48 md:h-56 bg-gradient-to-br ${project.color} flex items-center justify-center relative overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.12),transparent)]" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(0,0,0,0.15),transparent)]" />

                  <div className="relative z-10 flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                      <Icon className="w-7 h-7 text-primary-foreground" />
                    </div>
                    <span className="text-2xl font-display font-bold text-primary-foreground/90">
                      {project.title}
                    </span>
                  </div>

                  {/* Status badge */}
                  <div className="absolute top-4 left-4">
                    <span className="text-[10px] font-body font-medium tracking-wider uppercase px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm text-primary-foreground/80 border border-white/20">
                      {project.status}
                    </span>
                  </div>

                  {/* External link icon */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
                    <div className="w-8 h-8 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center">
                      <ExternalLink className="w-4 h-4 text-primary-foreground/80" />
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <span className="text-gold text-xs font-body font-medium tracking-wider uppercase">
                    {project.category}
                  </span>
                  <h3 className="text-xl font-display font-semibold text-card-foreground mt-2 mb-3">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground text-sm font-body leading-relaxed mb-4">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-3 py-1 rounded-full bg-muted text-muted-foreground font-body font-medium"
                      >
                        {tag}
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
