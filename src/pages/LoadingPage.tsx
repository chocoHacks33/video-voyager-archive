
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { Progress } from "@/components/ui/progress";
import { toast } from 'sonner';

const LoadingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("Extracting text from video...");
  const videoFile = location.state?.videoFile;
  
  useEffect(() => {
    if (!videoFile) {
      toast.error("No video file provided");
      navigate('/upload');
      return;
    }

    // Simulate video processing steps
    const processVideo = async () => {
      try {
        // Step 1: Extract text from video (simulation)
        setCurrentStep("Extracting text from video...");
        await simulateProcess(20);
        
        // Step 2: Generate AI prompts from text
        setCurrentStep("Generating AI prompts...");
        await simulateProcess(40);
        
        // Step 3: Creating AI videos
        setCurrentStep("Creating AI videos with Qwen...");
        await simulateProcess(40);
        
        // Success! Navigate to gallery
        toast.success("Video processing complete");
        navigate('/gallery');
      } catch (error) {
        toast.error("Error processing video");
        navigate('/upload');
      }
    };

    processVideo();
  }, [navigate, videoFile, location.state]);
  
  // Simulate a processing step with progress updates
  const simulateProcess = (percentage: number) => {
    return new Promise<void>((resolve) => {
      const startValue = progress;
      const endValue = startValue + percentage;
      const duration = percentage * 100; // Adjust speed based on percentage
      const startTime = Date.now();
      
      const updateProgress = () => {
        const elapsed = Date.now() - startTime;
        const progressDelta = Math.min(elapsed / duration, 1) * percentage;
        const newProgress = startValue + progressDelta;
        
        setProgress(Math.min(newProgress, 100));
        
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
                Converting your video to text transcripts
              </li>
              <li className={progress >= 60 ? "text-green-600 font-medium" : ""}>
                Generating creative prompts from your content
              </li>
              <li className={progress >= 100 ? "text-green-600 font-medium" : ""}>
                Creating various AI video styles with Qwen
              </li>
            </ol>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default LoadingPage;
