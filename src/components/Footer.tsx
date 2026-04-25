import { Sparkles, Mail, Linkedin } from "lucide-react";

const Footer = () => (
  <footer className="bg-navy-deep border-t border-border/60 py-16">
    <div className="container mx-auto px-6">
      <div className="grid md:grid-cols-3 gap-10 mb-10">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-gradient-gold flex items-center justify-center shadow-gold">
              <Sparkles className="w-4 h-4 text-primary-foreground" strokeWidth={2.5} />
            </div>
            <span className="font-display text-2xl font-semibold">
              <span className="text-gradient-gold">GIF</span>
              <span className="text-foreground/80">-Tech</span>
            </span>
          </div>
          <p className="text-sm text-foreground/55 leading-relaxed max-w-xs">
            Cabinet conseil IA, automatisation et plateformes web sur mesure pour TPE & PME ambitieuses.
          </p>
        </div>

        <div>
          <h4 className="font-mono text-[11px] tracking-[0.2em] uppercase text-foreground/40 mb-4">Solutions</h4>
          <ul className="space-y-2 text-sm text-foreground/70">
            <li><a href="#services" className="hover:text-gold transition-colors">Automatisation IA</a></li>
            <li><a href="#services" className="hover:text-gold transition-colors">Plateformes web</a></li>
            <li><a href="#services" className="hover:text-gold transition-colors">Dashboards de pilotage</a></li>
            <li><a href="#services" className="hover:text-gold transition-colors">CRM intelligent</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-mono text-[11px] tracking-[0.2em] uppercase text-foreground/40 mb-4">Contact</h4>
          <ul className="space-y-2 text-sm text-foreground/70">
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gold" />
              <a href="mailto:contact@gif-tech.fr" className="hover:text-gold transition-colors">contact@gif-tech.fr</a>
            </li>
            <li className="flex items-center gap-2">
              <Linkedin className="w-4 h-4 text-gold" />
              <a href="#" className="hover:text-gold transition-colors">LinkedIn</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="pt-8 border-t border-border/40 flex flex-col md:flex-row items-center justify-between gap-3">
        <p className="text-xs font-mono text-foreground/40 tracking-wider">
          © {new Date().getFullYear()} GIF-TECH — GROWTH · INNOVATION · FLEXIBILITY
        </p>
        <p className="text-xs text-foreground/40">Conçu avec rigueur pour les PME ambitieuses.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
