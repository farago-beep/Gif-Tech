import { motion } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt=""
          className="w-full h-full object-cover"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-hero opacity-80" />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-3xl"
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="inline-block text-gold font-body text-sm tracking-[0.25em] uppercase mb-6"
          >
            Solutions Digitales pour TPE & PME
          </motion.span>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-primary-foreground leading-[1.1] mb-6">
            Vos{" "}
            <span className="text-gradient-gold">solutions digitales</span>{" "}
            sur mesure
          </h1>

          <p className="text-lg md:text-xl text-primary-foreground/70 font-body max-w-xl mb-10 leading-relaxed">
            Conception et déploiement de plateformes digitales : gestion client,
            devis en ligne, automatisation et outils métiers pour les TPE et PME.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              className="bg-gold hover:bg-gold-light text-accent-foreground font-body font-medium text-base px-8 py-6 shadow-gold transition-all duration-300"
              onClick={() =>
                document
                  .getElementById("portfolio")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Voir mes réalisations
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 font-body text-base px-8 py-6 transition-all duration-300"
              onClick={() =>
                document
                  .getElementById("contact")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Me contacter
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
