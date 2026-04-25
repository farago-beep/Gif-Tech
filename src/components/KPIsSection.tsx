import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef } from "react";
import { TrendingUp, Clock, Zap, Target } from "lucide-react";

const kpis = [
  { icon: TrendingUp, value: 30, suffix: "%", label: "Gain d'efficacité moyen", hint: "sur les processus automatisés" },
  { icon: Clock, value: 500, suffix: "h", label: "Heures gagnées par an", hint: "par client en moyenne" },
  { icon: Zap, value: 90, suffix: " jours", label: "Premier ROI mesurable", hint: "sur la majorité des projets" },
  { icon: Target, value: 100, suffix: "%", label: "Sur-mesure", hint: "aucune solution générique" },
];

const Counter = ({ value, suffix }: { value: number; suffix: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => Math.round(v).toString());

  useEffect(() => {
    if (inView) animate(mv, value, { duration: 1.6, ease: "easeOut" });
  }, [inView, value, mv]);

  return (
    <span className="inline-flex items-baseline">
      <motion.span ref={ref}>{rounded}</motion.span>
      <span>{suffix}</span>
    </span>
  );
};

const KPIsSection = () => {
  return (
    <section className="relative py-24 bg-background overflow-hidden border-y border-border/60">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="container mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mb-14"
        >
          <span className="font-mono text-[11px] tracking-[0.25em] uppercase text-gold">
            // Preuve par les chiffres
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-semibold text-foreground mt-4 leading-tight">
            Des résultats <span className="text-gradient-gold italic font-normal">mesurables</span>, pas des promesses.
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {kpis.map((k, i) => (
            <motion.div
              key={k.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="relative bg-card border border-border/60 rounded-2xl p-7 hover:border-gold/40 hover:-translate-y-1 transition-all duration-500 group"
            >
              <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center mb-5 group-hover:glow-gold transition-all">
                <k.icon className="w-4 h-4 text-gold" />
              </div>
              <div className="text-5xl font-display font-semibold text-foreground tracking-tight">
                +<Counter value={k.value} suffix={k.suffix} />
              </div>
              <div className="mt-3 font-medium text-foreground/85">{k.label}</div>
              <div className="font-mono text-[11px] tracking-wider uppercase text-foreground/40 mt-1">
                {k.hint}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default KPIsSection;
