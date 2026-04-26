import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import PortfolioSection from "@/components/PortfolioSection";
import AIConfigurator from "@/components/AIConfigurator";
import KPIsSection from "@/components/KPIsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import { useScrollDepth } from "@/hooks/use-scroll-depth";

const Index = () => {
  useScrollDepth();
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <ServicesSection />
      <PortfolioSection />
      <AIConfigurator />
      <KPIsSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
