import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useResources } from "@/hooks/useResources";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Upload, 
  Download, 
  Heart, 
  Eye, 
  Edit, 
  Trash2 
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ResourceCard from "@/components/ResourceCard";

export default function MyResources() {
  const [activeTab, setActiveTab] = useState<'uploaded' | 'liked' | 'downloaded'>('uploaded');
  const { currentUser } = useAuth();
  const { resources, likedResources, downloadedResources } = useResources();
  const navigate = useNavigate();

  // Get user's uploaded resources
  const userResources = resources.filter(resource => 
    resource.author === currentUser?.displayName || 
    resource.author === currentUser?.email ||
    resource.author === 'Anonymous'
  );

  // Get user's liked resources
  const likedResourcesList = resources.filter(resource => 
    likedResources.has(resource.id)
  );

  // Get user's downloaded resources
  const downloadedResourcesList = resources.filter(resource => 
    downloadedResources.has(resource.id)
  );

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
        <Card className="glass-card p-6 sm:p-8 max-w-md w-full text-center">
          <h2 className="text-xl sm:text-2xl font-bold gradient-text mb-3 sm:mb-4">Not Logged In</h2>
          <p className="text-muted-foreground mb-5 sm:mb-6 text-sm sm:text-base">
            You need to be logged in to view your resources.
          </p>
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
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-6 glass-card border-white/20 hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <div className="glass-card rounded-2xl p-6 sm:p-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold gradient-text mb-2">
                  My Resources
                </h1>
                <p className="text-muted-foreground">
                  Manage your uploaded resources and collections
                </p>
              </div>
              
              <Button 
                onClick={() => navigate("/upload")}
                className="bg-gradient-primary hover:bg-gradient-secondary py-3 text-lg"
              >
                <Upload className="w-5 h-5 mr-2" />
                Upload Resource
              </Button>
            </div>
            
            {/* Tabs */}
            <div className="border-b border-white/10 mb-8">
              <div className="flex space-x-8">
                <button
                  onClick={() => setActiveTab('uploaded')}
                  className={`pb-4 px-1 border-b-2 font-medium text-sm sm:text-base ${
                    activeTab === 'uploaded'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Uploaded ({userResources.length})
                </button>
                <button
                  onClick={() => setActiveTab('liked')}
                  className={`pb-4 px-1 border-b-2 font-medium text-sm sm:text-base ${
                    activeTab === 'liked'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Liked ({likedResourcesList.length})
                </button>
                <button
                  onClick={() => setActiveTab('downloaded')}
                  className={`pb-4 px-1 border-b-2 font-medium text-sm sm:text-base ${
                    activeTab === 'downloaded'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Downloaded ({downloadedResourcesList.length})
                </button>
              </div>
            </div>
            
            {/* Content */}
            {activeTab === 'uploaded' && (
              <div>
                {userResources.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="glass-card p-8 sm:p-12 rounded-2xl max-w-md mx-auto">
                      <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-xl font-bold mb-3">No Resources Uploaded</h3>
                      <p className="text-muted-foreground mb-6">
                        You haven't uploaded any resources yet. Get started by sharing your first design resource.
                      </p>
                      <Button 
                        onClick={() => navigate("/upload")}
                        className="bg-gradient-primary hover:bg-gradient-secondary"
                      >
                        Upload Your First Resource
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userResources.map((resource) => (
                      <ResourceCard key={resource.id} {...resource} />
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'liked' && (
              <div>
                {likedResourcesList.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="glass-card p-8 sm:p-12 rounded-2xl max-w-md mx-auto">
                      <Heart className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-xl font-bold mb-3">No Liked Resources</h3>
                      <p className="text-muted-foreground mb-6">
                        You haven't liked any resources yet. Start exploring and saving your favorite resources.
                      </p>
                      <Button 
                        onClick={() => navigate("/search")}
                        className="bg-gradient-primary hover:bg-gradient-secondary"
                      >
                        Browse Resources
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {likedResourcesList.map((resource) => (
                      <ResourceCard key={resource.id} {...resource} />
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'downloaded' && (
              <div>
                {downloadedResourcesList.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="glass-card p-8 sm:p-12 rounded-2xl max-w-md mx-auto">
                      <Download className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-xl font-bold mb-3">No Downloaded Resources</h3>
                      <p className="text-muted-foreground mb-6">
                        You haven't downloaded any resources yet. Start browsing and download what you need.
                      </p>
                      <Button 
                        onClick={() => navigate("/search")}
                        className="bg-gradient-primary hover:bg-gradient-secondary"
                      >
                        Browse Resources
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {downloadedResourcesList.map((resource) => (
                      <ResourceCard key={resource.id} {...resource} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}