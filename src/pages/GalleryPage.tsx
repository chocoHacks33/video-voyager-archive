import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Play, Rocket, Check } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface VideoData {
  id: number;
  source: string;
  description: string;
}

// Sample data for 9 videos
const videosData: VideoData[] = Array.from({ length: 9 }, (_, index) => ({
  id: index + 1,
  source: `/stock-videos/video${index + 1}.mp4`,
  description: `Demo Video ${index + 1}`
}));

const VideoCard = ({ 
  video, 
  isSelected, 
  onSelect 
}: { 
  video: VideoData; 
  isSelected: boolean;
  onSelect: () => void;
}) => {
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

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent selection when clicking play button
    
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

  const handleRetry = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent selection when clicking retry button
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
      className={`bg-navy rounded-lg overflow-hidden shadow-md relative group transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 hover:shadow-xl cursor-pointer ${
        isSelected ? 'ring-4 ring-green-500' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onSelect}
    >
      <AspectRatio ratio={16/9} className="w-full">
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
              <AlertTriangle className="w-4 h-4" />
              Retry
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
      </AspectRatio>
      
      <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
        <p className="text-base">{video.description}</p>
      </div>
      
      {isSelected && (
        <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
          <Check className="w-5 h-5 text-white" />
        </div>
      )}
    </div>
  );
};

const GalleryPage = () => {
  const navigate = useNavigate();
  const [selectedVideos, setSelectedVideos] = useState<number[]>([]);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const handleSelectVideo = (videoId: number) => {
    setSelectedVideos(prev => {
      if (prev.includes(videoId)) {
        return prev.filter(id => id !== videoId);
      } else {
        return [...prev, videoId];
      }
    });
  };

  const handleLaunchVideos = () => {
    if (selectedVideos.length > 0) {
      setShowSuccessDialog(true);
    } else {
      toast.warning("Please select at least one ad before launching", {
        description: "Click on one or more videos to select them"
      });
    }
  };

  const handleConfirmLaunch = () => {
    setShowSuccessDialog(false);
    toast.success("Ad campaign launched successfully!", {
      description: `Launched ${selectedVideos.length} ad${selectedVideos.length > 1 ? 's' : ''}`
    });
    navigate('/upload');
  };

  return (
    <AppLayout title="Choose Your Ads">
      <div className="w-full bg-gradient-to-br from-purple-100 via-purple-50 to-white dark:from-purple-900 dark:via-purple-800 dark:to-gray-800 rounded-xl p-1 shadow-lg">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {videosData.map(video => (
              <VideoCard 
                key={video.id} 
                video={video} 
                isSelected={selectedVideos.includes(video.id)}
                onSelect={() => handleSelectVideo(video.id)}
              />
            ))}
          </div>
          
          <div className="flex justify-center">
            <Button 
              className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2 group"
              onClick={handleLaunchVideos}
            >
              <Rocket className="w-5 h-5 transition-transform group-hover:rotate-12" />
              Launch Videos {selectedVideos.length > 0 && `(${selectedVideos.length})`}
            </Button>
          </div>
          
          <p className="text-sm text-center text-amber-600 dark:text-amber-400 mt-6">
            Note: To add your own videos, place MP4 files named video1.mp4 through video9.mp4 in the /public/stock-videos/ folder.
          </p>
        </div>
      </div>

      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Launch Ad Campaign</AlertDialogTitle>
            <AlertDialogDescription>
              You've selected {selectedVideos.length} video{selectedVideos.length > 1 ? 's' : ''} for your campaign. 
              Launch now to start showing these ads to your audience.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleConfirmLaunch} className="bg-green-600 hover:bg-green-700">
              Confirm Launch
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
};

export default GalleryPage;
