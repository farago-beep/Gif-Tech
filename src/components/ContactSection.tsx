import { motion } from "framer-motion";
import { Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const ContactSection = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Message envoyé !",
        description: "Je reviendrai vers vous dans les plus brefs délais.",
      });
      (e.target as HTMLFormElement).reset();
    }, 1000);
  };

  return (
    <section id="contact" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-gold font-body text-sm tracking-[0.25em] uppercase">
              Contact
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mt-3 mb-6">
              Discutons de votre projet
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Vous avez un projet de digitalisation ? Besoin d'une plateforme
              de gestion client ou d'un système de devis en ligne ? Contactez-moi
              pour en discuter.
            </p>
            <div className="flex items-center gap-3 text-foreground">
              <Mail className="w-5 h-5 text-gold" />
              <span className="font-body">contact@monportfolio.fr</span>
            </div>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-card rounded-2xl p-8 shadow-card space-y-5"
          >
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="text-sm font-medium text-card-foreground mb-1.5 block">
                  Nom
                </label>
                <Input
                  required
                  placeholder="Votre nom"
                  className="bg-muted/50 border-border"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-card-foreground mb-1.5 block">
                  Email
                </label>
                <Input
                  required
                  type="email"
                  placeholder="votre@email.com"
                  className="bg-muted/50 border-border"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-card-foreground mb-1.5 block">
                Sujet
              </label>
              <Input
                required
                placeholder="Votre projet en quelques mots"
                className="bg-muted/50 border-border"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-card-foreground mb-1.5 block">
                Message
              </label>
              <Textarea
                required
                rows={4}
                placeholder="Décrivez votre besoin..."
                className="bg-muted/50 border-border resize-none"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gold hover:bg-gold-light text-accent-foreground font-medium py-6 shadow-gold transition-all duration-300"
            >
              {loading ? "Envoi en cours..." : "Envoyer le message"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
