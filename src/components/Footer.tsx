import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Twitter, 
  Instagram, 
  Youtube, 
  Mail, 
  ArrowRight,
  Heart
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-background border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Newsletter Section */}
        <div className="glass-card p-8 rounded-2xl mb-16 text-center">
          <h3 className="text-3xl font-bold mb-4">
            Stay <span className="gradient-text">Updated</span>
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Get notified about new resources, exclusive deals, and design trends. 
            Join 50,000+ creatives in our community.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input 
              placeholder="Enter your email"
              className="glass-card border-white/20 bg-transparent"
            />
            <Button className="bg-gradient-primary hover:bg-gradient-secondary px-6">
              Subscribe <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">R</span>
              </div>
              <span className="text-2xl font-bold gradient-text">ResourceHub</span>
            </div>
            <p className="text-muted-foreground mb-6">
              Your go-to platform for premium design resources. Start free, 
              upgrade when ready.
            </p>
            <div className="flex gap-3">
              <Button variant="ghost" size="sm" className="glass-card border-white/20 hover:bg-white/10">
                <Twitter className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="glass-card border-white/20 hover:bg-white/10">
                <Instagram className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="glass-card border-white/20 hover:bg-white/10">
                <Youtube className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="glass-card border-white/20 hover:bg-white/10">
                <Mail className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <div className="space-y-3">
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                Fonts
              </a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                Templates
              </a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                Stock Photos
              </a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                Graphics
              </a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                Tools
              </a>
            </div>
          </div>
          
          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <div className="space-y-3">
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                About Us
              </a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                Pricing
              </a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                Affiliate Program
              </a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                Blog
              </a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                Contact
              </a>
            </div>
          </div>
          
          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <div className="space-y-3">
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                Help Center
              </a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                License Info
              </a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                DMCA
              </a>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            © 2024 ResourceHub. All rights reserved.
          </p>
          <p className="text-muted-foreground text-sm flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-red-500 fill-current" /> for creators
          </p>
        </div>
      </div>
    </footer>
  );
}