
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
    <div className="bg-gray-900/95 p-4 rounded-lg shadow-xl border border-gray-700/80 backdrop-blur-sm text-gray-100">
      <h3 className="font-bold text-white">Mutation {data.mutationNumber}</h3>
      <p className="text-gray-300 mb-2">{payload[0].name}: {payload[0].value}</p>
      <div className="w-64">
        <AspectRatio ratio={16/9}>
          <img
            src={data.imageSrc}
            alt={`Evolution ${data.mutationNumber}`}
            className="rounded-md w-full h-full object-cover border border-gray-700/50"
          />
        </AspectRatio>
      </div>
    </div>
  );
};

export default VideoTooltip;
