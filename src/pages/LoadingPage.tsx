
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { Progress } from "@/components/ui/progress";
import { toast } from 'sonner';

// Mock function to simulate saving a video file to storage
const saveVideoToStorage = async (id: number, text: string): Promise<string> => {
  // In a real implementation, this would use the extracted text to generate
  // a video with Qwen AI and save it to the specified path
  return `/stock-videos/video${id}.mp4`;
};

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
        
        // Mock text extracted from video
        const extractedText = "This is simulated text extracted from the uploaded video. In a real implementation, we would use speech-to-text or OCR services to extract actual content from the video. Qwen AI would then use this content to generate creative videos in different styles.";
        
        // Step 2: Generate AI prompts from text
        setCurrentStep("Generating AI prompts...");
        await simulateProcess(30);
        
        // Mock generated prompts
        const generatedPrompts = [
          "Cinematic version with enhanced lighting",
          "Black and white artistic rendition",
          "Slow motion with dramatic effects",
          "Fast-paced with upbeat transitions",
          "Cinematic widescreen format",
          "Vintage filter with grain effect",
          "Neon color grading with vibrant highlights",
          "Retro VHS style with scan lines",
          "Sepia-toned nostalgic footage",
          "High contrast urban landscape",
          "Dreamlike soft focus effect",
          "Vibrant color pop animation",
          "Minimalist monochrome design",
          "Dynamic motion graphics",
          "Ethereal light leak overlay",
          "Cinematic lens flare effect"
        ];
        
        // Step 3: Creating AI videos
        setCurrentStep("Creating AI videos with Qwen...");
        await simulateProcess(30);
        
        // Step 4: Saving videos to storage
        setCurrentStep("Saving videos to storage...");
        
        // In a real implementation, we would create multiple videos based on the prompts
        const videoSavePromises = generatedPrompts.map((prompt, index) => 
          saveVideoToStorage(index + 1, extractedText + " " + prompt)
        );
        
        // Wait for all videos to be saved
        await Promise.all(videoSavePromises);
        await simulateProcess(20);
        
        // Success! Navigate to gallery
        toast.success("Video processing complete! Videos saved to storage.");
        navigate('/gallery');
      } catch (error) {
        console.error("Video processing error:", error);
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
              <li className={progress >= 50 ? "text-green-600 font-medium" : ""}>
                Generating creative prompts from your content
              </li>
              <li className={progress >= 80 ? "text-green-600 font-medium" : ""}>
                Creating various AI video styles with Qwen
              </li>
              <li className={progress >= 100 ? "text-green-600 font-medium" : ""}>
                Saving generated videos to storage
              </li>
            </ol>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default LoadingPage;
