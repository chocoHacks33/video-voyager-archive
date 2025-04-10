
import React, { useState, useEffect } from 'react';
import { CircleCheck, CircleX, AlertTriangle } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import { Play, Download, RefreshCw, Rocket } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

interface VideoData {
  id: number;
  source: string;
  description: string;
  type: string;
}

const VideoCard = ({ video, index }: { video: VideoData; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  useEffect(() => {
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
            <p className="text-sm text-center">Video not found or still processing</p>
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
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-medium bg-blue-500 px-2 py-0.5 rounded">{video.type}</span>
          <span className="text-xs">Video {index + 1}</span>
        </div>
        <p className="text-base">{video.description}</p>
        <p className="text-xs mt-1 text-gray-300">5 seconds • AI Generated</p>
      </div>
    </div>
  );
};

const GalleryPage = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [videoDescription, setVideoDescription] = useState<string | null>(null);
  const [videos, setVideos] = useState<VideoData[]>([]);
  
  useEffect(() => {
    // Check if the videos exist and prepare the video data
    const prepareVideos = async () => {
      const videoList: VideoData[] = [];
      
      // Add the Qwen AI video
      videoList.push({ 
        id: 1, 
        source: '/stock-videos/video1.mp4', 
        description: 'Qwen AI: Cinematic version with enhanced lighting and smooth transitions',
        type: 'Qwen AI'
      });
      
      // Check if WAN AI video is available
      const wanAiVideoUrl = localStorage.getItem('wanAiVideoUrl');
      if (wanAiVideoUrl) {
        videoList.push({
          id: 2,
          source: wanAiVideoUrl,
          description: 'WAN AI: Generated from extracted text of the original video',
          type: 'WAN AI'
        });
      }
      
      setVideos(videoList);
      
      // Check if videos are accessible
      try {
        const qwenResponse = await fetch(videoList[0].source);
        if (!qwenResponse.ok) {
          toast.custom((id) => (
            <div className="bg-amber-100 text-amber-800 rounded-md p-4 flex items-center gap-2 shadow-md">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <span>Some videos are still being generated. This may take some time.</span>
            </div>
          ), { duration: 5000 });
        }
      } catch (error) {
        console.error("Error checking videos:", error);
      }
    };
    
    // Retrieve video description from localStorage
    const storedDescription = localStorage.getItem('videoDescription');
    if (storedDescription) {
      setVideoDescription(storedDescription);
    }
    
    prepareVideos();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    window.location.reload();
  };

  const handleLaunch = () => {
    toast.custom((id) => (
      <div className="bg-green-500 text-white rounded-md p-4 flex items-center gap-2 shadow-md">
        <CircleCheck className="h-5 w-5 text-white" />
        <span className="font-medium">Your Targeted Ad-Campaign is Launched!</span>
      </div>
    ), { duration: 3000 });
  };

  return (
    <AppLayout title="AI GENERATED VIDEOS">
      <div className="w-full bg-gradient-to-br from-purple-100 via-purple-50 to-white dark:from-purple-900 dark:via-purple-800 dark:to-gray-800 rounded-xl p-1 shadow-lg">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold mb-2">Your AI Videos</h2>
              <p className="text-gray-600 dark:text-gray-300">
                These videos were generated by AI based on the text extracted from your original video.
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {videos.map((video, index) => (
              <VideoCard key={video.id} video={video} index={index} />
            ))}
          </div>
          
          {videos.length === 0 && (
            <div className="p-8 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
              <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Videos Available</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Your videos are still being generated. Please wait a moment and refresh the page.
              </p>
              <Button onClick={handleRefresh} className="flex items-center gap-2 mx-auto">
                <RefreshCw className="w-4 h-4" />
                Refresh
              </Button>
            </div>
          )}
          
          <p className="text-sm text-center text-amber-600 dark:text-amber-400 mt-6">
            Note: If a video appears missing, it may still be processing. Try refreshing the page after a few minutes.
          </p>
          
          {videoDescription && (
            <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Video Analysis</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {videoDescription}
              </p>
            </div>
          )}
          
          <div className="flex justify-center mt-8">
            <Button 
              onClick={handleLaunch}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 px-6 rounded-md font-medium shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              size="lg"
            >
              <Rocket className="mr-2 h-5 w-5" />
              Launch Campaign
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default GalleryPage;
