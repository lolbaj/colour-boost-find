import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Download, ExternalLink, Star } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useResources } from "@/hooks/useResources";
import { useAuth } from "@/hooks/useAuth";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

interface ResourceCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  isPremium?: boolean;
  downloads: number;
  likes: number;
  averageRating?: number;
  totalRatings?: number;
}

export default function ResourceCard({ 
  id,
  title, 
  description, 
  image, 
  category, 
  isPremium = false, 
  downloads, 
  likes 
}: ResourceCardProps) {
  const navigate = useNavigate();
  const { toggleLike, likedResources } = useResources();
  const { currentUser } = useAuth();
  const isLiked = likedResources.has(id);

  const handleCardClick = () => {
    navigate(`/resource/${id}`);
  };

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // If user is not logged in, redirect to login
    if (!currentUser) {
      navigate('/auth/login');
      return;
    }
    
    toggleLike(id);
  };

  const handleDownloadClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // If user is not logged in and resource is premium, redirect to login
    if (!currentUser && isPremium) {
      navigate('/auth/login');
      return;
    }
    
    // For demo purposes, we'll just show an alert
    alert(isPremium ? 'Premium download would start now!' : 'Download would start now!');
  };

  return (
    <Card className="glass-card hover-lift group overflow-hidden cursor-pointer" onClick={handleCardClick}>
      {/* Image Container */}
      <div className="relative aspect-video overflow-hidden">
        <LazyLoadImage
          src={image}
          alt={title}
          effect="blur"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          placeholder={<div className="w-full h-full bg-muted animate-pulse" />}
        />
        
        {/* Overlay - Simplified for mobile */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 flex gap-2">
            <Button 
              size="sm" 
              className="bg-gradient-primary hover:bg-gradient-secondary flex-1 shadow-lg text-sm sm:text-base py-1 sm:py-2"
              onClick={handleDownloadClick}
            >
              <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden xs:inline">{isPremium ? 'Get Premium' : 'Download'}</span>
              <span className="xs:hidden">{isPremium ? 'Premium' : 'DL'}</span>
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="glass-card border-white/20 hover:bg-white/10 p-1 sm:p-2"
            >
              <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
          </div>
        </div>
        
        {/* Badges */}
        <div className="absolute top-3 sm:top-4 left-3 sm:left-4 flex gap-1 sm:gap-2">
          <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm text-xs sm:text-sm">
            {category}
          </Badge>
          {isPremium && (
            <Badge className="bg-gradient-accent text-white shadow-lg text-xs sm:text-sm">
              Premium
            </Badge>
          )}
        </div>
        
        {/* Like Button */}
        <Button
          size="sm"
          variant="ghost"
          className="absolute top-3 sm:top-4 right-3 sm:right-4 w-8 h-8 sm:w-10 sm:h-10 rounded-full glass-card border-white/20 hover:bg-white/10 p-1 sm:p-2"
          onClick={handleLikeClick}
        >
          <Heart className={`w-3 h-3 sm:w-4 sm:h-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-white'}`} />
        </Button>
      </div>
      
      {/* Content */}
      <div className="p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-semibold mb-2 group-hover:gradient-text transition-all duration-300">
          {title}
        </h3>
        
        <p className="text-muted-foreground text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
          {description}
        </p>
        
        {/* Stats */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-3 sm:gap-4">
            <span className="flex items-center gap-1">
              <Download className="w-3 h-3 sm:w-4 sm:h-4" />
              {downloads.toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <Heart className="w-3 h-3 sm:w-4 sm:h-4" />
              {likes.toLocaleString()}
            </span>
          </div>
          
          {isPremium && (
            <span className="text-primary font-medium text-xs sm:text-sm">Pro Only</span>
          )}
        </div>
        
        {/* Rating Section */}
                <div className="flex items-center mt-1">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star}
                        className={`w-3 h-3 ${
                  star <= (averageRating || 0) 
                    ? 'text-yellow-400 fill-yellow-400' 
                    : 'text-gray-300 fill-gray-300'
                }`} 
                      />
                    ))}
                  </div>
                  <span className="ml-1 text-xs text-muted-foreground">
                    {(averageRating || 0).toFixed(1)}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {totalRatings} {totalRatings === 1 ? 'rating' : 'ratings'}
                </div>
      </div>
    </Card>
  );
}