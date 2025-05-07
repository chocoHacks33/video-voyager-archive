import React, { useState, useEffect } from 'react';
import { toast } from "sonner";
import { useCredits } from '@/contexts/CreditsContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Check, ImageIcon, LayoutGrid } from 'lucide-react';
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
        <div className="w-full bg-gradient-to-br from-purple-50 via-purple-50 to-white dark:from-purple-900/20 dark:via-purple-800/10 dark:to-gray-800/20 rounded-xl p-6 flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-t-purple-400 border-r-purple-300 border-b-purple-400 border-l-purple-300 dark:border-t-purple-500 dark:border-r-purple-400 dark:border-b-purple-500 dark:border-l-purple-400"></div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title={campaignLaunched ? "Your Active Campaigns" : "Choose Your Ads"}>
      {/* More subtle header section with lighter gradient */}
      <div className="relative mb-6 overflow-hidden rounded-xl bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 p-6">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-600/30 via-indigo-700/20 to-transparent pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-grid-white/5 [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-white mb-2">
              {campaignLaunched ? "Campaign Gallery" : "Select Your Creative Assets"}
            </h1>
            <p className="text-purple-100/80 max-w-lg text-sm">
              {campaignLaunched 
                ? "Track and optimize your campaign performance across different creative assets."
                : "Choose the visuals that will represent your brand and connect with your target audience."
              }
            </p>
          </div>
          
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
            <LayoutGrid className="h-4 w-4 text-white" />
            <span className="text-white text-sm">
              {displayedImages.length} {displayedImages.length === 1 ? "Image" : "Images"}
            </span>
          </div>
        </div>
      </div>
      
      {/* Main content section with softer gradients */}
      <div className="w-full bg-gradient-to-br from-purple-50/30 via-indigo-50/20 to-white dark:from-purple-900/5 dark:via-indigo-900/3 dark:to-gray-900/0 rounded-xl p-5 shadow-sm backdrop-blur-sm border border-purple-100/30 dark:border-purple-900/10">
        <div className="bg-white/90 dark:bg-gray-900/50 backdrop-blur-md rounded-lg p-5 border border-purple-100/20 dark:border-purple-800/20 shadow-sm">
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
        <AlertDialogContent className="bg-gradient-to-br from-white to-purple-50/50 dark:from-gray-900 dark:to-gray-900 border-purple-200/50 dark:border-purple-800/30 shadow-lg dark:shadow-purple-900/10 max-w-md mx-auto p-0 overflow-visible">
          {/* Subtle cosmic background for dark mode */}
          <div className="absolute inset-0 rounded-lg overflow-hidden dark:opacity-20 pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-700 via-indigo-800 to-gray-900 opacity-80 animate-cosmic-drift"></div>
            
            {/* Stars */}
            {[...Array(20)].map((_, i) => (
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
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center shadow-md shadow-purple-200 dark:shadow-purple-900/30">
              <Check className="h-10 w-10 text-white" />
            </div>
          </div>
          
          <div className="relative pt-12 pb-6 px-5 mt-6 z-10">
            <AlertDialogHeader className="text-center">
              <AlertDialogTitle className="text-xl font-semibold text-gradient bg-gradient-to-r from-purple-600 to-indigo-500 dark:from-purple-400 dark:to-indigo-300 bg-clip-text text-transparent">
                Ready to Launch
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-600 dark:text-gray-300 mt-3">
                <div className="space-y-3">
                  <p className="text-center">
                    You've selected {selectedImages.length} ad{selectedImages.length !== 1 ? 's' : ''} for your campaign.
                  </p>
                  
                  <div className="bg-white/60 dark:bg-gray-800/40 rounded-lg p-3 space-y-2 border border-purple-100/50 dark:border-purple-900/20 backdrop-blur-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400 text-sm">Budget:</span>
                      <span className="font-medium text-purple-700 dark:text-purple-300 text-sm">{budget} credits</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400 text-sm">Metrics:</span>
                      <span className="font-medium text-purple-700 dark:text-purple-300 text-sm">
                        {selectedMetrics.map(m => 
                          metricTags.find(tag => tag.id === m)?.label
                        ).join(', ')}
                      </span>
                    </div>
                  </div>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            
            <AlertDialogFooter className="mt-4 flex flex-col space-y-2">
              <AlertDialogAction 
                onClick={handleConfirmLaunch}
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-medium px-5 py-2 rounded-lg shadow-md hover:shadow-lg dark:shadow-purple-900/20 transform transition-all duration-300 hover:-translate-y-0.5 h-auto"
              >
                Launch Campaign
              </AlertDialogAction>
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
};

export default GalleryPage;
