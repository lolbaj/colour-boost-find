import { useParams, useNavigate } from "react-router-dom";
import { useResources } from "@/hooks/useResources";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { 
  ArrowLeft, 
  Download, 
  Heart, 
  Share2, 
  User, 
  Calendar,
  FileText,
  Monitor,
  Shield,
  Star,
  Bookmark,
  MessageCircle,
  Loader2
} from "lucide-react";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/lib/toast";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { CollectionsSheet } from '@/components/CollectionsSheet';
import { ShareDialog } from '@/components/ShareDialog';
import { CommentsSection } from '@/components/CommentsSection';

export default function ResourceDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getResourceById, toggleLike, likedResources, addDownload, isLoading, isError, isResourceInCollection } = useResources();
  const { currentUser } = useAuth();
  const [isDownloading, setIsDownloading] = useState(false);
  const [isCollectionsSheetOpen, setIsCollectionsSheetOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  
  const resource = getResourceById(id || '');
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (isError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center glass-card p-6 sm:p-12 rounded-2xl">
          <h1 className="text-xl sm:text-2xl font-bold mb-4">Failed to load resource</h1>
          <p className="text-muted-foreground mb-6 text-sm sm:text-base">Something went wrong. Please try again later.</p>
          <Button onClick={() => navigate('/')} className="bg-gradient-primary">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }
  
  if (!resource) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center glass-card p-6 sm:p-12 rounded-2xl">
          <h1 className="text-xl sm:text-2xl font-bold mb-4">Resource not found</h1>
          <Button onClick={() => navigate('/')} className="bg-gradient-primary">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const handleDownload = async () => {
    // If user is not logged in and resource is premium, redirect to login
    if (!currentUser && resource.isPremium) {
      toast.error("Please log in to download premium resources");
      navigate('/auth/login');
      return;
    }
    
    setIsDownloading(true);
    // Simulate download process
    await new Promise(resolve => setTimeout(resolve, 2000));
    addDownload(resource.id);
    setIsDownloading(false);
    
    toast.success("Download started!");
  };

  const handleLike = () => {
    // If user is not logged in, redirect to login
    if (!currentUser) {
      toast.error("Please log in to like resources");
      navigate('/auth/login');
      return;
    }
    
    toggleLike(resource.id);
  };

  

  const isLiked = likedResources.has(resource.id);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 sm:pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-4 sm:mb-8 glass-card border-white/20 hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12">
            {/* Resource Preview */}
            <div className="space-y-4 sm:space-y-6">
              <Card className="glass-card overflow-hidden">
                <div className="aspect-video">
                  <LazyLoadImage
                    src={resource.image}
                    alt={resource.title}
                    effect="blur"
                    className="w-full h-full object-cover"
                    placeholder={<div className="w-full h-full bg-muted animate-pulse" />}
                  />
                </div>
              </Card>
              
              {/* Additional Info Cards */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <Card className="glass-card p-3 sm:p-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    <div>
                      <p className="text-xs sm:text-sm text-muted-foreground">File Size</p>
                      <p className="font-semibold text-sm sm:text-base">{resource.fileSize}</p>
                    </div>
                  </div>
                </Card>
                
                <Card className="glass-card p-3 sm:p-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Monitor className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    <div>
                      <p className="text-xs sm:text-sm text-muted-foreground">Format</p>
                      <p className="font-semibold text-sm sm:text-base">{resource.format}</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Resource Details */}
            <div className="space-y-4 sm:space-y-6">
              <div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <Badge variant="secondary" className="text-xs sm:text-sm">{resource.category}</Badge>
                  {resource.isPremium && (
                    <Badge className="bg-gradient-accent text-xs sm:text-sm">Premium</Badge>
                  )}
                  <Badge variant="outline" className="border-green-500/20 text-green-400 text-xs sm:text-sm">
                    <Shield className="w-2 h-2 sm:w-3 sm:h-3 mr-1" />
                    {resource.license}
                  </Badge>
                </div>
                
                <h1 className="text-2xl sm:text-4xl font-bold mb-3 sm:mb-4 gradient-text">
                  {resource.title}
                </h1>
                
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-4 sm:mb-6">
                  {resource.description}
                </p>

                {/* Rating Section */}
                <div className="mb-4 sm:mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star}
                          className={`w-4 h-4 ${
                            star <= (resource.averageRating || 0) 
                              ? 'text-yellow-400 fill-yellow-400' 
                              : 'text-gray-300 fill-gray-300'
                          }`} 
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm">
                      {(resource.averageRating || 0).toFixed(1)}/5.0
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {resource.totalRatings} {resource.totalRatings === 1 ? 'rating' : 'ratings'}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 sm:gap-2 mb-4 sm:mb-6">
                  {resource.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="border-white/20 text-xs sm:text-sm">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Author & Date */}
                <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-6 sm:mb-8 text-xs sm:text-sm text-muted-foreground">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <User className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>{resource.author}</span>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>{new Date(resource.dateAdded).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Action Buttons - Stacked on mobile */}
                <div className="space-y-3 sm:space-y-4">
                  <Button 
                    size="lg" 
                    className="w-full bg-gradient-primary hover:bg-gradient-secondary text-base sm:text-lg py-3 sm:py-4 shadow-lg hover:shadow-xl glow-on-hover"
                    onClick={handleDownload}
                    disabled={isDownloading}
                  >
                    <Download className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    {isDownloading ? 'Downloading...' : resource.isPremium ? 'Get Premium Access' : 'Download Free'}
                  </Button>
                  
                  <div className="flex gap-2 sm:gap-3">
                    <Button 
                      variant="outline" 
                      size="lg"
                      className="flex-1 glass-card border-white/20 hover:bg-white/10 text-sm sm:text-base"
                      onClick={handleLike}
                    >
                      <Heart className={`w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                      <span className="hidden xs:inline">{isLiked ? 'Liked' : 'Like'}</span> 
                      <span className="xs:hidden">{isLiked ? '❤' : '🤍'}</span>
                      <span className="ml-1">({resource.likes.toLocaleString()})</span>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="lg"
                      className="glass-card border-white/20 hover:bg-white/10 p-2 sm:p-4"
                      onClick={() => {
                        // If user is not logged in, redirect to login
                        if (!currentUser) {
                          toast.error("Please log in to save resources to collections");
                          navigate('/auth/login');
                          return;
                        }
                        setIsCollectionsSheetOpen(true);
                      }}
                    >
                      <Bookmark className="w-4 h-4 sm:w-5 sm:h-5" />
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="lg"
                      className="glass-card border-white/20 hover:bg-white/10 p-2 sm:p-4"
                      onClick={() => setIsShareDialogOpen(true)}
                    >
                      <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </Button>
                  </div>
                </div>

                {/* Stats */}
                <Card className="glass-card p-4 sm:p-6 mt-6 sm:mt-8">
                  <h3 className="font-semibold mb-3 sm:mb-4 text-base sm:text-lg">Resource Stats</h3>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 text-center">
                    <div>
                      <p className="text-xl sm:text-2xl font-bold gradient-text">{resource.downloads.toLocaleString()}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">Downloads</p>
                    </div>
                    <div>
                      <p className="text-xl sm:text-2xl font-bold gradient-text">{resource.likes.toLocaleString()}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">Likes</p>
                    </div>
                  </div>
                </Card>
                
                {/* Comments Section */}
                <div className="mt-8 sm:mt-12">
                  <CommentsSection 
                    resourceId={resource.id} 
                    title={resource.title} 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <CollectionsSheet 
        resourceId={resource.id}
        title={resource.title}
        isOpen={isCollectionsSheetOpen}
        onClose={() => setIsCollectionsSheetOpen(false)}
      />
      
      <ShareDialog
        title={resource.title}
        url={`${window.location.protocol}//${window.location.host}/resource/${resource.id}`}
        description={resource.description}
        isOpen={isShareDialogOpen}
        onClose={() => setIsShareDialogOpen(false)}
      />
      
      <Footer />
    </div>
  );
}