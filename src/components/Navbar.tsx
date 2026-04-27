import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import logo from "@/assets/gif-tech-logo.png";

const navLinks = [
  { label: "Solutions", href: "#services" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Configurateur", href: "#configurateur" },
  { label: "Contact", href: "#contact" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
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
      transition={{ duration: 0.6 }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border/60"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between h-20">
        {/* Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-3 group"
          aria-label="GIF-Tech accueil"
        >
          <img
            src={logo}
            alt="GIF-Tech logo"
            width={40}
            height={40}
            className="w-10 h-10 object-contain"
          />
          <div className="font-display text-2xl font-semibold tracking-tight text-gradient-gold">
            GIF-TECH
          </div>
        </button>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => handleClick(link.href)}
              className="font-body text-sm font-medium text-foreground/70 hover:text-foreground px-4 py-2 rounded-full transition-colors hover:bg-muted/60"
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => handleClick("#contact")}
            className="ml-3 font-body text-sm font-semibold px-5 py-2.5 rounded-full bg-gradient-gold text-primary-foreground hover:opacity-95 shadow-gold transition-all"
          >
            Démarrer un projet
          </button>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 rounded-lg text-foreground hover:bg-muted/60"
          aria-label="Menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden bg-background/95 backdrop-blur-xl border-t border-border/60"
          >
            <div className="px-6 py-5 space-y-1">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleClick(link.href)}
                  className="block w-full text-left text-foreground/80 hover:text-foreground py-3 px-4 rounded-lg hover:bg-muted/60"
                >
                  {link.label}
                </button>
              ))}
              <button
                onClick={() => handleClick("#contact")}
                className="block w-full text-center font-semibold mt-3 px-6 py-3 rounded-full bg-gradient-gold text-primary-foreground shadow-gold"
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
