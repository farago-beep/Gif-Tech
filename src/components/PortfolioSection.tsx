import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

const projects = [
  {
    title: "GestPro CRM",
    category: "Gestion Client",
    description:
      "Plateforme CRM complète pour une entreprise de services B2B. Suivi des leads, pipeline de vente et rapports automatisés.",
    tags: ["CRM", "Dashboard", "Automatisation"],
    color: "from-navy to-navy-light",
  },
  {
    title: "DevisExpress",
    category: "Devis en Ligne",
    description:
      "Système de demande de devis en ligne avec configurateur produit et estimation instantanée pour un artisan du bâtiment.",
    tags: ["Devis", "Formulaire", "PDF"],
    color: "from-gold/80 to-gold",
  },
  {
    title: "ClientHub",
    category: "Portail Client",
    description:
      "Espace client sécurisé permettant le suivi des commandes, la facturation et la communication en temps réel.",
    tags: ["Portail", "Facturation", "Messagerie"],
    color: "from-navy-light to-navy",
  },
  {
    title: "FlowDevis",
    category: "Devis & Facturation",
    description:
      "Solution tout-en-un de devis et facturation pour une PME de 15 employés, avec signature électronique intégrée.",
    tags: ["Devis", "Factures", "Signature"],
    color: "from-gold to-gold/60",
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
            Mes réalisations
          </h2>
          <p className="text-muted-foreground mt-4 max-w-lg mx-auto">
            Découvrez quelques-uns des projets que j'ai conçus pour aider les
            TPE et PME à se digitaliser.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, i) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 cursor-pointer"
            >
              <div
                className={`h-48 bg-gradient-to-br ${project.color} flex items-center justify-center relative overflow-hidden`}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent)]" />
                <span className="text-2xl font-display font-bold text-primary-foreground/90 relative z-10">
                  {project.title}
                </span>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ExternalLink className="w-5 h-5 text-primary-foreground/70" />
                </div>
              </div>
              <div className="p-6">
                <span className="text-gold text-xs font-medium tracking-wider uppercase">
                  {project.category}
                </span>
                <h3 className="text-xl font-display font-semibold text-card-foreground mt-2 mb-3">
                  {project.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-3 py-1 rounded-full bg-muted text-muted-foreground font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;
