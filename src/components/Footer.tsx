const Footer = () => (
  <footer className="bg-primary py-12">
    <div className="container mx-auto px-6 text-center">
      <span className="font-display text-2xl font-bold text-primary-foreground">
        <span className="text-gradient-gold">GIF</span><span className="text-primary-foreground/70">-Tech</span>
      </span>
      <p className="text-primary-foreground/50 text-sm font-body mt-3">
        © {new Date().getFullYear()} GIF-Tech — Growth · Innovation · Flexibility
      </p>
    </div>
  </footer>
);

export default Footer;
