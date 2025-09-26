import { Type, FileImage, Camera, Palette, Layout, Zap } from "lucide-react";
import CategoryCard from "./CategoryCard";

const categories = [
  {
    title: "Premium Fonts",
    description: "Discover beautiful typefaces for your next project. From elegant serifs to modern sans-serifs.",
    icon: Type,
    itemCount: 2547,
    gradient: "bg-gradient-primary"
  },
  {
    title: "Web Templates",
    description: "Responsive website templates and UI kits for developers and designers.",
    icon: Layout,
    itemCount: 1823,
    gradient: "bg-gradient-secondary"
  },
  {
    title: "Stock Photos",
    description: "High-quality photography for commercial and personal use.",
    icon: Camera,
    itemCount: 15420,
    gradient: "bg-gradient-accent"
  },
  {
    title: "Graphics & Icons",
    description: "Vector graphics, illustrations, and icon sets for any design project.",
    icon: Palette,
    itemCount: 8956,
    gradient: "bg-gradient-primary"
  },
  {
    title: "Design Assets",
    description: "Mockups, textures, patterns, and other design elements.",
    icon: FileImage,
    itemCount: 3214,
    gradient: "bg-gradient-secondary"
  },
  {
    title: "Premium Tools",
    description: "Design software, plugins, and productivity tools for creatives.",
    icon: Zap,
    itemCount: 456,
    gradient: "bg-gradient-accent"
  }
];

export default function CategoriesSection() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Explore <span className="gradient-text">Categories</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Browse our carefully curated collection of premium resources across multiple categories. 
            Start free and upgrade to unlock premium features.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <div
              key={category.title}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CategoryCard {...category} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}