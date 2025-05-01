
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { toast } from '@/components/ui/custom-toast';
import { QwenAIService } from '@/services/qwenAIService';
import { CircleX, Check, Loader } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

// Function to extract text from image (mock implementation)
const extractTextFromImage = async (imageFile: File): Promise<string> => {
  // In a real implementation, this would use OCR services
  console.log('Extracting text from image:', imageFile.name);
  await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate processing time
  
  return "This is simulated text extracted from the uploaded image. In a real implementation, we would use OCR services to extract actual content from the image.";
};

// Function to save image to storage (simplified implementation)
const saveImageToStorage = async (imageUrl: string, generatedPrompt: string, imageDescription?: string): Promise<string> => {
  console.log('Saving image to storage:', imageUrl, 'with prompt:', generatedPrompt);
  
  // In a real implementation, this would download the image and save it locally or to cloud storage
  // Also save the image description to localStorage for the gallery page
  if (imageDescription) {
    localStorage.setItem('imageDescription', imageDescription);
  }
  
  return imageUrl; // Return the path/URL where the image is stored
};

const LoadingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [progress, setProgress] = useState(0);
  const [imageGenerationId, setImageGenerationId] = useState<string | null>(null);
  const [processingComplete, setProcessingComplete] = useState(false);
  const imageFile = location.state?.imageFile;
  
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
    if (!imageFile) {
      toast.error("No image file provided", {
        description: "Please upload an image first."
      });
      navigate('/upload');
      return;
    }

    const processImage = async () => {
      try {
        // Phase 1: Decode Product
        setProgress(10);
        
        // Process phase 1
        await runPhaseWithProgressUpdate(0, 33, async () => {
          const extractedText = await extractTextFromImage(imageFile);
          setPhases(prev => ({ ...prev, decoded: true }));
          return extractedText;
        });
        
        // Phase 2: Map Platform Settings
        const extractedText = await extractTextFromImage(imageFile);
        
        // Process phase 2
        await runPhaseWithProgressUpdate(33, 66, async () => {
          const imageAnalysis = await QwenAIService.getVideoDescription([imageFile]);
          setPhases(prev => ({ ...prev, mapped: true }));
          return { imageFile, imageAnalysis };
        });
        
        // Phase 3: Generate Assets
        const imageAnalysis = await QwenAIService.getVideoDescription([imageFile]);
        
        // Process phase 3
        await runPhaseWithProgressUpdate(66, 100, async () => {
          const generatedPrompt = "Product image with enhanced lighting and platform-specific formatting";
          
          // Call Qwen AI service to generate images (mock)
          const imageResponse = {
            id: "img-" + Date.now(),
            status: 'complete',
            imageUrl: URL.createObjectURL(imageFile)
          };
          
          setImageGenerationId(imageResponse.id);
          
          // Save image to storage (mock implementation for demo)
          await saveImageToStorage(
            imageResponse.imageUrl, 
            generatedPrompt,
            imageAnalysis.description
          );
          
          // Create additional dummy images and save locally - FOR DEMO ONLY
          // In a real implementation, the AI would generate different variations
          for (let i = 1; i <= 8; i++) {
            const dummyImageUrl = URL.createObjectURL(imageFile);
            await saveImageToStorage(
              dummyImageUrl,
              `${generatedPrompt} - variation ${i}`,
              imageAnalysis.description
            );
            
            // Store URLs in localStorage to access in gallery
            const existingUrls = JSON.parse(localStorage.getItem('generatedImageUrls') || '[]');
            existingUrls.push(dummyImageUrl);
            localStorage.setItem('generatedImageUrls', JSON.stringify(existingUrls));
          }
          
          setPhases(prev => ({ ...prev, generated: true }));
        });
        
        // Success! Set processing complete flag
        setProcessingComplete(true);
      } catch (error) {
        console.error("Image processing error:", error);
        toast.error("Error processing image", {
          description: "There was a problem processing your image. Please try again."
        });
        navigate('/upload');
      }
    };

    processImage();
  }, [navigate, imageFile, location.state]);
  
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
  
  return (
    <AppLayout title="">
      <div className="flex flex-col items-center justify-center p-4 w-full mx-auto min-h-[60vh]">
        <Card className="w-full max-w-4xl shadow-lg rounded-xl overflow-hidden bg-gradient-to-b from-purple-50 to-indigo-50 dark:from-purple-950 dark:to-indigo-950 mx-auto">
          <div className="relative w-full h-32 bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 animate-gradient overflow-hidden">
            <div className="absolute inset-0">
              <div className="absolute top-10 left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse-slow"></div>
              <div className="absolute top-20 right-20 w-60 h-60 bg-white/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
              <div className="absolute bottom-10 left-1/2 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <h2 className="text-3xl font-bold text-white tracking-wide drop-shadow-md">Morphing Your Content</h2>
            </div>
          </div>

          <div className="p-8">
            <div className="mb-8">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="mt-2 text-right text-sm font-medium text-indigo-600 dark:text-indigo-400">
                {progress}% Complete
              </div>
            </div>
            
            {/* Three phase cards with modern design */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { id: 'decoded', label: 'Product Analysis', description: 'Decoding visual elements and content structure' },
                { id: 'mapped', label: 'Platform Mapping', description: 'Adapting to platform requirements and audience preferences' },
                { id: 'generated', label: 'Asset Generation', description: 'Creating optimized marketing materials' }
              ].map((phase, index) => {
                const isComplete = phases[phase.id as keyof typeof phases];
                const isActive = progress >= (index * 33) && !isComplete;
                
                return (
                  <Card
                    key={phase.id}
                    className={cn(
                      "transition-all duration-500 overflow-hidden border-0",
                      isComplete
                        ? "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 shadow-md shadow-green-100 dark:shadow-green-900/10" 
                        : isActive 
                          ? "bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 shadow-md shadow-purple-100 dark:shadow-purple-900/10"
                          : "bg-white/80 dark:bg-gray-800/40 shadow-sm"
                    )}
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center",
                          isComplete 
                            ? "bg-green-100 dark:bg-green-800/30" 
                            : isActive
                              ? "bg-purple-100 dark:bg-purple-800/30"
                              : "bg-gray-100 dark:bg-gray-700/30"
                        )}>
                          {isComplete ? (
                            <Check className={cn("h-5 w-5 text-green-600 dark:text-green-400", "animate-appear")} />
                          ) : isActive ? (
                            <Loader className={cn("h-5 w-5 text-purple-600 dark:text-purple-400", "animate-spin")} />
                          ) : (
                            <span className="text-lg font-bold text-gray-400 dark:text-gray-500">{index + 1}</span>
                          )}
                        </div>
                        <div className={cn(
                          "text-xs font-medium px-2 py-1 rounded-full",
                          isComplete 
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
                            : isActive
                              ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                              : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                        )}>
                          {isComplete ? "Complete" : isActive ? "Processing" : "Waiting"}
                        </div>
                      </div>
                      <h3 className={cn(
                        "text-lg font-semibold mb-1",
                        isComplete 
                          ? "text-green-700 dark:text-green-400" 
                          : isActive
                            ? "text-purple-700 dark:text-purple-400"
                            : "text-gray-600 dark:text-gray-300"
                      )}>
                        {phase.label}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {phase.description}
                      </p>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Animated elements at the bottom */}
            <div className="flex justify-center mt-10">
              <div className="relative">
                <div className="absolute -top-6 -left-6 w-4 h-4 rounded-full bg-purple-400 dark:bg-purple-600 animate-float" style={{ animationDelay: '0.5s' }}></div>
                <div className="absolute -top-4 -right-8 w-3 h-3 rounded-full bg-indigo-400 dark:bg-indigo-600 animate-float" style={{ animationDelay: '1.5s' }}></div>
                <div className="absolute -bottom-2 left-10 w-2 h-2 rounded-full bg-violet-400 dark:bg-violet-600 animate-float" style={{ animationDelay: '1s' }}></div>
                <div className="text-center text-gray-500 dark:text-gray-400 text-sm italic">
                  Transforming your content into platform-optimized assets...
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
};

export default LoadingPage;
