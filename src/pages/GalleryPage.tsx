import React from 'react';
import AppLayout from '@/components/AppLayout';
import Gallery from '@/components/gallery/Gallery';
import { baseImages, evoImages } from '@/data/galleryImages';
import AIAnalyst from '@/components/campaign/AIAnalyst';

const GalleryPage = () => {
  const allImages = [...baseImages, ...evoImages];

  return (
    <AppLayout title="Image Gallery">
      <Gallery images={allImages} />
      <AIAnalyst />
    </AppLayout>
  );
};

export default GalleryPage;
