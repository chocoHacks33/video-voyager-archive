
import React from 'react';
import { cn } from "@/lib/utils";
import ImageCard from '@/components/ImageCard';

interface ImageData {
  id: number;
  source: string;
  description: string;
  allocatedBudget?: number;
}

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
        >
          <ImageCard 
            image={image}
            isSelected={selectedImages.includes(image.id)}
            onSelect={() => campaignLaunched ? onAdClick(image.id) : onSelectImage(image.id)}
            selectable={!campaignLaunched}
            className="cursor-pointer"
          />
        </div>
      ))}
    </div>
  );
};

export default GalleryGrid;
