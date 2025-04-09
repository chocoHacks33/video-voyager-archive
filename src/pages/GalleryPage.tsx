
import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { Play, AlertTriangle, Download } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

interface VideoData {
  id: number;
  source: string;
  description: string;
}

// Simulate AI-generated video data - just one video for now
const videoData: VideoData = { 
  id: 1, 
  source: '/stock-videos/video1.mp4', 
  description: 'Qwen AI: Cinematic version with enhanced lighting' 
};

const VideoCard = ({ video }: { video: VideoData }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Check if the video file actually exists
    const checkVideoFile = async () => {
      try {
        const response = await fetch(video.source);
        if (!response.ok) {
          console.error(`Video file not found: ${video.source}`);
          setVideoError(true);
        }
      } catch (error) {
        console.error("Error checking video:", error);
        setVideoError(true);
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
        {videoError ? (
          <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex flex-col items-center justify-center">
            <AlertTriangle className="w-10 h-10 text-amber-500 mb-2" />
            <p className="text-sm text-center px-4">Video not found or still processing</p>
            <Button variant="outline" size="sm" className="mt-4" onClick={() => window.location.reload()}>
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
        
        {!isHovered && !videoError && !isPlaying && (
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
    // Check if the video exists at all
    const checkVideoExists = async () => {
      try {
        const response = await fetch(videoData.source);
        if (!response.ok) {
          toast.info("Video is still being generated and saved. This may take some time.", {
            duration: 5000
          });
        }
      } catch (error) {
        console.error("Error checking video:", error);
        toast.info("Video is still being generated and saved. This may take some time.", {
          duration: 5000
        });
      }
    };
    
    checkVideoExists();
  }, []);

  return (
    <AppLayout title="QWEN AI GENERATED VIDEO">
      <div className="w-full bg-gradient-to-br from-purple-100 via-purple-50 to-white dark:from-purple-900 dark:via-purple-800 dark:to-gray-800 rounded-xl p-1 shadow-lg">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Your AI Video</h2>
            <p className="text-gray-600 dark:text-gray-300">
              This video is 5 seconds long and generated by Qwen AI based on the text extracted from your original video.
            </p>
            <p className="text-sm text-amber-600 dark:text-amber-400 mt-2">
              Note: If video appears missing, it may still be processing. Try refreshing the page after a few minutes.
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <VideoCard key={videoData.id} video={videoData} />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default GalleryPage;
