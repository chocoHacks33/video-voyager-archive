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
    const targetData = fullDataset.map(point => {
      const actualDataPoint = data.find(d => d.name === point.name);
      return actualDataPoint || point;
    });

    let startTime: number;
    const animationDuration = 5000; // 5 seconds

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / animationDuration, 1);

      const newData = fullDataset.map((point, index) => {
        const targetPoint = targetData[index];
        if (!targetPoint?.value) return point;

        // Find the previous checkpoint
        const prevCheckpoint = Math.floor((index - 7) / 7) * 7;
        const nextCheckpoint = Math.ceil(index / 7) * 7;
        
        // If this point is from a previous checkpoint, keep its value
        if (index <= prevCheckpoint) {
          return targetPoint;
        }
        
        // If this point is between checkpoints, animate it based on progress
        const segmentProgress = progress * (nextCheckpoint - prevCheckpoint);
        if (index <= prevCheckpoint + segmentProgress) {
          return targetPoint;
        }
        
        return point;
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
