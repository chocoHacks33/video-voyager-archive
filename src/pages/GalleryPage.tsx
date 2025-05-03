import React, { useState, useEffect } from 'react';
import { toast } from "@/components/ui/custom-toast";
import { useCredits } from '@/contexts/CreditsContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Check } from 'lucide-react';
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
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const { spendCredits } = useCredits();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("GalleryPage: Loading initial images");
    
    const loadInitialImages = () => {
      if (initialSelectedImages.length > 0 && initialCampaignLaunched) {
        console.log("Loading selected images for campaign");
        // Only show the originally selected base images
        const selectedImagesData = baseImages.filter(img => 
          initialSelectedImages.includes(img.id)
        );
        const mockBudget = distributeBudget(1000, selectedImagesData.length);
        
        const imagesWithBudget = selectedImagesData.map((img, index) => ({
          ...img,
          allocatedBudget: mockBudget[index]
        }));
        
        console.log("Setting displayed images:", imagesWithBudget);
        setDisplayedImages(imagesWithBudget);
      } else {
        console.log("Loading base images");
        console.log("Base images:", baseImages);
        setDisplayedImages(baseImages);
      }
      setImagesLoaded(true);
    };

    loadInitialImages();
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
      toast.warning("Please select images", {
        description: "Click on one or more images to select them for your campaign"
      });
      return;
    }

    if (selectedMetrics.length === 0) {
      toast.warning("Select metrics to track", {
        description: "Choose at least one metric to track your campaign performance"
      });
      return;
    }

    if (!budget || parseFloat(budget) <= 0) {
      toast.warning("Enter a budget", {
        description: "Specify how many credits you want to spend on this campaign"
      });
      return;
    }

    setShowSuccessDialog(true);
  };

  const handleConfirmLaunch = () => {
    const budgetValue = parseFloat(budget);
    spendCredits(budgetValue);
    
    const selectedImagesData = baseImages.filter(img => selectedImages.includes(img.id));
    const budgetDistribution = distributeBudget(budgetValue, selectedImagesData.length);
    
    const imagesWithBudget = selectedImagesData.map((img, index) => ({
      ...img,
      allocatedBudget: budgetDistribution[index]
    }));
    
    setShowSuccessDialog(false);
    setCampaignLaunched(true);
    setDisplayedImages(imagesWithBudget);
    
    navigate(`/gallery?selectedImages=${selectedImages.join(',')}&campaignLaunched=true&metrics=${selectedMetrics.join(',')}`, { replace: true });
    
    toast.success("Campaign launched!", {
      description: `Started campaign with ${selectedImages.length} ad${selectedImages.length > 1 ? 's' : ''}`
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

  if (!imagesLoaded) {
    return (
      <AppLayout title="Loading Gallery...">
        <div className="w-full bg-gradient-to-br from-purple-100 via-purple-50 to-white dark:from-purple-900/30 dark:via-purple-800/20 dark:to-gray-800/30 rounded-xl p-6 flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 dark:border-purple-400"></div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title={campaignLaunched ? "Your Active Campaigns" : "Choose Your Ads"}>
      <div className="w-full bg-gradient-to-br from-purple-100 via-purple-50 to-white dark:from-purple-900/30 dark:via-purple-800/20 dark:to-gray-900/20 rounded-xl p-6 shadow-lg dark:shadow-purple-900/10">
        <div className="bg-white dark:bg-gray-800/90 dark:backdrop-blur-lg rounded-lg p-6 space-y-8 border border-gray-100 dark:border-purple-900/30 shadow-sm">
          <GalleryGrid
            images={displayedImages}
            selectedImages={selectedImages}
            onSelectImage={handleSelectImage}
            campaignLaunched={campaignLaunched}
            onAdClick={handleAdClick}
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
        <AlertDialogContent className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-900 dark:to-gray-900 border-purple-200 dark:border-purple-800/50 shadow-2xl dark:shadow-purple-900/20 max-w-md mx-auto p-0 overflow-visible">
          {/* Cosmic background for dark mode */}
          <div className="absolute inset-0 rounded-lg overflow-hidden dark:opacity-40 pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-800 via-indigo-900 to-gray-900 opacity-90 animate-cosmic-drift"></div>
            
            {/* Stars */}
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-white dark:animate-sparkle"
                style={{
                  width: `${Math.random() * 2 + 1}px`,
                  height: `${Math.random() * 2 + 1}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${Math.random() * 2 + 2}s`
                }}
              />
            ))}
          </div>
          
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg shadow-purple-300 dark:shadow-purple-900/50 animate-morph">
              <Check className="h-12 w-12 text-white" />
            </div>
          </div>
          
          <div className="relative pt-16 pb-8 px-6 mt-6 z-10">
            <AlertDialogHeader className="text-center">
              <AlertDialogTitle className="text-2xl font-bold text-gradient bg-gradient-to-r from-purple-700 to-indigo-600 dark:from-purple-400 dark:to-indigo-300 bg-clip-text text-transparent dark:animate-neon-pulse text-center">
                Ready to Launch
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-600 dark:text-gray-300 mt-4">
                <div className="space-y-4">
                  <p className="text-center">
                    You've selected {selectedImages.length} ad{selectedImages.length !== 1 ? 's' : ''} for your campaign.
                  </p>
                  
                  <div className="bg-white/70 dark:bg-gray-800/50 rounded-lg p-4 space-y-2 border border-purple-100 dark:border-purple-900/30 backdrop-blur-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Budget:</span>
                      <span className="font-medium text-purple-800 dark:text-purple-300">{budget} credits</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Metrics:</span>
                      <span className="font-medium text-purple-800 dark:text-purple-300">
                        {selectedMetrics.map(m => 
                          metricTags.find(tag => tag.id === m)?.label
                        ).join(', ')}
                      </span>
                    </div>
                  </div>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            
            <AlertDialogFooter className="mt-6 flex flex-col space-y-2">
              <AlertDialogAction 
                onClick={handleConfirmLaunch}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium px-6 py-3 rounded-lg shadow-lg hover:shadow-xl dark:shadow-purple-900/40 transform transition-all duration-300 hover:-translate-y-1 h-auto"
              >
                Launch Campaign
              </AlertDialogAction>
            </AlertDialogFooter>
            
            {/* Add floating particles for an immersive feel */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full bg-gradient-to-br from-purple-400/20 to-indigo-400/20 dark:from-purple-500/20 dark:to-indigo-500/20 animate-float"
                  style={{
                    width: `${Math.random() * 30 + 10}px`,
                    height: `${Math.random() * 30 + 10}px`,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 5}s`,
                    animationDuration: `${Math.random() * 10 + 10}s`
                  }}
                />
              ))}
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
};

export default GalleryPage;
