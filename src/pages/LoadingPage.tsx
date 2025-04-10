
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { Progress } from "@/components/ui/progress";
import { toast } from 'sonner';
import { QwenAIService, VideoGenerationResponse } from '@/services/qwenAIService';
import { CircleCheck, CircleX, Clock } from 'lucide-react';

// Function to extract text from video (mock implementation)
const extractTextFromVideo = async (videoFile: File): Promise<string> => {
  // In a real implementation, this would use speech-to-text or OCR services
  console.log('Extracting text from video:', videoFile.name);
  await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate processing time
  
  return "This is simulated text extracted from the uploaded video. In a real implementation, we would use speech-to-text or OCR services to extract actual content from the video.";
};

// Function to save video to storage (simplified implementation)
const saveVideoToStorage = async (videoUrl: string, generatedPrompt: string, videoDescription?: string, wanAiVideoUrl?: string): Promise<string> => {
  console.log('Saving video to storage:', videoUrl, 'with prompt:', generatedPrompt);
  
  // In a real implementation, this would download the video and save it locally or to cloud storage
  // Also save the video description to localStorage for the gallery page
  if (videoDescription) {
    localStorage.setItem('videoDescription', videoDescription);
  }
  
  // Save the WAN AI video URL if available
  if (wanAiVideoUrl) {
    localStorage.setItem('wanAiVideoUrl', wanAiVideoUrl);
  }
  
  return videoUrl; // Return the path/URL where the video is stored
};

const LoadingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("Extracting text from video...");
  const [videoGenerationId, setVideoGenerationId] = useState<string | null>(null);
  const [processingComplete, setProcessingComplete] = useState(false);
  const [wanAiTaskId, setWanAiTaskId] = useState<string | null>(null);
  const [wanAiStatus, setWanAiStatus] = useState<string>('waiting');
  const [wanAiCheckCount, setWanAiCheckCount] = useState(0);
  const [maxWanAiChecks] = useState(300); // Changed from 20 to 300 checks
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

  // Effect to check WAN AI task status periodically
  useEffect(() => {
    let statusCheckInterval: number;

    if (wanAiTaskId && wanAiStatus !== 'completed' && wanAiStatus !== 'failed' && wanAiCheckCount < maxWanAiChecks) {
      statusCheckInterval = window.setInterval(async () => {
        try {
          setCurrentStep(`Checking WAN AI Video Status (Attempt ${wanAiCheckCount + 1}/${maxWanAiChecks})...`);
          const status = await QwenAIService.checkWanAiTaskStatus(wanAiTaskId);
          setWanAiStatus(status.status);
          setWanAiCheckCount(prev => prev + 1);
          
          if (status.status === 'completed') {
            // Fetch the video when it's completed
            setCurrentStep('Downloading WAN AI Video...');
            await simulateProcess(5);
            const videoUrl = await QwenAIService.downloadWanAiVideo(wanAiTaskId);
            localStorage.setItem('wanAiVideoUrl', videoUrl);
            setProcessingComplete(true);
            clearInterval(statusCheckInterval);
          } else if (status.status === 'failed') {
            console.error('WAN AI video generation failed:', status.error);
            toast.error('WAN AI video generation failed. Proceeding with original video only.');
            setProcessingComplete(true);
            clearInterval(statusCheckInterval);
          } else if (wanAiCheckCount >= maxWanAiChecks - 1) {
            // Give up after max attempts
            console.warn('Maximum WAN AI check attempts reached. Proceeding with original video.');
            toast.warning('WAN AI video is taking too long. Proceeding with original video only.');
            setProcessingComplete(true);
            clearInterval(statusCheckInterval);
          }
        } catch (error) {
          console.error('Error checking WAN AI status:', error);
          setWanAiCheckCount(prev => prev + 1);
          
          if (wanAiCheckCount >= maxWanAiChecks - 1) {
            toast.error('WAN AI status check failed. Proceeding with original video only.');
            setProcessingComplete(true);
            clearInterval(statusCheckInterval);
          }
        }
      }, 10000); // Check every 10 seconds
    }

    return () => {
      if (statusCheckInterval) {
        clearInterval(statusCheckInterval);
      }
    };
  }, [wanAiTaskId, wanAiStatus, wanAiCheckCount, maxWanAiChecks]);

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
        await simulateProcess(10);
        const extractedText = await extractTextFromVideo(videoFile);
        
        // Step 2: Extract frames and analyze video content
        setCurrentStep("Analyzing Video Content...");
        await simulateProcess(10);
        const frames = await QwenAIService.extractFramesFromVideo(videoFile);
        
        // Step 3: Get video description from Qwen VL
        setCurrentStep("Generating Video Description...");
        await simulateProcess(10);
        const videoAnalysis = await QwenAIService.getVideoDescription(frames);
        
        // Step 4: Generate AI prompt from text
        setCurrentStep("Studying Audience Demographics...");
        await simulateProcess(10);
        const generatedPrompt = "Cinematic video with enhanced lighting and smooth transitions";
        
        // Step 5: Creating AI video with Qwen
        setCurrentStep("Generating Audience-Specific Advertisements...");
        await simulateProcess(20);
        
        // Call Qwen AI service to generate video
        const videoResponse = await QwenAIService.generateVideo({
          prompt: generatedPrompt,
          text: extractedText,
          style: 'cinematic',
          duration: 5
        });
        
        setVideoGenerationId(videoResponse.id);
        
        // Step 6: Generate WAN AI video using the extracted text
        setCurrentStep("Creating WAN AI Video...");
        await simulateProcess(10);
        try {
          // Start WAN AI video generation and get the task ID
          const wanAiTaskId = await QwenAIService.startWanAiVideoGeneration(
            "Cinematic advertisement based on brand context", 
            extractedText
          );
          
          console.log("WAN AI Video generation started, task ID:", wanAiTaskId);
          setWanAiTaskId(wanAiTaskId);
          setWanAiStatus('processing');
          
          // We'll now wait for the WAN AI video to complete via the useEffect
          setCurrentStep("Waiting for WAN AI video generation to complete...");
          
          // Step 7: Check video generation status for Qwen video
          setCurrentStep("Processing Qwen Video...");
          let videoResult = videoResponse;
          
          // Poll for status if necessary (simplified for demo)
          if (videoResult.status === 'processing') {
            await simulateProcess(10);
            videoResult = await QwenAIService.getVideoStatus(videoResponse.id);
          }
          
          // Step 8: Save Qwen video to storage
          setCurrentStep("Saving Qwen Video to Gallery...");
          const videoPath = await saveVideoToStorage(
            videoResult.videoUrl, 
            generatedPrompt,
            videoAnalysis.description
          );
          await simulateProcess(5);
          
          // Don't set processing complete yet - we're waiting for WAN AI
          
        } catch (error) {
          console.error("WAN AI video generation failed:", error);
          toast.error("WAN AI video generation failed, proceeding with original video only");
          
          // Even if WAN AI fails, we still have the Qwen video, so mark processing as complete
          setProcessingComplete(true);
        }
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
  }, [navigate, videoFile, location.state, maxWanAiChecks]);
  
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
          
          {wanAiTaskId && wanAiStatus === 'processing' && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center gap-3 my-4">
              <Clock className="h-5 w-5 text-amber-600 animate-pulse" />
              <p className="text-sm text-amber-700">
                Waiting for WAN AI video generation to complete. This may take several minutes...
                <br />
                <span className="text-xs">Check {wanAiCheckCount} of {maxWanAiChecks}</span>
              </p>
            </div>
          )}
          
          <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-100">
            <h3 className="font-medium mb-2">What's happening?</h3>
            <ol className="space-y-2 text-sm text-gray-600 list-decimal pl-5">
              <li className={progress >= 10 ? "text-green-600 font-medium" : ""}>
                Processing your Brand Advertisement
              </li>
              <li className={progress >= 20 ? "text-green-600 font-medium" : ""}>
                Analyzing Video Content and Extracting Frames
              </li>
              <li className={progress >= 30 ? "text-green-600 font-medium" : ""}>
                Generating Video Description
              </li>
              <li className={progress >= 40 ? "text-green-600 font-medium" : ""}>
                Analyzing User Demographics
              </li>
              <li className={progress >= 60 ? "text-green-600 font-medium" : ""}>
                Generating Audience-Specific Advertisement with Qwen AI
              </li>
              <li className={progress >= 80 ? "text-green-600 font-medium" : ""}>
                Creating WAN AI Video Alternative
                {wanAiStatus === 'processing' && (
                  <span className="text-amber-600 ml-2">(in progress...)</span>
                )}
                {wanAiStatus === 'completed' && (
                  <span className="text-green-600 ml-2">(complete)</span>
                )}
                {wanAiStatus === 'failed' && (
                  <span className="text-red-600 ml-2">(failed)</span>
                )}
              </li>
              <li className={progress >= 90 ? "text-green-600 font-medium" : ""}>
                Preparing Gallery of Advertisement Variations
              </li>
            </ol>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default LoadingPage;
