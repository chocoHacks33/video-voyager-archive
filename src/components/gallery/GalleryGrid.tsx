
import React, { useEffect } from 'react';
import { cn } from "@/lib/utils";
import ImageCard from '@/components/ImageCard';
import { ImageData } from './types';
import { Skeleton } from "@/components/ui/skeleton";

interface GalleryGridProps {
  images: ImageData[];
  selectedImages: number[];
  onSelectImage: (imageId: number) => void;
  campaignLaunched: boolean;
  onAdClick: (imageId: number) => void;
  isLoading?: boolean;
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
  onAdClick,
  isLoading = false
}: GalleryGridProps) => {
  
  useEffect(() => {
    console.log(`GalleryGrid rendering with ${images.length} images`);
    if (images.length > 0) {
      console.log('First image:', JSON.stringify(images[0]));
      images.forEach(img => {
        console.log(`Image ID: ${img.id}, Source: ${img.source}`);
      });
    }
  }, [images]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((_, index) => (
          <div key={index} className="rounded-lg overflow-hidden">
            <AspectRatioSkeleton />
          </div>
        ))}
      </div>
    );
  }

  if (!images || images.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 w-full">
        <p className="text-gray-500">No images available</p>
      </div>
    );
  }

  return (
    <div className={`grid gap-6 ${campaignLaunched ? calculateGridColumns(images.length) : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'}`}>
      {images.map((image, index) => (
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
      ))}
    </div>
  );
};

// Simple skeleton component for aspect ratio placeholders
const AspectRatioSkeleton = () => {
  return (
    <div className="relative w-full pt-[56.25%]"> {/* 16:9 aspect ratio */}
      <Skeleton className="absolute top-0 left-0 w-full h-full" />
    </div>
  );
};

export default GalleryGrid;
