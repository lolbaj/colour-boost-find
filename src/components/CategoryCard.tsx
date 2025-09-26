import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useResources } from "@/hooks/useResources";

interface CategoryCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  itemCount: number;
  gradient: string;
}

export default function CategoryCard({ title, description, icon: Icon, itemCount, gradient }: CategoryCardProps) {
  const navigate = useNavigate();
  const { setSelectedCategory } = useResources();

  const handleClick = () => {
    setSelectedCategory(title);
    navigate(`/category/${encodeURIComponent(title)}`);
  };

  return (
    <Card 
      className="glass-card hover-lift glow-on-hover cursor-pointer group overflow-hidden relative"
      onClick={handleClick}
    >
      <div className={`absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300 ${gradient}`} />
      
      <div className="p-8 relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${gradient} shadow-lg`}>
            <Icon className="w-7 h-7 text-white" />
          </div>
          <span className="text-sm text-muted-foreground bg-muted/20 px-3 py-1 rounded-full">
            {itemCount.toLocaleString()} items
          </span>
        </div>
        
        <h3 className="text-2xl font-bold mb-3 group-hover:gradient-text transition-all duration-300">
          {title}
        </h3>
        
        <p className="text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
    </Card>
  );
}