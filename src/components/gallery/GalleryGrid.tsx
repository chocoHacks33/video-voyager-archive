
import React, { useEffect } from 'react';
import { cn } from "@/lib/utils";
import ImageCard from '@/components/ImageCard';
import { ImageData } from './types';
import CreditsDisplay from '@/components/CreditsDisplay';

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
    images.forEach(img => {
      console.log(`Image ID: ${img.id}, Source: ${img.source}`);
    });
  }, [images]);

  if (!images || images.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 w-full">
        <p className="text-gray-500">No images available</p>
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
            className={cn("cursor-pointer", campaignLaunched && "hover:scale-105 transition-all duration-200")}
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
