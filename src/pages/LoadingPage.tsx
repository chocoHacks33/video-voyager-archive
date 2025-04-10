
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { toast } from 'sonner';
import { QwenAIService } from '@/services/qwenAIService';
import { CircleX, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

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
        setProgress(0); // Start at 0%
        
        // Gradually increase to 95% during this phase
        await simulateProcessToCompletion(95);
        
        const extractedText = await extractTextFromVideo(videoFile);
        
        // Reach 100% for this phase
        await simulateProcessToCompletion(100);
        
        // Mark first phase as complete
        setPhases(prev => ({ ...prev, decoded: true }));
        
        // Phase 2: Map Demographics
        setCurrentStep("Mapping Demographics...");
        setProgress(0); // Reset progress for next phase
        
        // Gradually increase to 95% during this phase
        await simulateProcessToCompletion(95);
        
        const frames = await QwenAIService.extractFramesFromVideo(videoFile);
        const videoAnalysis = await QwenAIService.getVideoDescription(frames);
        
        // Reach 100% for this phase
        await simulateProcessToCompletion(100);
        
        // Mark second phase as complete
        setPhases(prev => ({ ...prev, mapped: true }));
        
        // Phase 3: Generate Advertisement
        setCurrentStep("Morphing Ad...");
        setProgress(0); // Reset progress for next phase
        
        // Gradually increase to 95% during this phase
        await simulateProcessToCompletion(95);
        
        const generatedPrompt = "Cinematic video with enhanced lighting and smooth transitions";
        
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
          videoResult = await QwenAIService.getVideoStatus(videoResponse.id);
        }
        
        // Save video to storage
        const videoPath = await saveVideoToStorage(
          videoResult.videoUrl, 
          generatedPrompt,
          videoAnalysis.description
        );
        
        // Reach 100% for this phase
        await simulateProcessToCompletion(100);
        
        // Mark third phase as complete
        setPhases(prev => ({ ...prev, generated: true }));
        
        // Wait a moment before completing
        await new Promise(resolve => setTimeout(resolve, 500));
        
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
  
  // Simulate a processing step that completes to the target percentage
  const simulateProcessToCompletion = (targetPercentage: number) => {
    return new Promise<void>((resolve) => {
      const startValue = progress;
      const endValue = targetPercentage;
      const duration = 1500; // 1.5 seconds to reach the target
      const startTime = Date.now();
      
      const updateProgress = () => {
        const elapsed = Date.now() - startTime;
        const progressPercent = Math.min(elapsed / duration, 1);
        const newProgress = startValue + (endValue - startValue) * progressPercent;
        
        setProgress(Math.min(newProgress, endValue));
        
        if (progressPercent < 1) {
          requestAnimationFrame(updateProgress);
        } else {
          resolve();
        }
      };
      
      updateProgress();
    });
  };
  
  // Calculate stroke dasharray for circle animation
  const calculateStrokeDasharray = (percent: number) => {
    const circumference = 2 * Math.PI * 45; // Circle with r=45
    return `${(percent / 100) * circumference} ${circumference}`;
  };
  
  return (
    <AppLayout title="MORPHING ADVERTISEMENT">
      <div className="flex flex-col items-center justify-center p-8 max-w-4xl mx-auto min-h-[60vh]">
        <div className="w-full space-y-12">
          {/* Circular progress indicator */}
          <div className="flex justify-center mb-8">
            <div className="relative w-48 h-48">
              {/* Background circle */}
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle 
                  cx="50" 
                  cy="50" 
                  r="45" 
                  fill="none" 
                  strokeWidth="8" 
                  className="stroke-gray-200 dark:stroke-gray-700"
                />
                {/* Progress circle with gradient */}
                <circle 
                  cx="50" 
                  cy="50" 
                  r="45" 
                  fill="none" 
                  strokeWidth="8" 
                  strokeLinecap="round" 
                  strokeDasharray={calculateStrokeDasharray(progress)} 
                  className="stroke-[url(#progress-gradient)] transition-all duration-300 ease-in-out"
                />
                {/* Define gradient for the circle */}
                <defs>
                  <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4ade80" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                </defs>
              </svg>
              
              {/* Show spinner in the center when processing */}
              {!processingComplete && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="h-10 w-10 text-green-500 animate-spin" />
                </div>
              )}
              
              {/* Progress percentage */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-gray-800 dark:text-gray-200">
                  {Math.round(progress)}%
                </span>
              </div>
            </div>
          </div>
          
          {/* Phase cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mx-auto">
            {/* Phase 1 Card */}
            <div className={cn(
              "transition-all duration-500 p-6 rounded-xl shadow-sm border flex flex-col items-center text-center space-y-3",
              phases.decoded 
                ? "bg-gradient-to-b from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800" 
                : "bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
            )}>
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center",
                phases.decoded 
                  ? "bg-green-100 dark:bg-green-800/30 text-green-600 dark:text-green-400" 
                  : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
              )}>
                <span className="text-xl font-bold">1</span>
              </div>
              <div className={cn(
                "text-lg font-medium",
                phases.decoded 
                  ? "text-green-700 dark:text-green-400" 
                  : "text-gray-700 dark:text-gray-300"
              )}>
                Advertisement Decoded
              </div>
            </div>
            
            {/* Phase 2 Card */}
            <div className={cn(
              "transition-all duration-500 p-6 rounded-xl shadow-sm border flex flex-col items-center text-center space-y-3",
              phases.mapped 
                ? "bg-gradient-to-b from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800" 
                : "bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
            )}>
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center",
                phases.mapped 
                  ? "bg-green-100 dark:bg-green-800/30 text-green-600 dark:text-green-400" 
                  : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
              )}>
                <span className="text-xl font-bold">2</span>
              </div>
              <div className={cn(
                "text-lg font-medium",
                phases.mapped 
                  ? "text-green-700 dark:text-green-400" 
                  : "text-gray-700 dark:text-gray-300"
              )}>
                Demographics Mapped
              </div>
            </div>
            
            {/* Phase 3 Card */}
            <div className={cn(
              "transition-all duration-500 p-6 rounded-xl shadow-sm border flex flex-col items-center text-center space-y-3",
              phases.generated 
                ? "bg-gradient-to-b from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800" 
                : "bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
            )}>
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center",
                phases.generated 
                  ? "bg-green-100 dark:bg-green-800/30 text-green-600 dark:text-green-400" 
                  : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
              )}>
                <span className="text-xl font-bold">3</span>
              </div>
              <div className={cn(
                "text-lg font-medium",
                phases.generated 
                  ? "text-green-700 dark:text-green-400" 
                  : "text-gray-700 dark:text-gray-300"
              )}>
                Advertisement Generated
              </div>
            </div>
          </div>
          
          {/* Current step text */}
          <div className="text-center">
            <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300">
              {currentStep}
            </h3>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default LoadingPage;
