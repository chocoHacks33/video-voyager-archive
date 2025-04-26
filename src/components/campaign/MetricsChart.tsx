
import React, { useEffect, useState, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import VideoTooltip from './VideoTooltip';
import { formatMetricName, formatYAxisTick, getMetricUnit, getMetricMaxValue } from '@/utils/campaignMetrics';

interface MetricsChartProps {
  metric: string;
  data: any[];
}

const MetricsChart = ({ metric, data }: MetricsChartProps) => {
  const [animatedData, setAnimatedData] = useState<any[]>([]);
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

    // Get current and previous checkpoint data
    const currentCheckpointData = data.find(d => d.name === currentDay);
    const prevCheckpointData = data.find(d => d.name === prevDay) || 
      { name: prevDay, value: 0, mutationNumber: Math.floor(prevDay / 7), videoSrc: `/stock-videos/video${Math.floor(prevDay / 7)}.mp4` };

    // Create a complete dataset with all days between prev and current checkpoints
    const allDays = Array.from({ length: currentDay - prevDay + 1 }, (_, i) => prevDay + i);
    
    // Start with previous data state
    let startData = previousDataRef.current.length > 0 
      ? previousDataRef.current
      : data.filter(d => d.name <= prevDay);

    // Ensure we have the previous checkpoint in our start data
    if (!startData.some(d => d.name === prevDay)) {
      startData = [...startData, prevCheckpointData];
    }

    const startTime = performance.now();
    const animationDuration = 5000; // 5 seconds
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / animationDuration, 1);
      
      // Create animated points between previous and current checkpoint
      const newAnimatedData = [...startData];
      
      // Only animate if we're moving to a new checkpoint
      if (prevDay < currentDay) {
        for (let i = 1; i < allDays.length; i++) {
          const day = allDays[i];
          // Determine if we should show this day based on animation progress
          if (progress >= i / allDays.length) {
            // Interpolate the value between prev and current checkpoints
            const dayProgress = (day - prevDay) / (currentDay - prevDay);
            const interpolatedValue = prevCheckpointData.value + 
              (currentCheckpointData.value - prevCheckpointData.value) * dayProgress;
            
            // Add or update this day in our dataset
            const existingIndex = newAnimatedData.findIndex(d => d.name === day);
            const newPoint = {
              name: day,
              mutationNumber: Math.floor(day / 7),
              value: Math.round(interpolatedValue),
              videoSrc: `/stock-videos/video${Math.floor(day / 7)}.mp4`
            };
            
            if (existingIndex >= 0) {
              newAnimatedData[existingIndex] = newPoint;
            } else {
              newAnimatedData.push(newPoint);
            }
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
        previousDataRef.current = newAnimatedData;
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
      </CardContent>
    </Card>
  );
};

export default MetricsChart;
