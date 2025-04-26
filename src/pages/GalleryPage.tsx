import React, { useState, useEffect } from 'react';
import { toast } from "sonner";
import { useCredits } from '@/contexts/CreditsContext';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import AppLayout from '@/components/AppLayout';
import GalleryGrid from '@/components/gallery/GalleryGrid';
import CampaignSettings from '@/components/gallery/CampaignSettings';
import { ImageData } from '@/components/gallery/types';
import { baseImages, evoImages } from '@/data/galleryImages';
import { metricTags } from '@/data/campaignMetrics';
import { distributeBudget } from '@/utils/campaignUtils';

const GalleryPage = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialSelectedImages = params.get('selectedImages')?.split(',').map(Number) || [];
  const initialCampaignLaunched = params.get('campaignLaunched') === 'true';
  const initialMetrics = params.get('metrics')?.split(',').filter(Boolean) || [];
  
  const [selectedImages, setSelectedImages] = useState<number[]>(initialSelectedImages);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [campaignLaunched, setCampaignLaunched] = useState(initialCampaignLaunched);
  const [displayedImages, setDisplayedImages] = useState<ImageData[]>([]);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(initialMetrics);
  const [budget, setBudget] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const { spendCredits } = useCredits();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("GalleryPage: Loading initial images");
    setIsLoading(true);
    
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      try {
        if (initialSelectedImages.length > 0 && initialCampaignLaunched) {
          console.log("Loading evolution images for campaign");
          const selectedImagesData = evoImages;
          const mockBudget = distributeBudget(1000, selectedImagesData.length);
          
          const imagesWithBudget = selectedImagesData.map((img, index) => ({
            ...img,
            allocatedBudget: mockBudget[index]
          }));
          
          console.log("Setting displayed images:", imagesWithBudget);
          setDisplayedImages(imagesWithBudget);
        } else {
          console.log("Loading base images");
          console.log("Base images count:", baseImages.length);
          baseImages.forEach(img => console.log(`Base image: ${img.id} - ${img.source}`));
          setDisplayedImages([...baseImages]);
        }
      } catch (error) {
        console.error("Error loading images:", error);
        toast.error("Failed to load images. Please try refreshing the page.");
      } finally {
        setIsLoading(false);
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [initialSelectedImages, initialCampaignLaunched]);

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

  const handleToggleMetric = (metricId: string) => {
    setSelectedMetrics(prev => 
      prev.includes(metricId) 
        ? prev.filter(id => id !== metricId)
        : [...prev, metricId]
    );
  };

  const handleLaunchCampaign = () => {
    if (selectedImages.length === 0) {
      toast.warning("Please select at least one image before launching", {
        description: "Click on one or more images to select them"
      });
      return;
    }

    if (selectedMetrics.length === 0) {
      toast.warning("Please select at least one metric", {
        description: "Choose metrics to track for your campaign"
      });
      return;
    }

    if (!budget || parseFloat(budget) <= 0) {
      toast.warning("Please enter a valid budget", {
        description: "Enter the amount of credits you want to spend"
      });
      return;
    }

    setShowSuccessDialog(true);
  };

  const handleConfirmLaunch = () => {
    const budgetValue = parseFloat(budget);
    spendCredits(budgetValue);
    
    const selectedImagesData = evoImages;
    const budgetDistribution = distributeBudget(budgetValue, selectedImagesData.length);
    
    const imagesWithBudget = selectedImagesData.map((img, index) => ({
      ...img,
      allocatedBudget: budgetDistribution[index]
    }));
    
    setShowSuccessDialog(false);
    setCampaignLaunched(true);
    setDisplayedImages(imagesWithBudget);
    
    navigate(`/gallery?selectedImages=${selectedImages.join(',')}&campaignLaunched=true`, { replace: true });
    
    toast.success("Ad campaign launched successfully!", {
      description: `Launched ${selectedImages.length} ad${selectedImages.length > 1 ? 's' : ''}`
    });
  };

  const handleAdClick = (imageId: number) => {
    if (campaignLaunched) {
      const clickedImage = displayedImages.find(img => img.id === imageId);
      if (clickedImage) {
        navigate(`/campaign-evolution?adId=${imageId}&metrics=${selectedMetrics.join(',')}&selectedImages=${selectedImages.join(',')}`);
      }
    } else {
      handleSelectImage(imageId);
    }
  };

  return (
    <AppLayout title={campaignLaunched ? "Your Active Campaigns" : "Choose Your Ads"}>
      <div className="w-full bg-gradient-to-br from-purple-100 via-purple-50 to-white dark:from-purple-900 dark:via-purple-800 dark:to-gray-800 rounded-xl p-6 shadow-lg">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 space-y-8">
          <GalleryGrid
            images={displayedImages}
            selectedImages={selectedImages}
            onSelectImage={handleSelectImage}
            campaignLaunched={campaignLaunched}
            onAdClick={handleAdClick}
            isLoading={isLoading}
          />

          {!campaignLaunched && (
            <CampaignSettings
              metricTags={metricTags}
              selectedMetrics={selectedMetrics}
              onMetricToggle={handleToggleMetric}
              budget={budget}
              onBudgetChange={setBudget}
              onLaunch={handleLaunchCampaign}
              selectedImagesCount={selectedImages.length}
            />
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
              <div className="mt-4 space-y-2">
                <p><span className="font-medium">Budget:</span> {budget} credits</p>
                <p><span className="font-medium">Tracking metrics:</span> {selectedMetrics.map(m => 
                  metricTags.find(tag => tag.id === m)?.label
                ).join(', ')}</p>
              </div>
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
