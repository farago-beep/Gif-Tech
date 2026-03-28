import { motion } from "framer-motion";
import { Mail, ArrowRight, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const needs = [
  { id: "crm", label: "Gestion Client (CRM)" },
  { id: "devis", label: "Devis / Facturation en ligne" },
  { id: "dashboard", label: "Tableau de bord / Reporting" },
  { id: "automation", label: "Automatisation de processus" },
  { id: "website", label: "Site vitrine / Landing page" },
  { id: "ecommerce", label: "E-commerce / Boutique en ligne" },
  { id: "booking", label: "Prise de rendez-vous en ligne" },
  { id: "other", label: "Autre besoin" },
];

const budgets = [
  { value: "< 1 000 €", label: "Moins de 1 000 €" },
  { value: "1 000 – 3 000 €", label: "1 000 – 3 000 €" },
  { value: "3 000 – 5 000 €", label: "3 000 – 5 000 €" },
  { value: "5 000 – 10 000 €", label: "5 000 – 10 000 €" },
  { value: "> 10 000 €", label: "Plus de 10 000 €" },
  { value: "À définir", label: "À définir ensemble" },
];

const timelines = [
  { value: "urgent", label: "Urgent (< 2 semaines)" },
  { value: "1month", label: "1 mois" },
  { value: "2-3months", label: "2 – 3 mois" },
  { value: "flexible", label: "Flexible" },
];

const ContactSection = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>([]);

  const toggleNeed = (id: string) => {
    setSelectedNeeds((prev) =>
      prev.includes(id) ? prev.filter((n) => n !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedNeeds.length === 0) {
      toast({
        title: "Sélectionnez au moins un besoin",
        description: "Cochez les solutions qui vous intéressent.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Demande de devis envoyée !",
        description:
          "Merci pour votre demande. Je reviendrai vers vous sous 24 à 48h.",
      });
      (e.target as HTMLFormElement).reset();
      setSelectedNeeds([]);
    }, 1200);
  };

  return (
    <section id="contact" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <span className="text-gold font-body text-sm tracking-[0.25em] uppercase">
            Devis gratuit
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mt-3 mb-4">
            Demandez votre devis
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Décrivez votre projet et vos besoins digitaux. Je vous recontacte
            sous 24 à 48h avec une proposition adaptée.
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="max-w-3xl mx-auto bg-card rounded-2xl p-8 md:p-10 shadow-card space-y-8"
        >
          {/* Identity */}
          <div>
            <h3 className="font-display text-lg font-semibold text-card-foreground mb-4">
              Vos coordonnées
            </h3>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="text-sm font-medium text-card-foreground mb-1.5 block">
                  Nom complet *
                </label>
                <Input
                  required
                  name="name"
                  placeholder="Jean Dupont"
                  className="bg-muted/50 border-border"
                  maxLength={100}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-card-foreground mb-1.5 block">
                  Email *
                </label>
                <Input
                  required
                  type="email"
                  name="email"
                  placeholder="jean@entreprise.fr"
                  className="bg-muted/50 border-border"
                  maxLength={255}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-card-foreground mb-1.5 block">
                  Téléphone
                </label>
                <Input
                  type="tel"
                  name="phone"
                  placeholder="06 12 34 56 78"
                  className="bg-muted/50 border-border"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-card-foreground mb-1.5 block">
                  Entreprise
                </label>
                <Input
                  name="company"
                  placeholder="Nom de votre entreprise"
                  className="bg-muted/50 border-border"
                  maxLength={100}
                />
              </div>
            </div>
          </div>

          {/* Separator */}
          <div className="border-t border-border" />

          {/* Needs */}
          <div>
            <h3 className="font-display text-lg font-semibold text-card-foreground mb-2">
              Vos besoins digitaux *
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Sélectionnez toutes les solutions qui vous intéressent.
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              {needs.map((need) => (
                <label
                  key={need.id}
                  className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all duration-200 ${
                    selectedNeeds.includes(need.id)
                      ? "border-gold bg-gold/5 shadow-sm"
                      : "border-border hover:border-gold/40 hover:bg-muted/30"
                  }`}
                >
                  <Checkbox
                    checked={selectedNeeds.includes(need.id)}
                    onCheckedChange={() => toggleNeed(need.id)}
                    className="data-[state=checked]:bg-gold data-[state=checked]:border-gold"
                  />
                  <span className="text-sm font-body text-card-foreground">
                    {need.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Separator */}
          <div className="border-t border-border" />

          {/* Budget & Timeline */}
          <div>
            <h3 className="font-display text-lg font-semibold text-card-foreground mb-4">
              Budget & délais
            </h3>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="text-sm font-medium text-card-foreground mb-1.5 block">
                  Budget estimé
                </label>
                <Select name="budget">
                  <SelectTrigger className="bg-muted/50 border-border">
                    <SelectValue placeholder="Sélectionnez une fourchette" />
                  </SelectTrigger>
                  <SelectContent>
                    {budgets.map((b) => (
                      <SelectItem key={b.value} value={b.value}>
                        {b.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-card-foreground mb-1.5 block">
                  Délai souhaité
                </label>
                <Select name="timeline">
                  <SelectTrigger className="bg-muted/50 border-border">
                    <SelectValue placeholder="Quand en avez-vous besoin ?" />
                  </SelectTrigger>
                  <SelectContent>
                    {timelines.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Separator */}
          <div className="border-t border-border" />

          {/* Description */}
          <div>
            <h3 className="font-display text-lg font-semibold text-card-foreground mb-4">
              Décrivez votre projet
            </h3>
            <Textarea
              required
              name="description"
              rows={5}
              maxLength={2000}
              placeholder="Parlez-moi de votre activité, de vos problématiques actuelles et de ce que vous attendez de votre solution digitale..."
              className="bg-muted/50 border-border resize-none"
            />
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gold hover:bg-gold-light text-accent-foreground font-medium py-6 text-base shadow-gold transition-all duration-300"
          >
            {loading ? (
              "Envoi en cours..."
            ) : (
              <>
                Envoyer ma demande de devis
                <Send className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Devis gratuit et sans engagement. Réponse sous 24 à 48h.
          </p>
        </motion.form>

        {/* Direct contact */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center gap-3 mt-10 text-muted-foreground"
        >
          <Mail className="w-4 h-4 text-gold" />
          <span className="text-sm font-body">
            Ou écrivez-moi directement à{" "}
            <a
              href="mailto:contact@gif-solutions.fr"
              className="text-gold hover:underline"
            >
              contact@gif-solutions.fr
            </a>
          </span>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
