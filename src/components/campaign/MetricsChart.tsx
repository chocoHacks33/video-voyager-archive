
import React, { useEffect, useState, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from "@/lib/utils"; // Add this import
import VideoTooltip from './VideoTooltip';
import { formatMetricName, formatYAxisTick, getMetricUnit, getMetricMaxValue, agentExplanations } from '@/utils/campaignMetrics';
import { MessageSquare } from 'lucide-react';

interface MetricsChartProps {
  metric: string;
  data: any[];
}

const MetricsChart = ({ metric, data }: MetricsChartProps) => {
  const [animatedData, setAnimatedData] = useState<any[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const maxValue = getMetricMaxValue(metric);
  const animationRef = useRef<number>();
  const previousDataRef = useRef<any[]>([]);

  useEffect(() => {
    // Find the last day with data
    const lastDataPoint = [...data].sort((a, b) => b.name - a.name)[0];
    if (!lastDataPoint) {
      setAnimatedData(data);
      return;
    }

    const currentDay = lastDataPoint.name;
    const prevDay = currentDay - 7 >= 0 ? currentDay - 7 : 0;

    setIsAnimating(true);

    // Get current and previous checkpoint data
    const currentCheckpointData = data.find(d => d.name === currentDay);
    const prevCheckpointData = data.find(d => d.name === prevDay) || 
      { name: prevDay, value: 0, mutationNumber: Math.floor(prevDay / 7), videoSrc: `/stock-videos/video${Math.floor(prevDay / 7)}.mp4` };

    // Start with previous data state
    let startData = previousDataRef.current.length > 0 
      ? previousDataRef.current.filter(d => d.name % 7 === 0)
      : data.filter(d => d.name <= prevDay && d.name % 7 === 0);

    // Ensure we have the previous checkpoint in our start data
    if (!startData.some(d => d.name === prevDay)) {
      startData = [...startData, prevCheckpointData];
    }

    const startTime = performance.now();
    const animationDuration = 5000; // 5 seconds
    
    const easeInOutQuint = (t: number) => {
      return t < 0.5 
        ? 16 * t * t * t * t * t 
        : 1 - Math.pow(-2 * t + 2, 5) / 2;
    };
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / animationDuration, 1);
      
      // Use custom easing function for even smoother progression
      const smoothProgress = easeInOutQuint(progress);

      const newAnimatedData = [...startData];
      
      if (prevDay < currentDay) {
        // Interpolate between previous and current checkpoint with enhanced smoothing
        const interpolatedDay = prevDay + Math.floor((currentDay - prevDay) * smoothProgress);
        const interpolatedValue = prevCheckpointData.value + 
          (currentCheckpointData.value - prevCheckpointData.value) * smoothProgress;
        
        if (progress > 0) {
          const interpolatedPoint = {
            name: interpolatedDay,
            mutationNumber: Math.floor(interpolatedDay / 7),
            value: Math.round(interpolatedValue),
            videoSrc: `/stock-videos/video${Math.floor(interpolatedDay / 7)}.mp4`
          };
          
          const existingIndex = newAnimatedData.findIndex(d => d.name === currentDay);
          if (existingIndex >= 0) {
            // Replace or add interpolated point
            newAnimatedData[existingIndex] = progress < 1 ? interpolatedPoint : currentCheckpointData;
          } else {
            newAnimatedData.push(progress < 1 ? interpolatedPoint : currentCheckpointData);
          }
        }
      }
      
      // Sort by day
      newAnimatedData.sort((a, b) => a.name - b.name);
      setAnimatedData(newAnimatedData);
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        // Animation complete, save final state
        setIsAnimating(false);
        previousDataRef.current = newAnimatedData.filter(d => d.name % 7 === 0);
      }
    };
    
    // Cancel any existing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    // Start new animation
    animationRef.current = requestAnimationFrame(animate);
    
    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [data]);

  const lastDataPoint = [...(data || [])].sort((a, b) => b.name - a.name)[0];
  const currentEvolution = lastDataPoint ? Math.floor(lastDataPoint.name / 7) : 0;
  const explanation = lastDataPoint ? agentExplanations[lastDataPoint.name] : "";

  return (
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
              data={animatedData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 30,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name"
                domain={[0, 28]}
                ticks={[0, 7, 14, 21, 28]}
                tickFormatter={(value) => `Day ${value}`}
                label={{ value: 'Timeline (Days)', position: 'insideBottom', offset: -15 }}
                type="number"
                scale="linear" 
              />
              <YAxis 
                domain={[0, maxValue]}
                tickFormatter={(value) => formatYAxisTick(value, metric)}
                label={{ 
                  value: `${formatMetricName(metric)} (${getMetricUnit(metric)})`, 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { textAnchor: 'middle' }
                }}
              />
              <Tooltip content={<VideoTooltip />} />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#8884d8" 
                activeDot={{ r: 8 }}
                name={metric}
                connectNulls={true}
                isAnimationActive={false} // We're handling our own animation
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {metric === 'engagement' && (
          <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950 dark:to-indigo-950 rounded-lg shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">
                <Avatar className="h-12 w-12 ring-2 ring-purple-300 dark:ring-purple-600 animate-appear">
                  <AvatarImage src="/lovable-uploads/c25d2e17-82b8-489b-8bce-468f02b3ba12.png" />
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-indigo-600">
                    AI
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-sm text-purple-700 dark:text-purple-300 mb-2 flex items-center">
                  <MessageSquare className="h-4 w-4 mr-2 text-purple-500" />
                  AI Agent Analysis - Evolution {currentEvolution}
                </h4>
                <div className={cn(
                  "rounded-lg p-3 bg-white dark:bg-gray-800 shadow-sm relative",
                  "before:content-[''] before:absolute before:left-[-8px] before:top-4 before:w-3 before:h-3 before:rotate-45 before:bg-white dark:before:bg-gray-800"
                )}>
                  {isAnimating ? (
                    <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-300">
                      <span>Analyzing campaign data</span>
                      <span className="animate-ellipsis">...</span>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600 dark:text-gray-300 animate-slideUp">
                      {explanation}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MetricsChart;
