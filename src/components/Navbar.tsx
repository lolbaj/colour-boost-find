import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Menu, User, Heart, Download, X, Upload, FolderOpen, Bell } from "lucide-react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useResources } from "@/hooks/useResources";
import { useAuth } from "@/hooks/useAuth";
import { ThemeToggle } from "@/components/ThemeToggle";
import { NotificationDropdown } from "@/components/NotificationDropdown";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();
  const { setSearchQuery, likedResources, downloadedResources } = useResources();
  const { currentUser, logout } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchQuery(searchInput);
      navigate(`/search?q=${encodeURIComponent(searchInput)}`);
      setIsSearchOpen(false);
      setIsMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error: unknown) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 sm:gap-3" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-primary rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-base sm:text-lg">R</span>
            </div>
            <span className="text-xl sm:text-2xl font-bold gradient-text truncate max-w-[120px] sm:max-w-none">ResourceHub</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => navigate('/search')} className="text-foreground hover:text-primary transition-colors font-medium">
              Browse
            </button>
            <a href="#" className="text-foreground hover:text-primary transition-colors font-medium">
              Categories
            </a>
            <a href="#" className="text-foreground hover:text-primary transition-colors font-medium">
              Collections
            </a>
            <a href="#" className="text-foreground hover:text-primary transition-colors font-medium">
              Pricing
            </a>
          </div>
          
          {/* Right Side Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Search Button - Visible on all screens now */}
            <Button 
              variant="ghost" 
              size="sm"
              className="glass-card border-white/20 hover:bg-white/10"
              onClick={() => {
                if (window.innerWidth < 640) {
                  setIsSearchOpen(true);
                } else {
                  // Focus on search input if it exists
                  const searchInput = document.getElementById('navbar-search-input');
                  if (searchInput) {
                    searchInput.focus();
                  }
                }
              }}
            >
              <Search className="w-4 h-4" />
            </Button>
            
            {/* Upload Button for authenticated users - Hidden on mobile */}
            {currentUser && (
              <Button 
                variant="ghost" 
                size="sm"
                className="hidden sm:flex glass-card border-white/20 hover:bg-white/10"
                onClick={() => navigate('/upload')}
              >
                <Upload className="w-4 h-4" />
              </Button>
            )}
            
            {/* Favorites - Show on sm screens and up */}
            <Button 
              variant="ghost" 
              size="sm"
              className="hidden sm:flex glass-card border-white/20 hover:bg-white/10 relative"
            >
              <Heart className="w-4 h-4" />
              <Badge className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center text-xs bg-gradient-accent">
                {likedResources.size}
              </Badge>
            </Button>
            
            {/* Downloads - Show on sm screens and up */}
            <Button 
              variant="ghost" 
              size="sm"
              className="hidden sm:flex glass-card border-white/20 hover:bg-white/10 relative"
            >
              <Download className="w-4 h-4" />
              <Badge className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center text-xs bg-gradient-secondary">
                {downloadedResources.size}
              </Badge>
            </Button>
            
            {/* Notifications */}
            <NotificationDropdown />
            
            {/* Theme Toggle */}
            <ThemeToggle />
            
            {/* User Profile */}
            {currentUser ? (
              <div className="relative group">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="glass-card border-white/20 hover:bg-white/10 flex items-center gap-1 sm:gap-2"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden lg:inline">{currentUser.displayName || currentUser.email}</span>
                </Button>
                <div className="absolute right-0 mt-1 w-48 bg-background border border-white/10 rounded-lg shadow-lg py-1 hidden group-hover:block md:group-hover:block">
                  <Link to="/profile" className="block px-4 py-2 text-sm hover:bg-white/10">Profile</Link>
                  <Link to="/my-resources" className="block px-4 py-2 text-sm hover:bg-white/10">My Resources</Link>
                  <Link to="/upload" className="block px-4 py-2 text-sm hover:bg-white/10">Upload Resource</Link>
                  <button 
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-white/10"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link to="/auth/login">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="glass-card border-white/20 hover:bg-white/10"
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/auth/signup">
                  <Button 
                    variant="default" 
                    size="sm"
                    className="bg-gradient-primary hover:bg-gradient-secondary"
                  >
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
            
            {/* Mobile Menu */}
            <Button 
              variant="ghost" 
              size="sm"
              className="md:hidden glass-card border-white/20 hover:bg-white/10"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>
        </div>
        
        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <div className="md:hidden mt-3 pt-3 border-t border-white/10">
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <input
                id="navbar-search-input"
                type="text"
                placeholder="Search resources..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="flex-1 px-3 py-2 bg-background border border-white/20 rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                autoFocus
              />
              <Button 
                type="submit"
                variant="ghost" 
                size="sm"
                className="glass-card border-white/20 hover:bg-white/10"
              >
                <Search className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className="glass-card border-white/20 hover:bg-white/10"
                onClick={() => setIsSearchOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </form>
          </div>
        )}
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-3 pt-3 border-t border-white/10 animate-slide-up">
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => {
                  navigate('/search');
                  setIsMenuOpen(false);
                }} 
                className="text-foreground hover:text-primary transition-colors font-medium text-left py-2"
              >
                Browse
              </button>
              <a href="#" className="text-foreground hover:text-primary transition-colors font-medium py-2">
                Categories
              </a>
              <a href="#" className="text-foreground hover:text-primary transition-colors font-medium py-2">
                Collections
              </a>
              <a href="#" className="text-foreground hover:text-primary transition-colors font-medium py-2">
                Pricing
              </a>
              
              {/* Mobile User Actions */}
              {currentUser ? (
                <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
                  <Link 
                    to="/profile" 
                    className="text-foreground hover:text-primary transition-colors font-medium py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link 
                    to="/my-resources" 
                    className="text-foreground hover:text-primary transition-colors font-medium py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FolderOpen className="w-4 h-4 inline mr-2" />
                    My Resources
                  </Link>
                  <Link 
                    to="/upload" 
                    className="text-foreground hover:text-primary transition-colors font-medium py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Upload className="w-4 h-4 inline mr-2" />
                    Upload Resource
                  </Link>
                  <button 
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="text-foreground hover:text-primary transition-colors font-medium text-left py-2"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
                  <Link 
                    to="/auth/login" 
                    className="text-foreground hover:text-primary transition-colors font-medium py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/auth/signup" 
                    className="text-foreground hover:text-primary transition-colors font-medium py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
              
              {/* Mobile Stats */}
              <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    <span className="text-sm">Likes</span>
                  </div>
                  <span className="text-sm">{likedResources.size}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    <span className="text-sm">Downloads</span>
                  </div>
                  <span className="text-sm">{downloadedResources.size}</span>
                </div>
                
                {/* Theme Toggle for Mobile */}
                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <span className="text-sm">Theme</span>
                  <ThemeToggle />
                </div>
                
                {/* Notifications for Mobile */}
                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <span className="text-sm">Notifications</span>
                  <NotificationDropdown />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}