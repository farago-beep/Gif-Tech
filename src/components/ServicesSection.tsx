import { motion } from "framer-motion";
import { Users, FileText, BarChart3, Zap } from "lucide-react";

const services = [
  {
    icon: Users,
    title: "Gestion Client (CRM)",
    description:
      "Plateformes intuitives pour centraliser vos contacts, suivre les interactions et fidéliser vos clients.",
  },
  {
    icon: FileText,
    title: "Devis en Ligne",
    description:
      "Formulaires intelligents permettant à vos prospects de demander un devis personnalisé en quelques clics.",
  },
  {
    icon: BarChart3,
    title: "Tableaux de Bord",
    description:
      "Dashboards sur mesure pour piloter votre activité et prendre des décisions éclairées.",
  },
  {
    icon: Zap,
    title: "Automatisation",
    description:
      "Automatisez vos processus répétitifs : relances, notifications, génération de documents.",
  },
];

const ServicesSection = () => {
  return (
    <section id="services" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-gold font-body text-sm tracking-[0.25em] uppercase">
            Services
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mt-3">
            Mon expertise à votre service
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group bg-card rounded-xl p-8 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center mb-5 group-hover:bg-gold/20 transition-colors">
                <service.icon className="w-6 h-6 text-gold" />
              </div>
              <h3 className="text-xl font-display font-semibold text-card-foreground mb-3">
                {service.title}
              </h3>
              <p className="text-muted-foreground font-body leading-relaxed text-sm">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
