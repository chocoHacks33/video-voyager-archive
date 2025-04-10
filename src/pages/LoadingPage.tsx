
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { Progress } from "@/components/ui/progress";
import { toast } from 'sonner';
import { QwenAIService, VideoGenerationResponse } from '@/services/qwenAIService';
import { CircleX } from 'lucide-react';

// Function to extract text from video (mock implementation)
const extractTextFromVideo = async (videoFile: File): Promise<string> => {
  // In a real implementation, this would use speech-to-text or OCR services
  console.log('Extracting text from video:', videoFile.name);
  await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate processing time
  
  return "This is simulated text extracted from the uploaded video. In a real implementation, we would use speech-to-text or OCR services to extract actual content from the video.";
};

// Function to save video to storage (simplified implementation)
const saveVideoToStorage = async (videoUrl: string, generatedPrompt: string, videoDescription?: string): Promise<string> => {
  console.log('Saving video to storage:', videoUrl, 'with prompt:', generatedPrompt);
  
  // In a real implementation, this would download the video and save it locally or to cloud storage
  // Also save the video description to localStorage for the gallery page
  if (videoDescription) {
    localStorage.setItem('videoDescription', videoDescription);
  }
  
  return videoUrl; // Return the path/URL where the video is stored
};

const LoadingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("Understanding Ad...");
  const [videoGenerationId, setVideoGenerationId] = useState<string | null>(null);
  const [processingComplete, setProcessingComplete] = useState(false);
  const videoFile = location.state?.videoFile;
  
  // Track completion of each major phase
  const [phases, setPhases] = useState({
    decoded: false,
    mapped: false,
    generated: false
  });

  // Handle navigation after processing is complete
  useEffect(() => {
    let navigateTimeout: number;
    
    if (processingComplete) {
      // Set all phases to complete
      setPhases({
        decoded: true,
        mapped: true,
        generated: true
      });
      
      // Ensure progress reaches 100% and wait a moment before navigating
      setProgress(100);
      navigateTimeout = window.setTimeout(() => {
        navigate('/gallery');
      }, 2500); // Wait 2.5 seconds before redirecting
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
        // Phase 1: Decode Advertisement
        setCurrentStep("Understanding Ad...");
        await simulateProcess(15);
        const extractedText = await extractTextFromVideo(videoFile);
        await simulateProcess(15);
        // Mark first phase as complete
        setPhases(prev => ({ ...prev, decoded: true }));
        
        // Phase 2: Map Demographics
        setCurrentStep("Mapping Demographics...");
        await simulateProcess(15);
        const frames = await QwenAIService.extractFramesFromVideo(videoFile);
        await simulateProcess(15);
        const videoAnalysis = await QwenAIService.getVideoDescription(frames);
        // Mark second phase as complete
        setPhases(prev => ({ ...prev, mapped: true }));
        
        // Phase 3: Generate Advertisement
        setCurrentStep("Morphing Ad...");
        await simulateProcess(15);
        const generatedPrompt = "Cinematic video with enhanced lighting and smooth transitions";
        await simulateProcess(10);
        
        // Call Qwen AI service to generate video
        const videoResponse = await QwenAIService.generateVideo({
          prompt: generatedPrompt,
          text: extractedText,
          style: 'cinematic',
          duration: 5
        });
        
        setVideoGenerationId(videoResponse.id);
        
        // Check video generation status
        let videoResult = videoResponse;
        
        // Poll for status if necessary (simplified for demo)
        if (videoResult.status === 'processing') {
          await simulateProcess(5);
          videoResult = await QwenAIService.getVideoStatus(videoResponse.id);
        }
        
        // Save video to storage
        const videoPath = await saveVideoToStorage(
          videoResult.videoUrl, 
          generatedPrompt,
          videoAnalysis.description
        );
        await simulateProcess(10);
        
        // Mark third phase as complete
        setPhases(prev => ({ ...prev, generated: true }));
        
        // Wait a moment before completing
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Success! Set processing complete flag
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
    <AppLayout title="MORPHING ADVERTISEMENT">
      <div className="flex flex-col items-center justify-center p-8 max-w-4xl mx-auto">
        <div className="w-full space-y-10">
          <div className="relative">
            <div className="mb-6">
              <h3 className="text-xl font-medium text-center text-gray-700 dark:text-gray-300 mb-2">{currentStep}</h3>
              <div className="relative h-3 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                <Progress 
                  value={progress} 
                  className="h-3 transition-all ease-in-out duration-300 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full" 
                />
              </div>
              <div className="mt-2 text-right text-sm font-medium text-gray-600 dark:text-gray-400">
                {progress.toFixed(0)}%
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-6 mx-auto max-w-3xl">
            <div className={`transition-all duration-500 transform ${phases.decoded ? 'scale-100' : 'scale-95'} p-6 rounded-xl shadow-sm border flex items-center space-x-4 ${
              phases.decoded 
                ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800' 
                : 'bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'
            }`}>
              <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                phases.decoded 
                  ? 'bg-green-100 dark:bg-green-800/30 text-green-600 dark:text-green-400' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
              }`}>
                <span className="text-xl font-bold">1</span>
              </div>
              <div>
                <div className={`text-lg font-medium ${
                  phases.decoded 
                    ? 'text-green-700 dark:text-green-400' 
                    : 'text-gray-700 dark:text-gray-300'
                }`}>
                  Advertisement Decoded
                </div>
                <p className={`text-sm ${
                  phases.decoded 
                    ? 'text-green-600/80 dark:text-green-500/80' 
                    : 'text-gray-500 dark:text-gray-400'
                }`}>Understanding audience and content</p>
              </div>
            </div>
            
            <div className={`transition-all duration-500 transform ${phases.mapped ? 'scale-100' : 'scale-95'} p-6 rounded-xl shadow-sm border flex items-center space-x-4 ${
              phases.mapped 
                ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800' 
                : 'bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'
            }`}>
              <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                phases.mapped 
                  ? 'bg-green-100 dark:bg-green-800/30 text-green-600 dark:text-green-400' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
              }`}>
                <span className="text-xl font-bold">2</span>
              </div>
              <div>
                <div className={`text-lg font-medium ${
                  phases.mapped 
                    ? 'text-green-700 dark:text-green-400' 
                    : 'text-gray-700 dark:text-gray-300'
                }`}>
                  Advertisement Demographic Mapping
                </div>
                <p className={`text-sm ${
                  phases.mapped 
                    ? 'text-green-600/80 dark:text-green-500/80' 
                    : 'text-gray-500 dark:text-gray-400'
                }`}>Identifying target demographics</p>
              </div>
            </div>
            
            <div className={`transition-all duration-500 transform ${phases.generated ? 'scale-100' : 'scale-95'} p-6 rounded-xl shadow-sm border flex items-center space-x-4 ${
              phases.generated 
                ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800' 
                : 'bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'
            }`}>
              <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                phases.generated 
                  ? 'bg-green-100 dark:bg-green-800/30 text-green-600 dark:text-green-400' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
              }`}>
                <span className="text-xl font-bold">3</span>
              </div>
              <div>
                <div className={`text-lg font-medium ${
                  phases.generated 
                    ? 'text-green-700 dark:text-green-400' 
                    : 'text-gray-700 dark:text-gray-300'
                }`}>
                  Advertisement Generated
                </div>
                <p className={`text-sm ${
                  phases.generated 
                    ? 'text-green-600/80 dark:text-green-500/80' 
                    : 'text-gray-500 dark:text-gray-400'
                }`}>Creating targeted advertisement</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default LoadingPage;
