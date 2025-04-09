
import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Play } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface VideoData {
  id: number;
  source: string;
  description: string;
}

const videosData: VideoData[] = [
  { id: 1, source: '/stock-videos/video1.mp4', description: 'Standard version with enhanced colors' },
  { id: 2, source: '/stock-videos/video2.mp4', description: 'Black and white artistic version' },
  { id: 3, source: '/stock-videos/video3.mp4', description: 'Slow motion with dramatic effects' },
  { id: 4, source: '/stock-videos/video4.mp4', description: 'Fast paced with upbeat transitions' },
  { id: 5, source: '/stock-videos/video5.mp4', description: 'Cinematic wide screen format' },
  { id: 6, source: '/stock-videos/video6.mp4', description: 'Vintage filter with film grain effect' },
  { id: 7, source: '/stock-videos/video7.mp4', description: 'Neon color grading with vibrant highlights' },
  { id: 8, source: '/stock-videos/video8.mp4', description: 'Retro VHS style with scan lines' },
  { id: 9, source: '/stock-videos/video9.mp4', description: 'Sepia-toned nostalgic footage' },
  { id: 10, source: '/stock-videos/video10.mp4', description: 'High contrast urban landscape' },
  { id: 11, source: '/stock-videos/video11.mp4', description: 'Dreamlike soft focus effect' },
  { id: 12, source: '/stock-videos/video12.mp4', description: 'Vibrant color pop animation' },
  { id: 13, source: '/stock-videos/video13.mp4', description: 'Minimalist monochrome design' },
  { id: 14, source: '/stock-videos/video14.mp4', description: 'Dynamic motion graphics' },
  { id: 15, source: '/stock-videos/video15.mp4', description: 'Ethereal light leak overlay' },
  { id: 16, source: '/stock-videos/video16.mp4', description: 'Cinematic lens flare effect' }
];

const VideoCard = ({ video }: { video: VideoData }) => {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    if (isHovered && videoRef.current) {
      videoRef.current.play().catch(error => {
        console.error("Error playing video:", error);
      });
    } else if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [isHovered]);

  return (
    <div 
      className="bg-navy rounded-lg overflow-hidden shadow-md relative group transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 hover:shadow-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="aspect-video relative">
        <video 
          ref={videoRef}
          src={video.source}
          className="w-full h-full object-cover"
          loop
          muted
          playsInline
        />
        {!isHovered && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <Play className="w-12 h-12 text-white" />
          </div>
        )}
      </div>
      
      {isHovered && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 text-white">
          <p className="text-sm">{video.description}</p>
        </div>
      )}
    </div>
  );
};

const GalleryPage = () => {
  return (
    <AppLayout title="GENERATED VIDEO FORMATS">
      <ScrollArea className="h-[calc(100vh-140px)]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-8">
          {videosData.map(video => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </ScrollArea>
    </AppLayout>
  );
};

export default GalleryPage;
