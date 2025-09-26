import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import UpdateProfile from "@/components/auth/UpdateProfile";
import { ArrowLeft, Upload, FolderOpen } from "lucide-react";

export default function Profile() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error: unknown) {
      console.error("Failed to log out", error);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
        <Card className="glass-card p-6 sm:p-8 max-w-md w-full text-center">
          <h2 className="text-xl sm:text-2xl font-bold gradient-text mb-3 sm:mb-4">Not Logged In</h2>
          <p className="text-muted-foreground mb-5 sm:mb-6 text-sm sm:text-base">You need to be logged in to view this page.</p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Button 
              onClick={() => navigate("/auth/login")}
              className="bg-gradient-primary hover:bg-gradient-secondary"
            >
              Login
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate("/auth/signup")}
              className="glass-card border-white/20 hover:bg-white/10"
            >
              Sign Up
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20 sm:pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Back button for mobile */}
        <div className="flex justify-start mb-4 sm:mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="glass-card border-white/20 hover:bg-white/10 p-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-8">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold gradient-text">Your Profile</h1>
            <div className="flex gap-2">
              <Button 
                onClick={() => navigate("/my-resources")}
                className="hidden sm:flex bg-gradient-secondary hover:bg-gradient-accent py-2 sm:py-3 text-sm sm:text-base"
              >
                <FolderOpen className="w-4 h-4 mr-2" />
                My Resources
              </Button>
              <Button 
                onClick={() => navigate("/upload")}
                className="hidden sm:flex bg-gradient-primary hover:bg-gradient-secondary py-2 sm:py-3 text-sm sm:text-base"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Resource
              </Button>
            </div>
          </div>
          
          {/* Mobile Buttons */}
          <div className="sm:hidden mb-4 flex gap-2">
            <Button 
              onClick={() => navigate("/my-resources")}
              className="flex-1 bg-gradient-secondary hover:bg-gradient-accent py-3 text-base"
            >
              <FolderOpen className="w-4 h-4 mr-2" />
              My Resources
            </Button>
            <Button 
              onClick={() => navigate("/upload")}
              className="flex-1 bg-gradient-primary hover:bg-gradient-secondary py-3 text-base"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="lg:col-span-2">
              <UpdateProfile />
            </div>
            
            <Card className="glass-card p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Account Stats</h3>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground text-xs sm:text-sm">Resources Downloaded</span>
                  <span className="font-semibold text-xs sm:text-sm">0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground text-xs sm:text-sm">Resources Liked</span>
                  <span className="font-semibold text-xs sm:text-sm">0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground text-xs sm:text-sm">Collections Created</span>
                  <span className="font-semibold text-xs sm:text-sm">0</span>
                </div>
              </div>
            </Card>
          </div>
          
          <div className="border-t border-white/10 pt-4 sm:pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg sm:text-xl font-semibold mb-1">
                  {currentUser.displayName || "User"}
                </h2>
                <p className="text-muted-foreground text-sm sm:text-base">{currentUser.email}</p>
              </div>
              <Button 
                onClick={handleLogout}
                variant="outline"
                className="glass-card border-white/20 hover:bg-white/10 w-full sm:w-auto"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}