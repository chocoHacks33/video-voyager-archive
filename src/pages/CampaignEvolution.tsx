
import React, { useMemo, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, PlayCircle, BarChart2 } from 'lucide-react';
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
  const [isSkipping, setIsSkipping] = useState(false);
  
  // Generate random data for each metric - restricted to only checkpoint days
  const metricsData = useMemo(() => {
    const data: Record<string, any[]> = {};
    metrics.forEach(metric => {
      // Only include the checkpoint days (0, 7, 14, 21, 28) up to the current daysToShow
      data[metric] = generateRandomData(metric).filter(point => point.name <= daysToShow);
    });
    return data;
  }, [metrics, daysToShow]);

  useEffect(() => {
    if (metrics.length > 0 && !activeTab) {
      setActiveTab(metrics[0]);
    }
    
    // First load toast - only show once
    if (metrics.length > 0 && adId && daysToShow === 0) {
      toast.success(`Loaded evolution data for Ad ${adId}`, {
        description: `Tracking ${metrics.length} metric${metrics.length !== 1 ? 's' : ''}`
      });
    }
  }, [metrics, activeTab, adId, daysToShow]);

  const handleBack = () => {
    const currentMetrics = params.get('metrics') || '';
    navigate(`/gallery?selectedImages=${selectedImages.join(',')}&campaignLaunched=true&metrics=${currentMetrics}`);
  };

  const handleSkipDays = () => {
    setIsSkipping(true);
    
    // Simulate a loading effect for the button
    setTimeout(() => {
      setDaysToShow(prev => Math.min(prev + 7, 28));
      setIsSkipping(false);
    }, 600);
  };

  return (
    <AppLayout title="">
      <div className="w-full space-y-6">
        <Button 
          variant="ghost" 
          onClick={handleBack}
          className="mb-6 hover:bg-gray-100 dark:hover:bg-gray-800 group transition-all duration-300"
        >
          <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform duration-300" />
          Back to Gallery
        </Button>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-red-500 to-pink-600 p-1 rounded-lg shadow-lg">
              <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950/50 dark:to-pink-950/50 px-3 py-1.5 rounded-md backdrop-blur-sm">
                <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-pink-600 dark:from-red-400 dark:to-pink-400">
                  DEMO MODE
                </h1>
              </div>
            </div>
            <BarChart2 className="h-6 w-6 text-indigo-500 animate-pulse-slow" />
          </div>
          
          <Button 
            variant="outline" 
            className={`
              relative overflow-hidden group transition-all duration-300
              border-2 border-indigo-500 dark:border-indigo-400 hover:border-indigo-600 dark:hover:border-indigo-300  
              text-indigo-700 dark:text-indigo-300 hover:text-indigo-800 dark:hover:text-indigo-200
              bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30
              hover:from-indigo-100 hover:to-purple-100 dark:hover:from-indigo-900/30 dark:hover:to-purple-900/30
              shadow-md hover:shadow-lg hover:shadow-indigo-200 dark:hover:shadow-indigo-900
              animate-button-pulse
              ${isSkipping ? 'animate-glow pointer-events-none' : ''}
            `}
            onClick={handleSkipDays}
            disabled={daysToShow >= 28 || isSkipping}
          >
            <PlayCircle className="h-4 w-4 mr-2 group-hover:scale-125 transition-transform duration-300" />
            <PlayCircle className="h-4 w-4 mr-2 opacity-70 group-hover:scale-110 transition-transform duration-300" />
            {isSkipping ? "Skipping..." : "Skip 7 Days"}
            
            {/* Background pulsing effect */}
            <span className="absolute inset-0 bg-gradient-to-r from-indigo-200/20 to-purple-200/20 dark:from-indigo-400/10 dark:to-purple-400/10 transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500"></span>
          </Button>
        </div>

        {metrics.length > 0 ? (
          <div className="w-full bg-white/50 dark:bg-gray-900/50 rounded-2xl p-6 shadow-xl backdrop-blur-sm border border-indigo-50 dark:border-indigo-900/50">
            <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-6 flex flex-wrap gap-2 bg-indigo-50/80 dark:bg-indigo-950/30 p-1.5 backdrop-blur-sm">
                {metrics.map(metric => (
                  <TabsTrigger 
                    key={metric} 
                    value={metric} 
                    className="capitalize data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-md data-[state=active]:text-indigo-700 dark:data-[state=active]:text-indigo-300 transition-all duration-300"
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
          <div className="text-center p-8 bg-gray-50/50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700 shadow-md backdrop-blur-sm">
            <p className="text-lg text-gray-500 dark:text-gray-400">No metrics selected for this campaign.</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Please go back and select metrics to track.</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default CampaignEvolution;
