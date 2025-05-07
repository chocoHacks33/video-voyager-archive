
import React, { useState, useEffect } from 'react';
import { AlertTriangle, Check } from 'lucide-react';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ImageData } from '@/components/gallery/types';

interface ImageCardProps {
  image: ImageData;
  isSelected: boolean;
  onSelect: () => void;
  selectable?: boolean;
  className?: string;
}

const ImageCard = ({ 
  image, 
  isSelected, 
  onSelect,
  selectable = true,
  className
}: ImageCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Format image source to ensure it's accessible
  const imageSrc = image.source;

  // Add effect to log image source for debugging
  useEffect(() => {
    console.log(`Loading image from: ${imageSrc}`);
    
    // Preload image
    const preloadImg = new Image();
    preloadImg.src = imageSrc;
    preloadImg.onload = handleImageLoad;
    preloadImg.onerror = handleImageError;
    
    return () => {
      preloadImg.onload = null;
      preloadImg.onerror = null;
    };
  }, [imageSrc]);

  const handleImageError = () => {
    console.error(`Failed to load image: ${imageSrc}`);
    setImageError(true);
    setIsLoading(false);
  };

  const handleRetry = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent selection when clicking retry button
    setIsLoading(true);
    setImageError(false);
    
    // Force reload the image by adding a timestamp to the URL
    const img = new Image();
    img.src = `${imageSrc}?t=${new Date().getTime()}`;
    img.onload = handleImageLoad;
    img.onerror = handleImageError;
  };

  const handleCardClick = () => {
    if (onSelect) {
      onSelect();
    }
  };

  const handleImageLoad = () => {
    console.log(`Successfully loaded image: ${imageSrc}`);
    setIsLoading(false);
  };

  return (
    <div 
      className={cn(`rounded-lg overflow-hidden shadow-md relative group transition-all duration-300 transform ${
        isHovered ? 'scale-105 -translate-y-2 shadow-xl dark:shadow-purple-900/30 z-10' : ''
      } ${selectable ? 'cursor-pointer' : ''} ${
        isSelected && selectable ? 'ring-4 ring-purple-500 dark:ring-purple-600' : ''
      }`, className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      
      <AspectRatio ratio={16/9} className="w-full">
        {isLoading && (
          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center absolute top-0 left-0 z-10 animate-pulse-slow">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 dark:border-purple-400"></div>
          </div>
        )}
        
        <img 
          src={imageSrc}
          alt={image.description}
          className={cn("w-full h-full object-cover", 
            isLoading ? "opacity-0" : "opacity-100",
            "transition-all duration-500"
          )}
          onLoad={handleImageLoad}
          onError={handleImageError}
          style={{ display: imageError ? "none" : "block" }}
        />
        
        {imageError && (
          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex flex-col items-center justify-center p-4">
            <AlertTriangle className="w-10 h-10 text-amber-500 mb-2" />
            <p className="text-sm text-center dark:text-gray-300">Image not found or unavailable</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-4 flex items-center gap-2 bg-white/20 dark:bg-gray-800/50 hover:bg-white/30 dark:hover:bg-gray-700/50"
              onClick={handleRetry}
            >
              <AlertTriangle className="w-4 h-4" />
              Retry
            </Button>
          </div>
        )}
      </AspectRatio>
      
      <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-80'}`}>
        <p className="text-base">{image.description}</p>
      </div>
      
      {isSelected && selectable && (
        <div className="absolute top-2 right-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full p-1.5 shadow-lg animate-appear">
          <Check className="w-4 h-4 text-white" />
        </div>
      )}
      
      {/* Add shine effect on hover */}
      <div 
        className={cn(
          "absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full",
          isHovered ? "animate-shimmer" : ""
        )}
        style={{ pointerEvents: 'none' }}
      />
    </div>
  );
};

export default ImageCard;
