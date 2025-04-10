
import React, { useState } from 'react';
import { AlertTriangle, Play, RefreshCw } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

interface VideoData {
  id: number;
  source: string;
  description: string;
}

// Sample data for 16 videos
const videosData: VideoData[] = Array.from({ length: 16 }, (_, index) => ({
  id: index + 1,
  source: `/stock-videos/video${index + 1}.mp4`,
  description: `Demo Video ${index + 1}`
}));

const VideoCard = ({ video }: { video: VideoData }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    // Check if the video file actually exists
    const checkVideoFile = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(video.source);
        if (!response.ok) {
          console.error(`Video file not found: ${video.source}`);
          setVideoError(true);
        } else {
          setVideoError(false);
        }
      } catch (error) {
        console.error("Error checking video:", error);
        setVideoError(true);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkVideoFile();
  }, [video.source]);

  const handlePlay = () => {
    if (videoRef.current && !videoError) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(error => {
            console.error("Error playing video:", error);
            setVideoError(true);
          });
      }
    }
  };

  const handleRetry = () => {
    setIsLoading(true);
    setVideoError(false);
    // Force reload the current page
    window.location.reload();
  };

  React.useEffect(() => {
    if (isHovered && videoRef.current && !videoError && !isPlaying) {
      videoRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(error => {
          console.error("Error playing video:", error);
          setVideoError(true);
        });
    } else if (!isHovered && videoRef.current && isPlaying) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  }, [isHovered, videoError, isPlaying]);

  return (
    <div 
      className="bg-navy rounded-lg overflow-hidden shadow-md relative group transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 hover:shadow-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="aspect-video relative">
        {isLoading ? (
          <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : videoError ? (
          <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex flex-col items-center justify-center p-4">
            <AlertTriangle className="w-10 h-10 text-amber-500 mb-2" />
            <p className="text-sm text-center">Video not found or unavailable</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-4 flex items-center gap-2"
              onClick={handleRetry}
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
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
        
        {!isHovered && !videoError && !isPlaying && !isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <button onClick={handlePlay} className="p-4 rounded-full bg-white/10 hover:bg-white/20 transition-all">
              <Play className="w-12 h-12 text-white" />
            </button>
          </div>
        )}
      </div>
      
      <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
        <p className="text-base">{video.description}</p>
      </div>
    </div>
  );
};

const GalleryPage = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    window.location.reload();
  };

  return (
    <AppLayout title="VIDEO GALLERY">
      <div className="w-full bg-gradient-to-br from-purple-100 via-purple-50 to-white dark:from-purple-900 dark:via-purple-800 dark:to-gray-800 rounded-xl p-1 shadow-lg">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold mb-2">Your Video Gallery</h2>
              <p className="text-gray-600 dark:text-gray-300">
                Browse through your collection of demo videos.
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {videosData.map(video => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
          
          <p className="text-sm text-center text-amber-600 dark:text-amber-400 mt-6">
            Note: To add your own videos, place MP4 files named video1.mp4 through video16.mp4 in the /public/stock-videos/ folder.
          </p>
        </div>
      </div>
    </AppLayout>
  );
};

export default GalleryPage;
