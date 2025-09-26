import ResourceCard from "./ResourceCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import { useResources } from "@/hooks/useResources";

export default function FeaturedResources() {
  const { resources, isLoading, isError } = useResources();
  
  // Get top 6 resources by likes as featured resources
  const featuredResources = [...resources]
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 6);

  if (isLoading) {
    return (
      <section className="py-24 px-6 bg-background/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-16">
            <div className="animate-fade-in">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="gradient-text">Featured</span> Resources
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl">
                Hand-picked premium resources that are trending this week. 
                Get started with our free tier or upgrade for full access.
              </p>
            </div>
          </div>
          
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="py-24 px-6 bg-background/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-16">
            <div className="animate-fade-in">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="gradient-text">Featured</span> Resources
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl">
                Hand-picked premium resources that are trending this week. 
                Get started with our free tier or upgrade for full access.
              </p>
            </div>
          </div>
          
          <div className="text-center py-16">
            <div className="glass-card p-8 rounded-2xl max-w-md mx-auto">
              <h3 className="text-xl font-bold mb-2">Something went wrong</h3>
              <p className="text-muted-foreground mb-4">
                Failed to load featured resources.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 px-6 bg-background/50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-16">
          <div className="animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">Featured</span> Resources
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Hand-picked premium resources that are trending this week. 
              Get started with our free tier or upgrade for full access.
            </p>
          </div>
          
          <Button 
            variant="outline" 
            size="lg"
            className="glass-card border-white/20 hover:bg-white/10 hidden md:flex items-center gap-2"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredResources.map((resource, index) => (
            <div
              key={resource.id}
              className="animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ResourceCard {...resource} />
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button 
            size="lg" 
            className="bg-gradient-primary hover:bg-gradient-secondary px-8 py-4 text-lg rounded-xl font-semibold shadow-lg hover:shadow-xl glow-on-hover md:hidden"
          >
            View All Resources <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
}