
import React, { useState, useEffect } from 'react';
import { Activity, TrendingUp, Zap, Eye, Tag, Flame } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
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
import GalleryGrid from '@/components/gallery/GalleryGrid';
import CampaignSettings from '@/components/gallery/CampaignSettings';
import { ImageData, MetricTag } from '@/components/gallery/types';

const metricTags: MetricTag[] = [
  { id: 'engagement', label: 'Engagement', icon: Activity },
  { id: 'outreach', label: 'Outreach', icon: TrendingUp },
  { id: 'ctr', label: 'CTR', icon: Zap },
  { id: 'views', label: 'Views', icon: Eye },
  { id: 'convertibility', label: 'Convertibility', icon: Tag },
  { id: 'wild', label: 'Wild', icon: Flame }
];

const distributeBudget = (totalBudget: number, imageCount: number): number[] => {
  if (imageCount === 0) return [];
  if (imageCount === 1) return [totalBudget];
  
  const baseBudgetPool = totalBudget * 0.7;
  const baseBudget = Math.floor(baseBudgetPool / imageCount);
  const distribution = Array(imageCount).fill(baseBudget);
  let toDistribute = totalBudget - (baseBudget * imageCount);
  
  while (toDistribute > 0) {
    for (let i = 0; i < imageCount && toDistribute > 0; i++) {
      const maxExtra = Math.min(toDistribute, Math.floor(baseBudget * 0.3));
      const extra = Math.floor(Math.random() * maxExtra);
      distribution[i] += extra;
      toDistribute -= extra;
    }
    if (toDistribute > 0 && toDistribute < imageCount) {
      const randomIndex = Math.floor(Math.random() * imageCount);
      distribution[randomIndex] += toDistribute;
      toDistribute = 0;
    }
  }
  
  return distribution.sort(() => Math.random() - 0.5);
};

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
  const { spendCredits } = useCredits();
  const navigate = useNavigate();

  useEffect(() => {
    const loadInitialImages = () => {
      // Main images for initial selection, with corrected paths
      const baseImages: ImageData[] = [
        { id: 1, source: '/lovable-uploads/9da504bc-82c3-45aa-a0e2-37780ae1e297.png', description: 'Gaming Experience' },
        { id: 2, source: '/lovable-uploads/c4a72d70-7e42-4eef-923a-6b0ecfa9cfe9.png', description: 'Classroom Joy' },
        { id: 3, source: '/lovable-uploads/5737fa2f-eb77-4912-a895-d29211ffc78a.png', description: 'Chess Masters' },
        { id: 4, source: '/lovable-uploads/98840411-b0be-4149-8d19-6a0689ff1aac.png', description: 'Leadership' },
        { id: 5, source: '/lovable-uploads/3458d241-5855-4eae-add3-641531d930d3.png', description: 'Summer Vibes' },
        { id: 6, source: '/lovable-uploads/93554f30-535b-4830-a5d7-8bb020d6923d.png', description: 'Home Comfort' },
        { id: 7, source: '/lovable-uploads/ed20f719-1d5d-43f8-ba9a-60e65b233b5f.png', description: 'Autumn Reflection' },
        { id: 8, source: '/lovable-uploads/8472d902-e251-485c-9190-7fca155d4bb0.png', description: 'Youth Energy' },
        { id: 9, source: '/lovable-uploads/31d6fd8a-d034-4119-905b-5f196771f402.png', description: 'Anime Entertainment' }
      ];

      // Evolution images for campaign view
      const evoImages: ImageData[] = [
        { id: 10, source: '/lovable-uploads/07eddad6-7feb-4734-b135-98d5881e30a0.png', description: 'Evolution 0' },
        { id: 11, source: '/lovable-uploads/bb88b842-11ea-4909-b1d8-320ce63ee527.png', description: 'Evolution 1' },
        { id: 12, source: '/lovable-uploads/670877c1-37cc-4aad-bacd-f1bb1aa8daba.png', description: 'Evolution 2' },
        { id: 13, source: '/lovable-uploads/46aa19d0-db67-4c9f-adb5-6cd27bc10a78.png', description: 'Evolution 3' },
        { id: 14, source: '/lovable-uploads/a1ed0bfe-9482-4bbb-97b6-18537cbcfb80.png', description: 'Evolution 4' }
      ];

      if (initialSelectedImages.length > 0 && initialCampaignLaunched) {
        // If campaign is launched, show evolution images
        const selectedImagesData = evoImages;
        const mockBudget = distributeRandomBudgets(selectedImagesData.length);
        
        const imagesWithBudget = selectedImagesData.map((img, index) => ({
          ...img,
          allocatedBudget: mockBudget[index]
        }));
        
        setDisplayedImages(imagesWithBudget);
      } else {
        // If not launched, show base images
        setDisplayedImages(baseImages);
      }
    };

    loadInitialImages();
  }, [initialSelectedImages, initialCampaignLaunched]);

  // Function to generate random budget distribution for mock data
  const distributeRandomBudgets = (count: number): number[] => {
    const totalBudget = 1000; // Mock budget value
    return distributeBudget(totalBudget, count);
  };

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
    
    // Get all images first
    const allImages: ImageData[] = Array.from({ length: 9 }, (_, index) => ({
      id: index + 1,
      source: `/public/stock-videos/image${index + 1}.jpg`,
      description: `Ad Variation ${index + 1}`
    }));
    
    const selectedImagesData = allImages.filter(img => selectedImages.includes(img.id));
    const budgetDistribution = distributeBudget(budgetValue, selectedImagesData.length);
    
    const imagesWithBudget = selectedImagesData.map((img, index) => ({
      ...img,
      allocatedBudget: budgetDistribution[index]
    }));
    
    setShowSuccessDialog(false);
    setCampaignLaunched(true);
    setDisplayedImages(imagesWithBudget);
    
    // Navigate to the same page with URL parameters to show filtered view
    navigate(`/gallery?selectedImages=${selectedImages.join(',')}&campaignLaunched=true`, { replace: true });
    
    toast.success("Ad campaign launched successfully!", {
      description: `Launched ${selectedImages.length} ad${selectedImages.length > 1 ? 's' : ''}`
    });
  };

  const handleAdClick = (imageId: number) => {
    if (campaignLaunched) {
      const clickedImage = displayedImages.find(img => img.id === imageId);
      if (clickedImage) {
        console.log('Navigating to campaign evolution for image:', clickedImage);
        // Use the selectedMetrics state which will contain either the initial metrics from URL
        // or the metrics selected by the user during campaign setup
        navigate(`/campaign-evolution?adId=${imageId}&metrics=${selectedMetrics.join(',')}&selectedImages=${selectedImages.join(',')}`);
      } else {
        console.error('Clicked image not found:', imageId);
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
