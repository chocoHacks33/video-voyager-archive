
import React, { useEffect } from 'react';
import { cn } from "@/lib/utils";
import ImageCard from '@/components/ImageCard';
import { ImageData } from './types';
import CreditsDisplay from '@/components/CreditsDisplay';
import { toast } from '@/components/ui/custom-toast';

interface GalleryGridProps {
  images: ImageData[];
  selectedImages: number[];
  onSelectImage: (imageId: number) => void;
  campaignLaunched: boolean;
  onAdClick: (imageId: number) => void;
}

const calculateGridColumns = (imageCount: number): string => {
  if (imageCount <= 2) {
    return imageCount === 1 ? 'grid-cols-1' : 'grid-cols-2';
  }
  if (imageCount <= 4) {
    return 'grid-cols-2';
  }
  return 'grid-cols-3';
};

const GalleryGrid = ({ 
  images, 
  selectedImages, 
  onSelectImage, 
  campaignLaunched,
  onAdClick 
}: GalleryGridProps) => {
  
  useEffect(() => {
    console.log(`GalleryGrid rendering with ${images.length} images`);
    
    // Better preloading with error handling
    const preloadPromises = images.map(image => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = image.source;
        img.onload = () => {
          console.log(`Successfully preloaded: ${image.source}`);
          resolve(image.source);
        };
        img.onerror = () => {
          console.error(`Failed to preload: ${image.source}`);
          reject(image.source);
        };
      });
    });
    
    Promise.allSettled(preloadPromises).then(results => {
      const failed = results.filter(r => r.status === 'rejected').length;
      if (failed > 0) {
        toast.warning(`${failed} images failed to preload`);
      }
    });
  }, [images]);

  if (!images || images.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 w-full">
        <p className="text-gray-500 dark:text-gray-400">No images available</p>
      </div>
    );
  }

  return (
    <div className={cn(
      "grid gap-6", 
      campaignLaunched ? calculateGridColumns(images.length) : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'
    )}>
      {images.map((image) => (
        <div
          key={image.id}
          className="relative"
          onClick={() => campaignLaunched ? onAdClick(image.id) : undefined}
        >
          <ImageCard 
            image={image}
            isSelected={selectedImages.includes(image.id)}
            onSelect={() => campaignLaunched ? onAdClick(image.id) : onSelectImage(image.id)}
            selectable={!campaignLaunched}
            className={cn(
              "cursor-pointer transition-all duration-200 hover:shadow-xl dark:hover:shadow-purple-900/20 dark:border-purple-800/30",
              campaignLaunched && "hover:scale-105"
            )}
          />
          
          {campaignLaunched && image.allocatedBudget && (
            <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full shadow-lg">
              <CreditsDisplay 
                value={image.allocatedBudget} 
                variant="compact"
                className="text-white"
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default GalleryGrid;
