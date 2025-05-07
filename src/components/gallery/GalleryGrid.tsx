
import React, { useEffect } from 'react';
import { cn } from "@/lib/utils";
import ImageCard from '@/components/ImageCard';
import { ImageData } from './types';
import CreditsDisplay from '@/components/CreditsDisplay';
import { toast } from '@/components/ui/custom-toast';
import { ImageIcon, LayoutGrid } from 'lucide-react';

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
        // Remove the parameter from toast.warning as it expects no arguments
        console.log(`${failed} images failed to preload`);
      }
    });
  }, [images]);

  if (!images || images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 w-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/20 dark:to-gray-900/20 rounded-xl p-8 border border-dashed border-gray-300 dark:border-gray-700">
        <ImageIcon className="h-16 w-16 text-gray-400 dark:text-gray-600 mb-4" />
        <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">No images available</p>
        <p className="text-gray-400 dark:text-gray-500 text-sm max-w-md text-center">Upload images or check your connection to see your gallery content</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
          <LayoutGrid className="h-5 w-5 text-purple-400" />
          <span>Gallery</span>
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">
            ({images.length} {images.length === 1 ? 'image' : 'images'})
          </span>
        </h2>
      </div>
      
      <div className={cn(
        "grid gap-5", 
        campaignLaunched ? calculateGridColumns(images.length) : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
      )}>
        {images.map((image) => (
          <div
            key={image.id}
            className="relative group"
            onClick={() => campaignLaunched ? onAdClick(image.id) : undefined}
          >
            <div className={cn(
              "absolute inset-0 bg-gradient-to-br from-purple-400/10 via-indigo-400/5 to-blue-400/5 opacity-0 group-hover:opacity-100 rounded-lg transition-all duration-300 -m-0.5 p-0.5",
              campaignLaunched && "group-hover:scale-[1.01]"
            )} />
            
            <ImageCard 
              image={image}
              isSelected={selectedImages.includes(image.id)}
              onSelect={() => campaignLaunched ? onAdClick(image.id) : onSelectImage(image.id)}
              selectable={!campaignLaunched}
              className={cn(
                "transition-all duration-300 z-10 relative",
                "bg-white dark:bg-gray-850 rounded-lg overflow-hidden shadow-sm dark:shadow-none",
                "hover:shadow-md dark:hover:shadow-purple-700/10",
                campaignLaunched ? "group-hover:scale-[1.01] cursor-pointer" : "cursor-default"
              )}
            />
            
            {campaignLaunched && image.allocatedBudget && (
              <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm z-20 transition-all duration-300 group-hover:bg-indigo-500/70">
                <CreditsDisplay 
                  value={image.allocatedBudget} 
                  variant="compact"
                  className="text-white text-sm"
                />
              </div>
            )}
            
            {!campaignLaunched && selectedImages.includes(image.id) && (
              <div className="absolute -top-2 -right-2 bg-purple-500 rounded-full w-6 h-6 flex items-center justify-center z-20 shadow-md shadow-purple-500/20 animate-appear">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GalleryGrid;
