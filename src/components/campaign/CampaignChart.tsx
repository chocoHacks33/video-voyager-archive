
import React, { ReactElement } from 'react';
import { Line, LineChart, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { Card } from '@/components/ui/card';

interface CampaignChartProps {
  data: any[];
  metric: string;
  onDotClick?: (day: number) => void;
  formatYAxisTick: (value: any, metric: string) => string;
  getMetricMaxValue: (metric: string) => number;
  TooltipContent: ReactElement;
}

const CampaignChart = ({
  data,
  metric,
  onDotClick,
  formatYAxisTick,
  getMetricMaxValue,
  TooltipContent
}: CampaignChartProps) => {
  const metricColor = {
    ctr: "#8b5cf6",
    engagement: "#06b6d4",
    views: "#10b981",
    outreach: "#f59e0b",
    convertibility: "#ef4444"
  };

  const handleDotClick = (data: any) => {
    if (onDotClick) {
      onDotClick(data.name);
    }
  };

  const formatTick = (value: any) => {
    return formatYAxisTick(value, metric);
  };

  return (
    <Card className="p-4 h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis 
            dataKey="name" 
            label={{ 
              value: 'Days', 
              position: 'insideBottom', 
              offset: -5 
            }} 
          />
          <YAxis 
            tickFormatter={formatTick}
            domain={[0, getMetricMaxValue(metric)]}
          />
          <Tooltip content={TooltipContent} />
          <Line
            type="monotone"
            dataKey="value"
            name={metric}
            stroke={metricColor[metric as keyof typeof metricColor] || "#8b5cf6"}
            strokeWidth={2}
            activeDot={{ 
              r: 8, 
              onClick: handleDotClick,
              className: "cursor-pointer" 
            }}
            dot={{ 
              r: 4, 
              onClick: handleDotClick,
              className: "cursor-pointer" 
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default CampaignChart;
