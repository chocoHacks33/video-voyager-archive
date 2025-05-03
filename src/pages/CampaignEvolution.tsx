import React, { useMemo, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, PlayCircle, BarChart2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import MetricsChart from '@/components/campaign/MetricsChart';
import { generateRandomData } from '@/utils/campaignMetrics';
import AIAnalystChat from '@/components/campaign/AIAnalystChat';

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
  const [showAIChat, setShowAIChat] = useState(false);
  
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
          <div className="relative z-10 py-2">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 blur-lg rounded-xl"></div>
            <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 p-1 rounded-xl shadow-lg">
              <div className="bg-white dark:bg-gray-900 px-4 py-2 rounded-lg backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <BarChart2 className="h-5 w-5 text-purple-500" />
                  <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                    DEMO MODE
                  </h1>
                </div>
              </div>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            className={`
              relative overflow-hidden z-10 group transition-colors duration-300
              px-6 py-3 h-auto rounded-xl
              backdrop-blur-md shadow-lg
              border-none
              ${isSkipping ? 'pointer-events-none' : ''}
              after:absolute after:inset-0 after:bg-gradient-to-r after:from-purple-600 after:to-indigo-600 after:opacity-90 after:-z-10
              before:absolute before:inset-0 before:bg-gradient-to-r before:from-purple-500/40 before:to-indigo-500/40 before:-z-20 before:blur-xl
            `}
            onClick={handleSkipDays}
            disabled={daysToShow >= 28 || isSkipping}
          >
            <span className="relative z-10 flex items-center gap-2 text-white">
              <PlayCircle className="h-5 w-5 animate-pulse" />
              <span className="font-medium">
                {isSkipping ? "Skipping..." : "Skip 7 Days"}
              </span>
            </span>
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
                <TabsContent key={metric} value={metric} className="mt-4 relative">
                  <div className="absolute top-2 right-2 z-10">
                    <div 
                      onClick={() => setShowAIChat(true)}
                      className="cursor-pointer"
                      title="Ask the AI Analyst"
                    >
                      <div className="flex items-center">
                        <div className="h-8 w-8 flex-shrink-0 rounded-full bg-indigo-600 bg-opacity-80 backdrop-blur-sm flex items-center justify-center relative overflow-hidden hover:scale-110 transition-transform duration-300 shadow-lg">
                          <div className="absolute inset-0 animate-pulse bg-indigo-400/20"></div>
                          <img 
                            src="/lovable-uploads/96df1a11-6aa6-4ffe-a590-a9b52232aa2b.png" 
                            alt="AI Analyst" 
                            className="h-full w-full object-cover z-10"
                          />
                        </div>
                        <span className="ml-2 font-medium text-sm text-indigo-100 bg-indigo-600/80 backdrop-blur-md px-3 py-1 rounded-r-lg shadow-md">AI Campaign Analyst</span>
                      </div>
                    </div>
                  </div>
                  
                  {showAIChat && <AIAnalystChat onClose={() => setShowAIChat(false)} />}
                  
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
