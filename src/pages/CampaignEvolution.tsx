
import React from 'react';
import AppLayout from '@/components/AppLayout';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AspectRatio } from '@/components/ui/aspect-ratio';

// Define a type for video tooltip data
interface VideoTooltipData {
  active?: boolean;
  payload?: Array<{
    value: number;
    dataKey: string;
    name: string;
    payload: {
      name: string;
      value: number;
      videoSrc?: string;
    };
  }>;
  label?: string;
}

// Custom tooltip component that shows a video
const VideoTooltip: React.FC<TooltipProps<ValueType, NameType>> = (props) => {
  const { active, payload, label } = props as VideoTooltipData;

  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const data = payload[0].payload;
  const videoSrc = data.videoSrc || "/stock-videos/video1.mp4"; // Fallback video

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
      <h3 className="font-bold text-gray-900">{label}</h3>
      <p className="text-gray-600 mb-2">Engagement: {payload[0].value}</p>
      <div className="w-64">
        <AspectRatio ratio={16/9}>
          <video 
            src={videoSrc}
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

const CampaignEvolution = () => {
  // Data for the engagement chart - including video sources
  const engagementData = [
    { name: 'Day 1', value: 240, videoSrc: "/stock-videos/video1.mp4" },
    { name: 'Day 3', value: 390, videoSrc: "/stock-videos/video2.mp4" },
    { name: 'Day 7', value: 420, videoSrc: "/stock-videos/video3.mp4" },
    { name: 'Day 14', value: 580, videoSrc: "/stock-videos/video4.mp4" },
    { name: 'Day 21', value: 690, videoSrc: "/stock-videos/video5.mp4" },
    { name: 'Day 30', value: 790, videoSrc: "/stock-videos/video6.mp4" },
  ];

  // Data for the conversion chart
  const conversionData = [
    { name: 'Day 1', value: 10 },
    { name: 'Day 3', value: 25 },
    { name: 'Day 7', value: 40 },
    { name: 'Day 14', value: 60 },
    { name: 'Day 21', value: 85 },
    { name: 'Day 30', value: 110 },
  ];

  // Data for the spending chart
  const spendingData = [
    { name: 'Day 1', value: 50 },
    { name: 'Day 3', value: 150 },
    { name: 'Day 7', value: 300 },
    { name: 'Day 14', value: 500 },
    { name: 'Day 21', value: 700 },
    { name: 'Day 30', value: 1000 },
  ];

  return (
    <AppLayout title="Campaign Evolution">
      <div className="w-full space-y-6">
        <Tabs defaultValue="engagement" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
            <TabsTrigger value="conversion">Conversion</TabsTrigger>
            <TabsTrigger value="spending">Spending</TabsTrigger>
          </TabsList>
          
          <TabsContent value="engagement">
            <Card>
              <CardHeader>
                <CardTitle>Ad Engagement Evolution</CardTitle>
                <CardDescription>
                  Hover over the data points to see the ad version for that period
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={engagementData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip content={<VideoTooltip />} />
                      <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="conversion">
            <Card>
              <CardHeader>
                <CardTitle>Ad Conversion Evolution</CardTitle>
                <CardDescription>
                  Number of conversions over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={conversionData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="#82ca9d" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="spending">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Spending</CardTitle>
                <CardDescription>
                  Total spending over time (in USD)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={spendingData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="#ff7300" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default CampaignEvolution;
