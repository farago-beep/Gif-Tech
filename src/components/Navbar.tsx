import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Solutions", href: "#services" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Contact", href: "#contact" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleClick = (href: string) => {
    setOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-card/95 backdrop-blur-xl shadow-card border-b border-border/50"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between h-18 md:h-22">
        {/* Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-2 group"
        >
          <div className={`flex items-center gap-0.5 font-display text-2xl md:text-3xl font-bold transition-colors ${
            scrolled ? "text-foreground" : "text-primary-foreground"
          }`}>
            <span className="text-gold">GIF</span>
            <span className="text-gold/70">-Tech</span>
          </div>
          <div className={`hidden sm:flex flex-col leading-none ml-2 border-l pl-2 transition-colors ${
            scrolled ? "border-border" : "border-primary-foreground/20"
          }`}>
            <span className={`text-[10px] tracking-[0.15em] uppercase font-body font-medium transition-colors ${
              scrolled ? "text-muted-foreground" : "text-primary-foreground/60"
            }`}>
              Growth · Innovation
            </span>
            <span className={`text-[10px] tracking-[0.15em] uppercase font-body font-medium transition-colors ${
              scrolled ? "text-muted-foreground" : "text-primary-foreground/60"
            }`}>
              Flexibility
            </span>
          </div>
        </button>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => handleClick(link.href)}
              className={`relative font-body text-sm font-medium px-5 py-2 rounded-full transition-all duration-300 hover:text-gold ${
                scrolled
                  ? "text-foreground hover:bg-muted"
                  : "text-primary-foreground/80 hover:bg-primary-foreground/10"
              }`}
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => handleClick("#contact")}
            className="ml-3 font-body text-sm font-medium px-6 py-2.5 rounded-full bg-gold text-accent-foreground hover:bg-gold-light shadow-gold transition-all duration-300"
          >
            Démarrer un projet
          </button>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className={`md:hidden p-2 rounded-lg transition-colors ${
            scrolled
              ? "text-foreground hover:bg-muted"
              : "text-primary-foreground hover:bg-primary-foreground/10"
          }`}
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden bg-card/95 backdrop-blur-xl border-t border-border/50"
          >
            <div className="px-6 py-5 space-y-1">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleClick(link.href)}
                  className="block w-full text-left font-body text-foreground hover:text-gold transition-colors py-3 px-4 rounded-lg hover:bg-muted"
                >
                  {link.label}
                </button>
              ))}
              <button
                onClick={() => handleClick("#contact")}
                className="block w-full text-center font-body text-sm font-medium mt-3 px-6 py-3 rounded-full bg-gold text-accent-foreground hover:bg-gold-light shadow-gold transition-all duration-300"
              >
                Démarrer un projet
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
