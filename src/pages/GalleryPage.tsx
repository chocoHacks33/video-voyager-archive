
import React, { useState, useEffect } from 'react';
import { toast } from "sonner";
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
  const [pageLoaded, setPageLoaded] = useState(false);
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
    
    // Simulate page transition for smoother loading
    setTimeout(() => {
      setPageLoaded(true);
    }, 300);
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
      // Don't show warning toast
      return;
    }

    if (selectedMetrics.length === 0) {
      // Don't show warning toast
      return;
    }

    if (!budget || parseFloat(budget) <= 0) {
      // Don't show warning toast
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
        <div className="w-full bg-gradient-to-br from-purple-50/80 via-purple-100/30 to-white dark:from-purple-900/10 dark:via-purple-800/5 dark:to-gray-900/10 rounded-xl p-6 flex justify-center items-center h-64 transition-all duration-500">
          <div className="h-16 w-16 rounded-full border-3 border-t-transparent border-purple-400/60 animate-spin"></div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title={campaignLaunched ? "Your Active Campaigns" : "Choose Your Ads"}>
      <div 
        className={cn(
          "w-full bg-gradient-to-br from-purple-50/70 via-purple-50/30 to-white dark:from-purple-900/10 dark:via-purple-800/5 dark:to-gray-900/5 rounded-xl p-6 shadow-sm transition-all duration-500 opacity-0 transform translate-y-4",
          pageLoaded ? "opacity-100 translate-y-0" : ""
        )}
        style={{
          animation: pageLoaded ? "fade-in 0.5s ease-out forwards" : "none"
        }}
      >
        <div className="bg-white dark:bg-gray-800/80 dark:backdrop-blur-sm rounded-lg p-6 space-y-8 border border-gray-100 dark:border-purple-900/20 shadow-sm transition-all">
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
        <AlertDialogContent className="bg-gradient-to-br from-white to-purple-50/50 dark:from-gray-900 dark:to-gray-900 border-purple-200/50 dark:border-purple-800/30 shadow-xl dark:shadow-purple-900/10 max-w-md mx-auto p-0 overflow-visible transform transition-all duration-500">
          {/* Subtle cosmic background for dark mode */}
          <div className="absolute inset-0 rounded-lg overflow-hidden dark:opacity-30 pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-600 via-indigo-900 to-gray-900 opacity-80 animate-cosmic-drift"></div>
            
            {/* Subtle stars */}
            {[...Array(15)].map((_, i) => (
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
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center shadow-md shadow-purple-300/50 dark:shadow-purple-900/30 animate-morph">
              <Check className="h-10 w-10 text-white" />
            </div>
          </div>
          
          <div className="relative pt-14 pb-8 px-6 mt-6 z-10">
            <AlertDialogHeader className="text-center">
              <AlertDialogTitle className="text-2xl font-bold text-gradient bg-gradient-to-r from-purple-600 to-indigo-500 dark:from-purple-400 dark:to-indigo-300 bg-clip-text text-transparent dark:animate-neon-pulse text-center">
                Ready to Launch
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-600 dark:text-gray-300 mt-4">
                <div className="space-y-4">
                  <p className="text-center">
                    You've selected {selectedImages.length} ad{selectedImages.length !== 1 ? 's' : ''} for your campaign.
                  </p>
                  
                  <div className="bg-white/70 dark:bg-gray-800/40 rounded-lg p-4 space-y-2 border border-purple-100/50 dark:border-purple-900/20 backdrop-blur-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Budget:</span>
                      <span className="font-medium text-purple-700 dark:text-purple-300">{budget} credits</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Metrics:</span>
                      <span className="font-medium text-purple-700 dark:text-purple-300">
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
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-medium px-6 py-3 rounded-lg shadow-md hover:shadow-lg dark:shadow-purple-900/20 transform transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] h-auto"
              >
                Launch Campaign
              </AlertDialogAction>
            </AlertDialogFooter>
            
            {/* Add subtle floating particles */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full bg-gradient-to-br from-purple-400/10 to-indigo-400/10 dark:from-purple-500/10 dark:to-indigo-500/10 animate-float"
                  style={{
                    width: `${Math.random() * 20 + 10}px`,
                    height: `${Math.random() * 20 + 10}px`,
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
