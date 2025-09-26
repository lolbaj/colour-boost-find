import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useResources } from "@/hooks/useResources";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import heroImage from "@/assets/hero-bg.jpg";

export default function Hero() {
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();
  const { setSearchQuery } = useResources();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchQuery(searchInput);
      navigate(`/search?q=${encodeURIComponent(searchInput)}`);
    }
  };
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <LazyLoadImage
          src={heroImage}
          alt="Hero background"
          effect="blur"
          className="w-full h-full object-cover"
          placeholder={<div className="w-full h-full bg-muted animate-pulse" />}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-hero opacity-80" />
      
      {/* Floating Elements - Hidden on mobile */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-secondary rounded-full animate-float opacity-60 hidden sm:block" />
      <div className="absolute top-40 right-20 w-16 h-16 bg-gradient-accent rounded-lg animate-float opacity-40 hidden sm:block" style={{ animationDelay: "1s" }} />
      <div className="absolute bottom-32 left-20 w-12 h-12 bg-gradient-primary rounded-full animate-float opacity-50 hidden sm:block" style={{ animationDelay: "2s" }} />
      
      {/* Main Content */}
      <div className="relative z-10 text-center max-w-6xl mx-auto px-4 sm:px-6">
        <div className="animate-fade-in">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 sm:mb-6 leading-tight">
            <span className="gradient-text">Discover</span> Premium <br />
            <span className="gradient-text">Resources</span> for Free
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl mb-8 sm:mb-12 text-foreground/80 max-w-3xl mx-auto leading-relaxed">
            Curated collection of stunning fonts, templates, stock photos, and design assets. 
            Start free, upgrade when you're ready to unlock premium features.
          </p>
          
          {/* Search Bar - Responsive */}
          <form onSubmit={handleSearch} className="glass-card p-1 sm:p-2 rounded-xl sm:rounded-2xl max-w-2xl mx-auto mb-6 sm:mb-8 group">
            <div className="flex items-center gap-2 sm:gap-4">
              <Search className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground ml-3 sm:ml-4" />
              <Input 
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search fonts, templates, photos..."
                className="border-0 bg-transparent text-base sm:text-lg placeholder:text-muted-foreground/60 focus-visible:ring-0"
              />
              <Button 
                type="submit"
                size="sm"
                className="sm:size-lg bg-gradient-primary hover:bg-gradient-secondary px-4 sm:px-8 py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <span className="hidden xs:inline sm:inline">Search</span>
                <Search className="inline xs:hidden sm:hidden w-4 h-4" />
              </Button>
            </div>
          </form>
          
          {/* CTA Buttons - Stacked on mobile */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
            <Button 
              size="sm"
              onClick={() => navigate('/search')}
              className="bg-gradient-primary hover:bg-gradient-secondary px-6 sm:px-10 py-3 sm:py-4 text-base sm:text-lg rounded-lg sm:rounded-xl font-semibold shadow-lg hover:shadow-xl glow-on-hover w-full sm:w-auto"
            >
              Explore Resources
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="glass-card px-6 sm:px-10 py-3 sm:py-4 text-base sm:text-lg rounded-lg sm:rounded-xl font-semibold hover:bg-white/10 border-white/20 w-full sm:w-auto"
            >
              How It Works
            </Button>
          </div>
        </div>
      </div>
      
      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}