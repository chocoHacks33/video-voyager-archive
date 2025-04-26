
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
  const imageSrc = image.source.startsWith('/public/') 
    ? image.source.replace('/public/', '/') 
    : image.source;

  // Add effect to log image source for debugging
  useEffect(() => {
    console.log(`Loading image from: ${imageSrc}`);
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
      className={cn(`bg-navy rounded-lg overflow-hidden shadow-md relative group transition-all duration-300 transform ${
        isHovered ? 'scale-105 -translate-y-2 shadow-xl z-10' : ''
      } ${selectable ? 'cursor-pointer' : ''} ${
        isSelected && selectable ? 'ring-4 ring-green-500' : ''
      }`, className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      
      <AspectRatio ratio={16/9} className="w-full">
        {isLoading ? (
          <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : imageError ? (
          <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex flex-col items-center justify-center p-4">
            <AlertTriangle className="w-10 h-10 text-amber-500 mb-2" />
            <p className="text-sm text-center">Image not found or unavailable</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-4 flex items-center gap-2"
              onClick={handleRetry}
            >
              <AlertTriangle className="w-4 h-4" />
              Retry
            </Button>
          </div>
        ) : (
          <img 
            src={imageSrc}
            alt={image.description}
            className="w-full h-full object-cover"
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        )}
      </AspectRatio>
      
      <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-80'}`}>
        <p className="text-base">{image.description}</p>
      </div>
      
      {isSelected && selectable && (
        <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
          <Check className="w-5 h-5 text-white" />
        </div>
      )}
    </div>
  );
};

export default ImageCard;
