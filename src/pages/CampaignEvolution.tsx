
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

  const toggleAIChat = () => {
    setShowAIChat(prev => !prev);
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
                  <button 
                    className="absolute top-2 right-2 z-10 h-12 w-12 flex items-center justify-center rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer group"
                    onClick={toggleAIChat}
                    title="Ask the AI Analyst"
                  >
                    <div className={`absolute inset-0 bg-indigo-500 rounded-full animate-pulse ${showAIChat ? 'opacity-100' : 'opacity-70'}`}></div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 z-10 group-hover:scale-110 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 001.357 2.059l.502.252a2.25 2.25 0 001.599 0l.502-.252a2.25 2.25 0 001.357-2.059V3.104m-7.5 0a23.743 23.743 0 011.722.104 23.743 23.743 0 01-1.722-.104m7.5 0a24.301 24.301 0 00-4.5 0m4.5 0a23.743 23.743 0 00-1.722.104 23.743 23.743 0 00-1.722-.104" />
                    </svg>
                  </button>
                  
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
