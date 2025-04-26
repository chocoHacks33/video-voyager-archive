import React, { useState, useEffect } from 'react';
import { Rocket, Activity, TrendingUp, Zap, Eye, Coins, Tag } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import ImageCard from '@/components/ImageCard';
import { useCredits } from '@/contexts/CreditsContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useNavigate } from 'react-router-dom';

interface ImageData {
  id: number;
  source: string;
  description: string;
  allocatedBudget?: number;
}

interface AdMutation {
  id: number;
  source: string;
  metrics: {
    engagement: number;
    outreach: number;
    ctr: number;
    views: number;
    convertibility: number;
  };
}

interface MetricTag {
  id: string;
  label: string;
  icon: React.ComponentType;
}

const metricTags: MetricTag[] = [
  { id: 'engagement', label: 'Engagement', icon: Activity },
  { id: 'outreach', label: 'Outreach', icon: TrendingUp },
  { id: 'ctr', label: 'CTR', icon: Zap },
  { id: 'views', label: 'Views', icon: Eye },
  { id: 'convertibility', label: 'Convertibility', icon: Tag },
];

const calculateGridColumns = (imageCount: number): string => {
  // For 1-2 images, use specific layouts
  if (imageCount <= 2) {
    return imageCount === 1 ? 'grid-cols-1' : 'grid-cols-2';
  }
  
  // For 3-4 images, use 2 columns
  if (imageCount <= 4) {
    return 'grid-cols-2';
  }
  
  // For 5+ images, use 3 columns with centering for last row
  return 'grid-cols-3';
};

const distributeBudget = (totalBudget: number, imageCount: number): number[] => {
  if (imageCount === 0) return [];
  if (imageCount === 1) return [totalBudget];
  
  // Calculate base budget (70% of total divided evenly)
  const baseBudgetPool = totalBudget * 0.7;
  const baseBudget = Math.floor(baseBudgetPool / imageCount);
  
  // Initialize array with base budgets
  const distribution = Array(imageCount).fill(baseBudget);
  
  // Distribute remaining 30% randomly with larger variations
  const remainingBudget = totalBudget - (baseBudget * imageCount);
  let toDistribute = remainingBudget;
  
  while (toDistribute > 0) {
    for (let i = 0; i < imageCount && toDistribute > 0; i++) {
      // Random variation between 0% and 30% of base budget
      const maxExtra = Math.min(toDistribute, Math.floor(baseBudget * 0.3));
      const extra = Math.floor(Math.random() * maxExtra);
      distribution[i] += extra;
      toDistribute -= extra;
    }
    
    // If we have a small amount left, just add it to a random image
    if (toDistribute > 0 && toDistribute < imageCount) {
      const randomIndex = Math.floor(Math.random() * imageCount);
      distribution[randomIndex] += toDistribute;
      toDistribute = 0;
    }
  }
  
  // Shuffle the distribution
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

    const budgetValue = parseFloat(budget);
    
    setShowSuccessDialog(true);
  };

  const handleConfirmLaunch = () => {
    const budgetValue = parseFloat(budget);
    
    // Still call spendCredits to update the UI, but ignore the result
    spendCredits(budgetValue);
    
    // Get selected images
    const selectedImagesData = displayedImages
      .filter(img => selectedImages.includes(img.id));
    
    // Distribute the budget among selected images
    const budgetDistribution = distributeBudget(budgetValue, selectedImagesData.length);
    
    // Apply allocated budgets to images
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
    if (campaignLaunched && displayedImages.find(img => img.id === imageId)) {
      // Navigate to evolution page with the ad ID and selected metrics
      navigate(`/campaign-evolution?adId=${imageId}&metrics=${selectedMetrics.join(',')}`);
    }
  };

  return (
    <AppLayout title={campaignLaunched ? "Your Active Campaigns" : "Choose Your Ads"}>
      <div className="w-full bg-gradient-to-br from-purple-100 via-purple-50 to-white dark:from-purple-900 dark:via-purple-800 dark:to-gray-800 rounded-xl p-6 shadow-lg">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 space-y-8">
          {/* Gallery Grid with dynamic columns and last row centering */}
          <div className={`grid gap-6 ${campaignLaunched ? calculateGridColumns(displayedImages.length) : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'}`}>
            {displayedImages.map((image, index) => (
              <div
                key={image.id}
                className={`
                  ${campaignLaunched && displayedImages.length % 3 === 1 && index === displayedImages.length - 1
                    ? 'col-start-2'  // Center the last image if it's alone in the last row
                    : ''}
                  ${campaignLaunched && displayedImages.length % 3 === 2 && index >= displayedImages.length - 2
                    ? 'col-span-1 first:col-start-1 last:col-start-3'  // Space out last two images
                    : ''}
                  relative
                `}
              >
                {campaignLaunched && image.allocatedBudget && (
                  <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1 z-10 flex items-center gap-1.5">
                    <Coins className="h-4 w-4 text-yellow-400" />
                    <span className="text-white font-medium text-sm">{image.allocatedBudget}</span>
                  </div>
                )}
                <ImageCard 
                  image={image}
                  isSelected={selectedImages.includes(image.id)}
                  onSelect={() => campaignLaunched ? handleAdClick(image.id) : handleSelectImage(image.id)}
                  selectable={!campaignLaunched}
                  className="cursor-pointer"
                />
              </div>
            ))}
          </div>

          {/* Campaign Settings Section */}
          {!campaignLaunched && (
            <div className="mt-10 space-y-8">
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Metrics Selection */}
                  <div className="space-y-4">
                    <Label className="text-lg font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <Activity className="w-5 h-5 text-purple-500" />
                      Campaign Metrics
                    </Label>
                    <div className="flex flex-wrap gap-2.5">
                      {metricTags.map(metric => {
                        const Icon = metric.icon;
                        return (
                          <Badge
                            key={metric.id}
                            variant={selectedMetrics.includes(metric.id) ? "default" : "outline"}
                            className={`
                              px-3 py-1.5 text-sm cursor-pointer transition-all duration-200
                              hover:scale-105 active:scale-95
                              ${selectedMetrics.includes(metric.id) 
                                ? 'bg-purple-600 hover:bg-purple-700' 
                                : 'hover:border-purple-400'}
                            `}
                            onClick={() => handleToggleMetric(metric.id)}
                          >
                            <Icon className="h-3.5 w-3.5" />
                            <span className="ml-1.5">{metric.label}</span>
                          </Badge>
                        );
                      })}
                    </div>
                  </div>

                  {/* Budget Input */}
                  <div className="space-y-4">
                    <Label className="text-lg font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2" htmlFor="budget">
                      <Coins className="w-5 h-5 text-purple-500" />
                      Campaign Budget
                    </Label>
                    <div className="flex items-center gap-3 max-w-xs">
                      <div className="relative flex-1">
                        <Input
                          id="budget"
                          type="number"
                          placeholder="Enter budget amount"
                          value={budget}
                          onChange={(e) => setBudget(e.target.value)}
                          className="pl-9"
                        />
                        <Coins className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      </div>
                      <span className="text-sm font-medium text-gray-500">credits</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Launch Button */}
              <div className="flex justify-center">
                <Button 
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 
                           text-white font-medium px-10 py-6 rounded-lg shadow-xl hover:shadow-2xl 
                           transform hover:scale-105 transition-all duration-300 flex items-center gap-3"
                  onClick={handleLaunchCampaign}
                >
                  <Rocket className="w-6 h-6" />
                  <span className="text-lg">
                    Launch Campaign {selectedImages.length > 0 && `(${selectedImages.length})`}
                  </span>
                </Button>
              </div>
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
