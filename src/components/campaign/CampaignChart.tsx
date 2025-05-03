
import React from 'react';
import { 
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

interface CampaignChartProps {
  data: any[];
  metric: string;
  onDotClick: (day: number) => void;
  formatYAxisTick: (value: any) => string;
  getMetricMaxValue: (metric: string) => number;
  TooltipContent: React.ReactNode;
}

const CampaignChart: React.FC<CampaignChartProps> = ({
  data,
  metric,
  onDotClick,
  formatYAxisTick,
  getMetricMaxValue,
  TooltipContent
}) => {
  const chartConfig = {
    [metric]: {
      color: '#7c3aed'
    }
  };

  return (
    <ChartContainer config={chartConfig} className="aspect-video w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis 
            dataKey="name" 
            label={{ value: 'Day', position: 'insideBottomRight', offset: -10 }}
            tickLine={false}
          />
          <YAxis 
            tickFormatter={formatYAxisTick}
            domain={[0, getMetricMaxValue(metric)]}
            tickLine={false}
          />
          <Tooltip content={<ChartTooltipContent />} />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#7c3aed"
            strokeWidth={2}
            activeDot={{ 
              r: 6, 
              onClick: (data: any) => {
                onDotClick(data.payload.name);
              } 
            }}
          />
        </LineChart>
      </ResponsiveContainer>
      {TooltipContent}
    </ChartContainer>
  );
};

export default CampaignChart;
