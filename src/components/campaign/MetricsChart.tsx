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
  const [animatedData, setAnimatedData] = useState(data);
  const maxValue = getMetricMaxValue(metric);
  const animationRef = useRef<number>();

  // Create a fixed dataset with all possible days
  const fullDataset = Array.from({ length: 29 }, (_, i) => ({
    name: i,
    value: null
  }));

  // Animation effect when data changes
  useEffect(() => {
    // Find the most recent checkpoint in the data
    const checkpoints = [0, 7, 14, 21, 28];
    const currentCheckpoint = checkpoints.filter(cp => data.some(d => d.name === cp)).pop() || 0;
    const nextCheckpoint = checkpoints.find(cp => cp > currentCheckpoint) || 28;
    
    // Get the complete dataset with actual data points
    const targetData = fullDataset.map(point => {
      const actualDataPoint = data.find(d => d.name === point.name);
      return actualDataPoint || point;
    });

    // Get the previous state of the animation as starting point
    const startData = [...animatedData];

    let startTime: number;
    const animationDuration = 5000; // 5 seconds

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / animationDuration, 1);

      const newData = fullDataset.map((point, index) => {
        const targetPoint = targetData[index];
        
        // Keep previous data points unchanged
        if (index <= currentCheckpoint) {
          return targetPoint?.value ? targetPoint : startData[index];
        }
        
        // If this is in the new range being animated
        if (index <= nextCheckpoint) {
          // Calculate how far along this point should be based on its position
          const segmentProgress = progress * (nextCheckpoint - currentCheckpoint);
          const pointPosition = index - currentCheckpoint;
          
          // Only show this point if the animation has reached it
          if (pointPosition <= segmentProgress) {
            return targetPoint;
          }
        }
        
        // For points beyond the current animation range, don't show them yet
        return { ...point, value: null };
      });

      setAnimatedData(newData);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
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
