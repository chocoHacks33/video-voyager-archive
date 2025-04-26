
import React, { useState, useEffect } from 'react';
import { Activity, TrendingUp, Zap, Eye, Tag } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import { toast } from "sonner";
import { useCredits } from '@/contexts/CreditsContext';
import { useNavigate } from 'react-router-dom';
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
  const [selectedImages, setSelectedImages] = useState<number[]>([]);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [campaignLaunched, setCampaignLaunched] = useState(false);
  const [displayedImages, setDisplayedImages] = useState<ImageData[]>([]);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [budget, setBudget] = useState<string>('');
  const { spendCredits } = useCredits();
  const navigate = useNavigate();

  useEffect(() => {
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
    
    const selectedImagesData = displayedImages
      .filter(img => selectedImages.includes(img.id));
    
    const budgetDistribution = distributeBudget(budgetValue, selectedImagesData.length);
    
    const imagesWithBudget = selectedImagesData.map((img, index) => ({
      ...img,
      allocatedBudget: budgetDistribution[index]
    }));
    
    setShowSuccessDialog(false);
    setCampaignLaunched(true);
    setDisplayedImages(imagesWithBudget);
    
    toast.success("Ad campaign launched successfully!", {
      description: `Launched ${selectedImages.length} ad${selectedImages.length > 1 ? 's' : ''}`
    });
  };

  const handleAdClick = (imageId: number) => {
    console.log('Ad clicked:', imageId);
    console.log('Campaign launched status:', campaignLaunched);
    console.log('Selected metrics:', selectedMetrics);
    
    if (campaignLaunched) {
      const clickedImage = displayedImages.find(img => img.id === imageId);
      if (clickedImage) {
        console.log('Navigating to campaign evolution for image:', clickedImage);
        navigate(`/campaign-evolution?adId=${imageId}&metrics=${selectedMetrics.join(',')}`);
      } else {
        console.error('Clicked image not found:', imageId);
      }
    } else {
      console.log('Campaign not launched yet, not navigating');
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
