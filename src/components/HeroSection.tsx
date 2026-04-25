import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const NodeNetwork = () => {
  // Subtle animated nodes — pure SVG, no extra deps
  const nodes = Array.from({ length: 18 }).map((_, i) => ({
    cx: (i * 137) % 100,
    cy: (i * 53) % 100,
    r: 0.4 + (i % 3) * 0.25,
    delay: (i % 7) * 0.4,
  }));
  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-[0.55] pointer-events-none"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(var(--cyan))" stopOpacity="0.9" />
          <stop offset="100%" stopColor="hsl(var(--cyan))" stopOpacity="0" />
        </radialGradient>
      </defs>
      {nodes.map((n, i) => (
        <g key={i}>
          {nodes.slice(i + 1, i + 3).map((m, j) => (
            <line
              key={j}
              x1={n.cx} y1={n.cy} x2={m.cx} y2={m.cy}
              stroke="hsl(var(--cyan))"
              strokeOpacity="0.08"
              strokeWidth="0.1"
            />
          ))}
          <circle cx={n.cx} cy={n.cy} r={n.r * 2.5} fill="url(#nodeGlow)">
            <animate attributeName="opacity" values="0.4;1;0.4" dur="4s" begin={`${n.delay}s`} repeatCount="indefinite" />
          </circle>
          <circle cx={n.cx} cy={n.cy} r={n.r} fill="hsl(var(--cyan))" />
        </g>
      ))}
    </svg>
  );
};

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-hero">
      {/* Layered backgrounds */}
      <div className="absolute inset-0 bg-grid opacity-40" />
      <NodeNetwork />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
      <div className="absolute -top-32 -right-32 w-[40rem] h-[40rem] rounded-full bg-gold/10 blur-[120px] float-slow" />
      <div className="absolute -bottom-32 -left-32 w-[36rem] h-[36rem] rounded-full bg-cyan/10 blur-[120px]" />

      <div className="relative z-10 container mx-auto px-6 py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full border border-cyan/30 bg-cyan/5 backdrop-blur-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-cyan opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan" />
            </span>
            <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-cyan-soft">
              Growth · Innovation · Flexibility
            </span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-display font-semibold text-foreground leading-[1.02] mb-8 tracking-tight">
            L'innovation digitale<br />
            au service de votre{" "}
            <span className="relative inline-block">
              <span className="text-gradient-gold italic font-normal">croissance</span>
              <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 200 8" preserveAspectRatio="none">
                <path d="M2 6 Q 100 0, 198 5" stroke="hsl(var(--gold))" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6"/>
              </svg>
            </span>
          </h1>

          <p className="text-lg md:text-xl text-foreground/65 max-w-2xl mb-12 leading-relaxed">
            Cabinet conseil en <span className="text-foreground/90 font-medium">IA, automatisation</span> et
            développement web pour TPE et PME. Nous transformons vos processus métiers en
            <span className="text-foreground/90 font-medium"> leviers de ROI mesurables</span>.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              className="bg-gradient-gold text-primary-foreground font-semibold text-base px-8 py-6 shadow-gold hover:opacity-95 transition-all group"
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            >
              Démarrer un projet
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-cyan/30 text-foreground bg-cyan/5 hover:bg-cyan/10 hover:border-cyan/50 backdrop-blur-sm font-medium text-base px-8 py-6 transition-all"
              onClick={() => document.getElementById("configurateur")?.scrollIntoView({ behavior: "smooth" })}
            >
              <Sparkles className="w-4 h-4 mr-2 text-cyan" />
              Configurer ma solution IA
            </Button>
          </div>

          {/* Trust strip */}
          <div className="mt-16 flex flex-wrap items-center gap-x-8 gap-y-3 font-mono text-[11px] tracking-wider uppercase text-foreground/40">
            <span>// Conformité RGPD</span>
            <span className="hidden sm:inline">// Hébergement EU</span>
            <span>// ROI sous 90 jours</span>
            <span className="hidden md:inline">// Support dédié</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
