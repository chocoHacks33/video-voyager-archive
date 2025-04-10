
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
        toast.custom((id) => (
          <div className="bg-green-500 text-white rounded-md p-4 flex items-center gap-2 shadow-md">
            <CircleCheck className="h-5 w-5 text-white" />
            <span className="font-medium">Video processing complete!</span>
          </div>
        ), { duration: 3000 });
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
      <div className="flex flex-col items-center justify-center p-8 max-w-3xl mx-auto">
        <div className="w-full space-y-6">
          <h2 className="text-xl font-semibold text-center">{currentStep}</h2>
          
          <Progress value={progress} className="h-2 w-full" />
          
          <p className="text-center text-gray-600">
            {progress.toFixed(0)}% complete
          </p>
          
          <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-100">
            <h3 className="font-medium mb-4">What's Happening?</h3>
            <ul className="space-y-4">
              <li className={`flex items-center gap-2 p-3 rounded-md transition-colors ${phases.decoded ? 'bg-green-50 text-green-700' : ''}`}>
                {phases.decoded ? 
                  <CircleCheck className="h-5 w-5 text-green-500" /> : 
                  <div className={`w-5 h-5 rounded-full border ${currentStep === "Understanding Ad..." ? 'border-blue-500 animate-pulse' : 'border-gray-300'}`} />
                }
                <span className={`font-medium ${phases.decoded ? 'text-green-700' : ''}`}>Advertisement Decoded</span>
              </li>
              
              <li className={`flex items-center gap-2 p-3 rounded-md transition-colors ${phases.mapped ? 'bg-green-50 text-green-700' : ''}`}>
                {phases.mapped ? 
                  <CircleCheck className="h-5 w-5 text-green-500" /> : 
                  <div className={`w-5 h-5 rounded-full border ${currentStep === "Mapping Demographics..." ? 'border-blue-500 animate-pulse' : 'border-gray-300'}`} />
                }
                <span className={`font-medium ${phases.mapped ? 'text-green-700' : ''}`}>Advertisement Demographic Mapping</span>
              </li>
              
              <li className={`flex items-center gap-2 p-3 rounded-md transition-colors ${phases.generated ? 'bg-green-50 text-green-700' : ''}`}>
                {phases.generated ? 
                  <CircleCheck className="h-5 w-5 text-green-500" /> : 
                  <div className={`w-5 h-5 rounded-full border ${currentStep === "Morphing Ad..." ? 'border-blue-500 animate-pulse' : 'border-gray-300'}`} />
                }
                <span className={`font-medium ${phases.generated ? 'text-green-700' : ''}`}>Advertisement Generated</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default LoadingPage;
