
import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { Play, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface VideoData {
  id: number;
  source: string;
  description: string;
}

// Simulate AI-generated video data
const videosData: VideoData[] = [
  { id: 1, source: '/stock-videos/video1.mp4', description: 'Qwen AI: Cinematic version with enhanced lighting' },
  { id: 2, source: '/stock-videos/video2.mp4', description: 'Qwen AI: Black and white artistic rendition' },
  { id: 3, source: '/stock-videos/video3.mp4', description: 'Qwen AI: Slow motion with dramatic effects' },
  { id: 4, source: '/stock-videos/video4.mp4', description: 'Qwen AI: Fast-paced with upbeat transitions' },
  { id: 5, source: '/stock-videos/video5.mp4', description: 'Qwen AI: Cinematic widescreen format' },
  { id: 6, source: '/stock-videos/video6.mp4', description: 'Qwen AI: Vintage filter with grain effect' },
  { id: 7, source: '/stock-videos/video7.mp4', description: 'Qwen AI: Neon color grading with vibrant highlights' },
  { id: 8, source: '/stock-videos/video8.mp4', description: 'Qwen AI: Retro VHS style with scan lines' },
  { id: 9, source: '/stock-videos/video9.mp4', description: 'Qwen AI: Sepia-toned nostalgic footage' },
  { id: 10, source: '/stock-videos/video10.mp4', description: 'Qwen AI: High contrast urban landscape' },
  { id: 11, source: '/stock-videos/video11.mp4', description: 'Qwen AI: Dreamlike soft focus effect' },
  { id: 12, source: '/stock-videos/video12.mp4', description: 'Qwen AI: Vibrant color pop animation' },
  { id: 13, source: '/stock-videos/video13.mp4', description: 'Qwen AI: Minimalist monochrome design' },
  { id: 14, source: '/stock-videos/video14.mp4', description: 'Qwen AI: Dynamic motion graphics' },
  { id: 15, source: '/stock-videos/video15.mp4', description: 'Qwen AI: Ethereal light leak overlay' },
  { id: 16, source: '/stock-videos/video16.mp4', description: 'Qwen AI: Cinematic lens flare effect' }
];

const VideoCard = ({ video }: { video: VideoData }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Check if the video file actually exists
    const checkVideoFile = async () => {
      try {
        const response = await fetch(video.source);
        if (!response.ok) {
          setVideoError(true);
        }
      } catch (error) {
        console.error("Error checking video:", error);
        setVideoError(true);
      }
    };
    
    checkVideoFile();
  }, [video.source]);

  React.useEffect(() => {
    if (isHovered && videoRef.current && !videoError) {
      videoRef.current.play().catch(error => {
        console.error("Error playing video:", error);
        setVideoError(true);
      });
    } else if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [isHovered, videoError]);

  return (
    <div 
      className="bg-navy rounded-lg overflow-hidden shadow-md relative group transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 hover:shadow-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="aspect-video relative">
        {videoError ? (
          <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex flex-col items-center justify-center">
            <AlertTriangle className="w-10 h-10 text-amber-500 mb-2" />
            <p className="text-sm text-center px-4">Video processing or not found</p>
          </div>
        ) : (
          <video 
            ref={videoRef}
            src={video.source}
            className="w-full h-full object-cover"
            loop
            muted
            playsInline
            onError={() => setVideoError(true)}
          />
        )}
        
        {!isHovered && !videoError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <Play className="w-16 h-16 text-white" />
          </div>
        )}
      </div>
      
      <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
        <p className="text-base">{video.description}</p>
        <p className="text-xs mt-1 text-gray-300">5 seconds • AI Generated</p>
      </div>
    </div>
  );
};

const GalleryPage = () => {
  useEffect(() => {
    // Check if any videos exist at all
    const checkVideosExist = async () => {
      let anyVideosExist = false;
      
      for (const video of videosData.slice(0, 3)) { // Just check first few videos
        try {
          const response = await fetch(video.source);
          if (response.ok) {
            anyVideosExist = true;
            break;
          }
        } catch (error) {
          console.error("Error checking video:", error);
        }
      }
      
      if (!anyVideosExist) {
        toast.info("Videos are still being generated and saved. This may take some time.", {
          duration: 5000
        });
      }
    };
    
    checkVideosExist();
  }, []);

  return (
    <AppLayout title="QWEN AI GENERATED VIDEOS">
      <div className="w-full bg-gradient-to-br from-purple-100 via-purple-50 to-white dark:from-purple-900 dark:via-purple-800 dark:to-gray-800 rounded-xl p-1 shadow-lg">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Your AI Video Variations</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Each video is 5 seconds long and generated by Qwen AI based on the text extracted from your original video.
            </p>
            <p className="text-sm text-amber-600 dark:text-amber-400 mt-2">
              Note: If videos appear missing, they may still be processing. Try refreshing the page after a few minutes.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {videosData.map(video => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default GalleryPage;
