
import React, { useMemo, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, FastForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import MetricsChart from '@/components/campaign/MetricsChart';
import { generateRandomData } from '@/utils/campaignMetrics';

const CampaignEvolution = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const adId = params.get('adId');
  const metrics = params.get('metrics')?.split(',').filter(Boolean) || [];
  const selectedImages = params.get('selectedImages')?.split(',').map(Number) || [];
  
  const [activeTab, setActiveTab] = useState<string>('');

  const [daysToShow, setDaysToShow] = useState(0);
  
  // Generate random data for each metric
  const metricsData = useMemo(() => {
    const data: Record<string, any[]> = {};
    metrics.forEach(metric => {
      data[metric] = generateRandomData(metric).filter(point => point.name <= daysToShow);
    });
    return data;
  }, [metrics, daysToShow]);

  useEffect(() => {
    if (metrics.length > 0 && !activeTab) {
      setActiveTab(metrics[0]);
    }
    
    if (metrics.length > 0 && adId) {
      toast.success(`Loaded evolution data for Ad ${adId}`, {
        description: `Tracking ${metrics.length} metric${metrics.length !== 1 ? 's' : ''}`
      });
    }
  }, [metrics, activeTab, adId]);

  const handleBack = () => {
    const currentMetrics = params.get('metrics') || '';
    navigate(`/gallery?selectedImages=${selectedImages.join(',')}&campaignLaunched=true&metrics=${currentMetrics}`);
  };

  const handleSkipDays = () => {
    setDaysToShow(prev => Math.min(prev + 7, 28));
  };

  return (
    <AppLayout title="">
      <div className="w-full space-y-6">
        <Button 
          variant="ghost" 
          onClick={handleBack}
          className="mb-6 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Gallery
        </Button>

        <div className="flex items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold text-[#ea384c]">DEMO MODE</h1>
          <Button 
            variant="outline" 
            className="gap-2 bg-[#F2FCE2] border-green-300 text-green-800 hover:bg-[#E6F9D0]"
            onClick={handleSkipDays}
            disabled={daysToShow >= 28}
          >
            ▶▶ Skip 7 Days
          </Button>
        </div>

        {metrics.length > 0 ? (
          <div className="w-full">
            <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-4 flex flex-wrap gap-1">
                {metrics.map(metric => (
                  <TabsTrigger 
                    key={metric} 
                    value={metric} 
                    className="capitalize"
                  >
                    {metric === 'ctr' ? 'CTR' : metric}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {metrics.map(metric => (
                <TabsContent key={metric} value={metric} className="mt-4">
                  <MetricsChart metric={metric} data={metricsData[metric]} />
                </TabsContent>
              ))}
            </Tabs>
          </div>
        ) : (
          <div className="text-center p-6 bg-gray-50 rounded-lg dark:bg-gray-800">
            <p className="text-lg text-gray-500 dark:text-gray-400">No metrics selected for this campaign.</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Please go back and select metrics to track.</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default CampaignEvolution;
