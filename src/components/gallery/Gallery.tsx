
import React, { useState } from 'react';
import { ImageData } from './types';
import GalleryGrid from './GalleryGrid';

interface GalleryProps {
  images: ImageData[];
}

const Gallery: React.FC<GalleryProps> = ({ images }) => {
  const [selectedImages, setSelectedImages] = useState<number[]>([]);
  const [campaignLaunched, setCampaignLaunched] = useState(false);

  const handleSelectImage = (imageId: number) => {
    setSelectedImages(prev => {
      if (prev.includes(imageId)) {
        return prev.filter(id => id !== imageId);
      } else {
        return [...prev, imageId];
      }
    });
  };

  const handleAdClick = (imageId: number) => {
    console.log(`Ad ${imageId} clicked`);
    // This would handle metrics tracking in a real app
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        <GalleryGrid 
          images={images}
          selectedImages={selectedImages}
          onSelectImage={handleSelectImage}
          campaignLaunched={campaignLaunched}
          onAdClick={handleAdClick}
        />
      </div>
    </div>
  );
};

export default Gallery;
