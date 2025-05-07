
import React, { useState, useEffect } from 'react';
import { AlertTriangle, Check, Image } from 'lucide-react';
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
      className={cn(
        "overflow-hidden relative transition-all duration-300", 
        isSelected && selectable ? "ring-2 ring-purple-500 dark:ring-purple-600 ring-offset-2 dark:ring-offset-gray-900" : "",
        selectable && "cursor-pointer",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      <div className="relative">
        <AspectRatio ratio={16/9} className="w-full bg-gray-100 dark:bg-gray-800">
          {isLoading && (
            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center absolute top-0 left-0 z-10">
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-purple-500 border-b-purple-500 animate-spin"></div>
                <div className="absolute inset-1 rounded-full border-2 border-transparent border-r-indigo-400 border-l-indigo-400 animate-spin animate-reverse"></div>
              </div>
            </div>
          )}
          
          <img 
            src={imageSrc}
            alt={image.description}
            className={cn(
              "w-full h-full object-cover transition-all duration-500",
              isHovered ? "scale-105" : "scale-100",
              isLoading ? "opacity-0" : "opacity-100"
            )}
            onLoad={handleImageLoad}
            onError={handleImageError}
            style={{ display: imageError ? "none" : "block" }}
          />
          
          {imageError && (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex flex-col items-center justify-center p-4">
              <div className="bg-white/20 dark:bg-white/5 backdrop-blur-sm w-16 h-16 rounded-full flex items-center justify-center mb-3">
                <AlertTriangle className="w-8 h-8 text-amber-500" />
              </div>
              <p className="text-sm text-center dark:text-gray-300 mb-2">Image not available</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2 border border-amber-200 dark:border-amber-800 bg-white/50 dark:bg-gray-800/50 hover:bg-amber-50 dark:hover:bg-amber-900/20 text-amber-600 dark:text-amber-400"
                onClick={handleRetry}
              >
                <AlertTriangle className="w-3 h-3 mr-1" />
                Retry
              </Button>
            </div>
          )}
        </AspectRatio>
        
        {/* Overlay gradient on hover */}
        <div 
          className={cn(
            "absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent",
            "opacity-0 transition-opacity duration-300",
            isHovered ? "opacity-100" : ""
          )}
        />
        
        {/* Image information overlay */}
        <div 
          className={cn(
            "absolute bottom-0 left-0 right-0 p-4 text-white transform transition-transform duration-300",
            isHovered ? "translate-y-0" : "translate-y-8 opacity-80"
          )}
        >
          <p className={cn(
            "text-base font-medium transition-all duration-300",
            isHovered ? "opacity-100" : "opacity-90"
          )}>
            {image.description}
          </p>
        </div>
      </div>
      
      {/* Add shine effect on hover */}
      <div 
        className={cn(
          "absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full",
          isHovered ? "animate-shimmer" : ""
        )}
        style={{ pointerEvents: 'none' }}
      />
    </div>
  );
};

export default ImageCard;
