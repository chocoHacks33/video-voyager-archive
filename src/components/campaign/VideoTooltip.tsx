
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
    <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
      <h3 className="font-bold text-gray-900">Mutation {data.mutationNumber}</h3>
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

export default VideoTooltip;
