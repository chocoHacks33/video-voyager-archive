
import React from 'react';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface VideoTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const VideoTooltip = ({ active, payload, label }: VideoTooltipProps) => {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload;

  return (
    <div className="bg-white dark:bg-gray-800/90 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700/50 backdrop-blur-sm">
      <h3 className="font-bold text-gray-900 dark:text-gray-100">Mutation {data.mutationNumber}</h3>
      <p className="text-gray-600 dark:text-gray-300 mb-2">{payload[0].name}: {payload[0].value}</p>
      <div className="w-64">
        <AspectRatio ratio={16/9}>
          <img
            src={data.imageSrc}
            alt={`Evolution ${data.mutationNumber}`}
            className="rounded-md w-full h-full object-cover border border-gray-200/50 dark:border-gray-700/30"
          />
        </AspectRatio>
      </div>
    </div>
  );
};

export default VideoTooltip;
