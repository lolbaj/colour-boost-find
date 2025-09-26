import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CategoriesSection from "@/components/CategoriesSection";
import FeaturedResources from "@/components/FeaturedResources";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <CategoriesSection />
      <FeaturedResources />
      <Footer />
    </div>
  );
};

export default Index;
