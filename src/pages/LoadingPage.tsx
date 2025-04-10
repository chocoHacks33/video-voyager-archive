import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { Progress } from "@/components/ui/progress";
import { toast } from 'sonner';
import { QwenAIService, VideoGenerationResponse } from '@/services/qwenAIService';
import { CircleCheck, CircleX } from 'lucide-react';

// Function to extract text from video (mock implementation)
const extractTextFromVideo = async (videoFile: File): Promise<string> => {
  // In a real implementation, this would use speech-to-text or OCR services
  console.log('Extracting text from video:', videoFile.name);
  await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate processing time
  
  return "This is simulated text extracted from the uploaded video. In a real implementation, we would use speech-to-text or OCR services to extract actual content from the video.";
};

// Function to save video to storage (simplified implementation)
const saveVideoToStorage = async (videoUrl: string, generatedPrompt: string): Promise<string> => {
  console.log('Saving video to storage:', videoUrl, 'with prompt:', generatedPrompt);
  
  // In a real implementation, this would download the video and save it locally or to cloud storage
  return videoUrl; // Return the path/URL where the video is stored
};

const LoadingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("Extracting text from video...");
  const [videoGenerationId, setVideoGenerationId] = useState<string | null>(null);
  const [processingComplete, setProcessingComplete] = useState(false);
  const videoFile = location.state?.videoFile;
  
  // Handle navigation after processing is complete
  useEffect(() => {
    let navigateTimeout: number;
    
    if (processingComplete) {
      // Ensure progress reaches 100% and wait a moment before navigating
      setProgress(100);
      navigateTimeout = window.setTimeout(() => {
        toast.custom((id) => (
          <div className="bg-green-500 text-white rounded-md p-4 flex items-center gap-2 shadow-md">
            <CircleCheck className="h-5 w-5 text-white" />
            <span className="font-medium">Video processing complete!</span>
          </div>
        ), { duration: 3000 });
        navigate('/gallery');
      }, 500); // Short delay to ensure progress bar animation completes
    }
    
    return () => {
      if (navigateTimeout) {
        clearTimeout(navigateTimeout);
      }
    };
  }, [processingComplete, navigate]);

  useEffect(() => {
    if (!videoFile) {
      toast.custom((id) => (
        <div className="bg-red-500 text-white rounded-md p-4 flex items-center gap-2 shadow-md">
          <CircleX className="h-5 w-5 text-white" />
          <span className="font-medium">No video file provided</span>
        </div>
      ), { duration: 3000 });
      navigate('/upload');
      return;
    }

    const processVideo = async () => {
      try {
        // Step 1: Extract text from video
        setCurrentStep("Decoding Brand Advertisement...");
        await simulateProcess(20);
        const extractedText = await extractTextFromVideo(videoFile);
        
        // Step 2: Generate AI prompt from text
        setCurrentStep("Studying Audience Demographics...");
        await simulateProcess(20);
        const generatedPrompt = "Cinematic video with enhanced lighting and smooth transitions";
        
        // Step 3: Creating AI video with Qwen
        setCurrentStep("Generating Audience-Specific Advertisements...");
        await simulateProcess(30);
        
        // Call Qwen AI service to generate video
        const videoResponse = await QwenAIService.generateVideo({
          prompt: generatedPrompt,
          text: extractedText,
          style: 'cinematic',
          duration: 5
        });
        
        setVideoGenerationId(videoResponse.id);
        
        // Step 4: Check video generation status
        setCurrentStep("Processing Video...");
        let videoResult = videoResponse;
        
        // Poll for status if necessary (simplified for demo)
        if (videoResult.status === 'processing') {
          await simulateProcess(20);
          videoResult = await QwenAIService.getVideoStatus(videoResponse.id);
        }
        
        // Step 5: Save video to storage
        setCurrentStep("Saving Video to Gallery...");
        const videoPath = await saveVideoToStorage(videoResult.videoUrl, generatedPrompt);
        await simulateProcess(10);
        
        // Success! Set processing complete flag instead of immediate navigation
        setProcessingComplete(true);
      } catch (error) {
        console.error("Video processing error:", error);
        toast.custom((id) => (
          <div className="bg-red-500 text-white rounded-md p-4 flex items-center gap-2 shadow-md">
            <CircleX className="h-5 w-5 text-white" />
            <span className="font-medium">Error processing video</span>
          </div>
        ), { duration: 3000 });
        navigate('/upload');
      }
    };

    processVideo();
  }, [navigate, videoFile, location.state]);
  
  // Simulate a processing step with progress updates
  const simulateProcess = (percentage: number) => {
    return new Promise<void>((resolve) => {
      const startValue = progress;
      const endValue = Math.min(startValue + percentage, 99); // Cap at 99% to allow for final jump to 100%
      const duration = percentage * 100; // Adjust speed based on percentage
      const startTime = Date.now();
      
      const updateProgress = () => {
        const elapsed = Date.now() - startTime;
        const progressDelta = Math.min(elapsed / duration, 1) * percentage;
        const newProgress = startValue + progressDelta;
        
        setProgress(Math.min(newProgress, endValue));
        
        if (newProgress < endValue) {
          requestAnimationFrame(updateProgress);
        } else {
          resolve();
        }
      };
      
      updateProgress();
    });
  };
  
  return (
    <AppLayout title="PROCESSING VIDEO">
      <div className="flex flex-col items-center justify-center p-8 max-w-3xl mx-auto">
        <div className="w-full space-y-6">
          <h2 className="text-xl font-semibold text-center">{currentStep}</h2>
          
          <Progress value={progress} className="h-2 w-full" />
          
          <p className="text-center text-gray-600">
            {progress.toFixed(0)}% complete
          </p>
          
          <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-100">
            <h3 className="font-medium mb-2">What's happening?</h3>
            <ol className="space-y-2 text-sm text-gray-600 list-decimal pl-5">
              <li className={progress >= 20 ? "text-green-600 font-medium" : ""}>
                Processing your Brand Advertisement
              </li>
              <li className={progress >= 40 ? "text-green-600 font-medium" : ""}>
                Analyzing User Demographics
              </li>
              <li className={progress >= 70 ? "text-green-600 font-medium" : ""}>
                Generating Unique Advertisement for Specific Users
              </li>
              <li className={progress >= 90 ? "text-green-600 font-medium" : ""}>
                Displaying Gallery of Advertisement Spinoffs
              </li>
            </ol>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default LoadingPage;
