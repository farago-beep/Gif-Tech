const Footer = () => (
  <footer className="bg-primary py-12">
    <div className="container mx-auto px-6 text-center">
      <span className="font-display text-xl font-bold text-primary-foreground">
        Digital<span className="text-gradient-gold">Pro</span>
      </span>
      <p className="text-primary-foreground/50 text-sm font-body mt-3">
        © {new Date().getFullYear()} DigitalPro — Expert en solutions digitales pour TPE & PME
      </p>
    </div>
  </footer>
);

export default Footer;
