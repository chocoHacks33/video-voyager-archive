
import React, { useMemo, useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// Custom tooltip component that shows the mutation video
const VideoTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload;

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
      <h3 className="font-bold text-gray-900">Mutation {label}</h3>
      <p className="text-gray-600 mb-2">{payload[0].name}: {payload[0].value}</p>
      <div className="w-64">
        <AspectRatio ratio={16/9}>
          <video 
            src={data.videoSrc || "/stock-videos/video1.mp4"}
            className="rounded-md w-full h-full object-cover"
            autoPlay
            muted
            loop
          />
        </AspectRatio>
      </div>
    </div>
  );
};

const generateRandomData = (metric: string) => {
  return Array.from({ length: 5 }, (_, i) => ({
    name: i,
    value: Math.floor(Math.random() * 1000) + 100,
    videoSrc: `/stock-videos/video${(i % 6) + 1}.mp4`
  }));
};

// Format metric name for display (capitalize or make uppercase for acronyms)
const formatMetricName = (metric: string): string => {
  if (metric === 'ctr') return 'CTR';
  return metric.charAt(0).toUpperCase() + metric.slice(1);
};

const CampaignEvolution = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const adId = params.get('adId');
  const metrics = params.get('metrics')?.split(',').filter(Boolean) || [];
  const selectedImages = params.get('selectedImages')?.split(',').map(Number) || [];
  
  const [activeTab, setActiveTab] = useState<string>('');
  
  // Generate random data for each metric
  const metricsData = useMemo(() => {
    const data: Record<string, any[]> = {};
    metrics.forEach(metric => {
      data[metric] = generateRandomData(metric);
    });
    return data;
  }, [metrics]);

  // Set the active tab whenever metrics change
  useEffect(() => {
    // Reset the active tab
    if (metrics.length > 0) {
      setActiveTab(metrics[0]);
    } else {
      setActiveTab('');
    }
    
    // Show a toast message when metrics are loaded
    if (metrics.length > 0 && adId) {
      toast.success(`Loaded evolution data for Ad ${adId}`, {
        description: `Tracking ${metrics.length} metric${metrics.length !== 1 ? 's' : ''}`
      });
    }

    // Log the metrics for debugging
    console.log('Current metrics:', metrics);
  }, [adId, metrics]);

  const handleBack = () => {
    // Always navigate back to gallery with selected images and campaignLaunched=true
    // Also preserve the metrics parameter to maintain consistency
    const currentMetrics = params.get('metrics') || '';
    navigate(`/gallery?selectedImages=${selectedImages.join(',')}&campaignLaunched=true&metrics=${currentMetrics}`);
  };

  return (
    <AppLayout title="Ad Evolution Analysis">
      <div className="w-full space-y-6">
        <Button 
          variant="ghost" 
          onClick={handleBack}
          className="mb-6 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Gallery
        </Button>

        {metrics.length > 0 ? (
          <Tabs 
            defaultValue={metrics[0]} 
            value={activeTab} 
            onValueChange={setActiveTab} 
            className="w-full"
          >
            <TabsList className="mb-4">
              {metrics.map(metric => (
                <TabsTrigger key={metric} value={metric} className="capitalize">
                  {formatMetricName(metric)}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {metrics.map(metric => (
              <TabsContent key={metric} value={metric}>
                <Card>
                  <CardHeader>
                    <CardTitle className="capitalize">{formatMetricName(metric)} Evolution</CardTitle>
                    <CardDescription>
                      Track the {metric === 'ctr' ? 'CTR' : metric.toLowerCase()} performance over time
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={metricsData[metric]}
                          margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="name" 
                            tickFormatter={(value) => `Day ${value + 1}`}
                          />
                          <YAxis />
                          <Tooltip content={<VideoTooltip />} />
                          <Line 
                            type="monotone" 
                            dataKey="value" 
                            stroke="#8884d8" 
                            activeDot={{ r: 8 }}
                            name={metric === 'ctr' ? 'CTR' : metric}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
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
