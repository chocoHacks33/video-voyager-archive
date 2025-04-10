
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { toast } from 'sonner';
import { QwenAIService } from '@/services/qwenAIService';
import { CircleX, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

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
        setProgress(10);
        
        // Process phase 1
        await runPhaseWithProgressUpdate(0, 33, async () => {
          const extractedText = await extractTextFromVideo(videoFile);
          setPhases(prev => ({ ...prev, decoded: true }));
          return extractedText;
        });
        
        // Phase 2: Map Demographics
        const extractedText = await extractTextFromVideo(videoFile);
        
        // Process phase 2
        await runPhaseWithProgressUpdate(33, 66, async () => {
          const frames = await QwenAIService.extractFramesFromVideo(videoFile);
          const videoAnalysis = await QwenAIService.getVideoDescription(frames);
          setPhases(prev => ({ ...prev, mapped: true }));
          return { frames, videoAnalysis };
        });
        
        // Phase 3: Generate Advertisement
        const frames = await QwenAIService.extractFramesFromVideo(videoFile);
        const videoAnalysis = await QwenAIService.getVideoDescription(frames);
        
        // Process phase 3
        await runPhaseWithProgressUpdate(66, 100, async () => {
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
          await saveVideoToStorage(
            videoResult.videoUrl, 
            generatedPrompt,
            videoAnalysis.description
          );
          
          setPhases(prev => ({ ...prev, generated: true }));
        });
        
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
  
  // Helper function to run a phase and update progress
  const runPhaseWithProgressUpdate = async (startProgress: number, endProgress: number, phaseFunction: () => Promise<any>) => {
    setProgress(startProgress);
    
    // Small increment to show immediate progress
    setTimeout(() => setProgress(startProgress + 5), 100);
    
    // Run the actual phase function
    const result = await phaseFunction();
    
    // Complete the progress
    setProgress(endProgress);
    
    return result;
  };
  
  // Calculate stroke dasharray for circle animation
  const calculateStrokeDasharray = (percent: number) => {
    const circumference = 2 * Math.PI * 45; // Circle with r=45
    return `${(percent / 100) * circumference} ${circumference}`;
  };
  
  return (
    <AppLayout title="MORPHING ADVERTISEMENT">
      <div className="flex flex-col items-center justify-center p-8 max-w-4xl mx-auto min-h-[60vh]">
        <div className="w-full space-y-16">
          {/* Main circular progress indicator */}
          <div className="flex justify-center mb-8">
            <div className="relative w-56 h-56">
              {/* Background circle */}
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle 
                  cx="50" 
                  cy="50" 
                  r="45" 
                  fill="none" 
                  strokeWidth="6" 
                  className="stroke-gray-200 dark:stroke-gray-700"
                />
                {/* Progress circle with gradient */}
                <circle 
                  cx="50" 
                  cy="50" 
                  r="45" 
                  fill="none" 
                  strokeWidth="6" 
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
              
              {/* Progress percentage in center */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl font-bold text-gray-800 dark:text-gray-200">
                  {Math.round(progress)}%
                </span>
              </div>
            </div>
          </div>
          
          {/* Phase cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mx-auto">
            {/* Phase cards */}
            {[
              { id: 'decoded', label: 'Advertisement Decoded' },
              { id: 'mapped', label: 'Demographics Mapped' },
              { id: 'generated', label: 'Advertisement Generated' }
            ].map((phase, index) => (
              <Card
                key={phase.id}
                className={cn(
                  "transition-all duration-500 shadow-md overflow-hidden",
                  phases[phase.id as keyof typeof phases]
                    ? "bg-gradient-to-b from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800" 
                    : "bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
                )}
              >
                <div className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center",
                      phases[phase.id as keyof typeof phases] 
                        ? "bg-green-100 dark:bg-green-800/30" 
                        : "bg-gray-100 dark:bg-gray-700"
                    )}>
                      {phases[phase.id as keyof typeof phases] ? (
                        <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                      ) : (
                        <span className="text-lg font-bold text-gray-500 dark:text-gray-400">{index + 1}</span>
                      )}
                    </div>
                    <div className={cn(
                      "font-medium",
                      phases[phase.id as keyof typeof phases] 
                        ? "text-green-700 dark:text-green-400" 
                        : "text-gray-700 dark:text-gray-300"
                    )}>
                      {phase.label}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default LoadingPage;
