
import React, { useEffect } from 'react';
import { cn } from "@/lib/utils";
import ImageCard from '@/components/ImageCard';
import { ImageData } from './types';

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
    console.log(`GalleryGrid: Rendering with ${images.length} images`);
    images.forEach(img => {
      console.log(`GalleryGrid: Image ID: ${img.id}, Source: ${img.source}`);
    });
  }, [images]);

  if (!images || images.length === 0) {
    console.log("GalleryGrid: No images available to display");
    return (
      <div className="flex items-center justify-center h-64 w-full">
        <p className="text-gray-500">No images available</p>
      </div>
    );
  }

  return (
    <div className={`grid gap-6 ${campaignLaunched ? calculateGridColumns(images.length) : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'}`}>
      {images.map((image, index) => {
        console.log(`GalleryGrid: Rendering image ${image.id} at index ${index}`);
        return (
          <div
            key={image.id}
            className={cn(
              `${campaignLaunched && images.length % 3 === 1 && index === images.length - 1
                ? 'col-start-2'
                : ''}
              ${campaignLaunched && images.length % 3 === 2 && index >= images.length - 2
                ? 'col-span-1 first:col-start-1 last:col-start-3'
                : ''}
              relative`
            )}
            onClick={() => campaignLaunched ? onAdClick(image.id) : undefined}
          >
            <ImageCard 
              image={image}
              isSelected={selectedImages.includes(image.id)}
              onSelect={() => campaignLaunched ? onAdClick(image.id) : onSelectImage(image.id)}
              selectable={!campaignLaunched}
              className={cn("cursor-pointer", campaignLaunched && "hover:scale-105 transition-all duration-200")}
            />
          </div>
        );
      })}
    </div>
  );
};

export default GalleryGrid;
