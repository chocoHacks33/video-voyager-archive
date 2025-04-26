
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Rocket } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import ImageCard from '@/components/ImageCard';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ImageData {
  id: number;
  source: string;
  description: string;
}

const GalleryPage = () => {
  const [selectedImages, setSelectedImages] = useState<number[]>([]);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [campaignLaunched, setCampaignLaunched] = useState(false);
  const [displayedImages, setDisplayedImages] = useState<ImageData[]>([]);

  useEffect(() => {
    // Prepare 9 empty image slots
    const emptyImages: ImageData[] = Array.from({ length: 9 }, (_, index) => ({
      id: index + 1,
      source: `/public/stock-videos/image${index + 1}.jpg`,
      description: `Ad Variation ${index + 1}`
    }));
    setDisplayedImages(emptyImages);
  }, []);

  const handleSelectImage = (imageId: number) => {
    if (campaignLaunched) return;
    
    setSelectedImages(prev => {
      if (prev.includes(imageId)) {
        return prev.filter(id => id !== imageId);
      } else {
        return [...prev, imageId];
      }
    });
  };

  const handleLaunchCampaign = () => {
    if (selectedImages.length > 0) {
      setShowSuccessDialog(true);
    } else {
      toast.warning("Please select at least one image before launching", {
        description: "Click on one or more images to select them"
      });
    }
  };

  const handleConfirmLaunch = () => {
    setShowSuccessDialog(false);
    setCampaignLaunched(true);
    
    const selectedImagesData = displayedImages.filter(img => selectedImages.includes(img.id));
    setDisplayedImages(selectedImagesData);
    
    toast.success("Ad campaign launched successfully!", {
      description: `Launched ${selectedImages.length} ad${selectedImages.length > 1 ? 's' : ''}`
    });
  };

  return (
    <AppLayout title={campaignLaunched ? "Your Active Campaigns" : "Choose Your Ads"}>
      <div className="w-full bg-gradient-to-br from-purple-100 via-purple-50 to-white dark:from-purple-900 dark:via-purple-800 dark:to-gray-800 rounded-xl p-1 shadow-lg">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {displayedImages.map(image => (
              <ImageCard 
                key={image.id} 
                image={image} 
                isSelected={selectedImages.includes(image.id)}
                onSelect={() => handleSelectImage(image.id)}
                selectable={!campaignLaunched}
              />
            ))}
          </div>
          
          {!campaignLaunched && (
            <div className="flex justify-center">
              <Button 
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium px-10 py-3 rounded-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3"
                onClick={handleLaunchCampaign}
              >
                <Rocket className="w-5 h-5 transition-transform group-hover:rotate-12" />
                Launch Campaign {selectedImages.length > 0 && `(${selectedImages.length})`}
              </Button>
            </div>
          )}
        </div>
      </div>

      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent className="bg-white dark:bg-gray-800 border-0 shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              Launch Ad Campaign
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 dark:text-gray-300">
              You've selected {selectedImages.length} ad{selectedImages.length !== 1 ? 's' : ''} for your campaign. 
              Launch now to start showing these ads to your audience and begin evolution cycle!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction 
              onClick={handleConfirmLaunch} 
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Confirm Launch
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
};

export default GalleryPage;
