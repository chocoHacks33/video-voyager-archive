
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
  await new Promise(resolve => setTimeout(resolve, 2500)); // Increased processing time
  
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
        // Extended loading time to 8 seconds total
        // Phase 1: Decode Product (about 2.5 seconds)
        setProgress(10);
        
        // Process phase 1
        await runPhaseWithProgressUpdate(0, 33, async () => {
          const extractedText = await extractTextFromImage(imageFile);
          setPhases(prev => ({ ...prev, decoded: true }));
          return extractedText;
        });
        
        // Phase 2: Map Platform Settings (about 2.5 seconds)
        const extractedText = await extractTextFromImage(imageFile);
        
        // Process phase 2
        await runPhaseWithProgressUpdate(33, 66, async () => {
          const imageAnalysis = await QwenAIService.getVideoDescription([imageFile]);
          setPhases(prev => ({ ...prev, mapped: true }));
          return { imageFile, imageAnalysis };
        });
        
        // Phase 3: Generate Assets (about 3 seconds)
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
          
          // Longer delay to ensure full 8 seconds
          await new Promise(resolve => setTimeout(resolve, 3000));
          
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
        {/* Removed the outermost card as requested */}
        <div className="relative w-full h-40 bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 overflow-hidden rounded-t-xl">
          {/* Animated background elements */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/5 w-60 h-60 bg-white/10 rounded-full blur-3xl animate-pulse-slow"></div>
            <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>
            <div className="absolute top-1/3 right-1/3 w-32 h-32 bg-purple-300/20 rounded-full blur-2xl animate-float" style={{ animationDelay: '0.7s' }}></div>
            
            {/* Enhanced particle effects */}
            <div className="absolute top-10 left-20 w-2 h-2 bg-purple-200 rounded-full animate-float"></div>
            <div className="absolute top-20 right-40 w-3 h-3 bg-blue-200 rounded-full animate-float" style={{ animationDelay: '1.2s' }}></div>
            <div className="absolute bottom-10 left-1/3 w-4 h-4 bg-indigo-200 rounded-full animate-float" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-violet-200 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
            
            {/* Additional floating elements */}
            <div className="absolute top-5 right-10 w-6 h-6 bg-gradient-to-br from-pink-300 to-purple-400 rounded-full animate-float opacity-70" style={{ animationDelay: '1.7s' }}></div>
            <div className="absolute bottom-5 right-20 w-5 h-5 bg-gradient-to-br from-blue-300 to-cyan-400 rounded-full animate-float opacity-70" style={{ animationDelay: '2.2s' }}></div>
          </div>
          
          {/* Morphing text animation with enhanced styling */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
            <h2 className="text-4xl font-bold text-transparent bg-gradient-to-r from-white via-purple-100 to-blue-100 bg-clip-text tracking-wide drop-shadow-lg">
              Morphing Your Content
            </h2>
            <div className="flex gap-2 mt-2">
              {['A', 'I', ' ', 'P', 'O', 'W', 'E', 'R', 'E', 'D'].map((letter, index) => (
              letter === ' ' ? 
                <span key={index} className="w-2"></span> : 
                <span key={index} className="text-sm font-light text-white/80 tracking-wider animate-pulse" style={{ animationDelay: `${index * 0.1}s` }}>
                  {letter}
                </span>
              ))}
            </div>
          </div>
          
          {/* Foreground visual elements */}
          <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-white/10 to-transparent"></div>
          <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,64L60,69.3C120,75,240,85,360,80C480,75,600,53,720,48C840,43,960,53,1080,58.7C1200,64,1320,64,1440,69.3L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z" 
                  fill="url(#paint0_linear)" fillOpacity="0.2" />
            <defs>
              <linearGradient id="paint0_linear" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
                <stop stopColor="#8B5CF6" />
                <stop offset="1" stopColor="#3B82F6" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="p-8 backdrop-blur-sm bg-white/5 dark:bg-black/10 w-full rounded-b-xl border border-purple-100/20 dark:border-purple-900/20">
          <div className="mb-8 relative">
            {/* Enhanced progress bar with glow effect */}
            <div className="h-4 bg-gray-200/30 dark:bg-gray-700/30 rounded-full overflow-hidden backdrop-blur-sm shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 via-violet-500 to-indigo-600 transition-all duration-500 ease-out relative"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 overflow-hidden">
                  <div className="w-full h-full animate-pulse opacity-50">
                    <div className="h-full w-1/3 bg-white/30 transform -skew-x-12 animate-shimmer"></div>
                  </div>
                </div>
              </div>
              
              {/* Glow effect */}
              <div 
                className="absolute inset-0 rounded-full opacity-30 blur-md"
                style={{ 
                  width: `${progress}%`, 
                  background: 'linear-gradient(90deg, rgba(139,92,246,0.5) 0%, rgba(79,70,229,0.5) 100%)' 
                }}
              ></div>
            </div>
            <div className="mt-2 text-right text-sm font-medium text-indigo-600 dark:text-indigo-400">
              {progress}% Complete
            </div>
            
            {/* Decorative dots showing phases with enhanced styling */}
            <div className="absolute top-0 left-0 w-full flex justify-between px-2 transform -translate-y-1/2">
              {[0, 1, 2].map((phase, index) => {
                const isComplete = progress >= ((index + 1) * 33);
                return (
                  <div key={index} className={cn(
                    "w-4 h-4 rounded-full transition-all duration-300 flex items-center justify-center",
                    isComplete 
                      ? "bg-gradient-to-r from-purple-500 to-indigo-500 shadow-lg shadow-purple-500/50" 
                      : "bg-gray-300/50 dark:bg-gray-600/50"
                  )}>
                    {isComplete && (
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Three phase cards with enhanced modern design */}
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
                    "transition-all duration-500 overflow-hidden border-0 group relative",
                    isComplete
                      ? "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/30 shadow-lg shadow-green-100/50 dark:shadow-green-900/20" 
                      : isActive 
                        ? "bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/30 shadow-lg shadow-purple-100/50 dark:shadow-purple-900/20"
                        : "bg-white/80 dark:bg-gray-800/40 shadow-sm"
                  )}
                >
                  {/* Background pattern with enhanced styling */}
                  <div className={cn(
                    "absolute inset-0 opacity-10 pointer-events-none transition-opacity duration-300",
                    isComplete || isActive ? "opacity-20" : "opacity-5"
                  )}>
                    <div className="absolute inset-0 w-full h-full">
                      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                          <pattern id={`grid-${phase.id}`} width="20" height="20" patternUnits="userSpaceOnUse">
                            <circle cx="10" cy="10" r="1" fill={isComplete ? "#10B981" : isActive ? "#8B5CF6" : "#9CA3AF"} />
                          </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill={`url(#grid-${phase.id})`} />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Card content with enhanced styling */}
                  <div className="p-6 relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110",
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
                          ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400" 
                          : isActive
                            ? "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-400"
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
                    
                    {/* Animated progress bar for active phase with enhanced styling */}
                    {isActive && (
                      <div className="mt-3 h-1 w-full bg-gray-200 dark:bg-gray-700 overflow-hidden rounded-full">
                        <div className="h-full bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 dark:from-purple-500 dark:via-purple-400 dark:to-purple-300 animate-progress-indeterminate"></div>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Enhanced bottom section with animated particles */}
          <div className="flex justify-center mt-10 relative overflow-hidden py-6">
            {/* Animated particle background with enhanced styling */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(20)].map((_, i) => (
                <div 
                  key={i}
                  className="absolute rounded-full bg-gradient-to-r from-purple-300 to-indigo-300 dark:from-purple-500 dark:to-indigo-400 opacity-30 animate-float" 
                  style={{
                    width: `${Math.random() * 12 + 4}px`,
                    height: `${Math.random() * 12 + 4}px`,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 5}s`,
                    animationDuration: `${Math.random() * 10 + 10}s`
                  }}
                />
              ))}
            </div>
            
            {/* Main text with enhanced styling */}
            <div className="text-center z-10">
              <div className="text-gray-600 dark:text-gray-300 text-sm font-medium tracking-wide">
                <span className="mr-1.5">Transforming your content into</span>
                <span className="bg-gradient-to-r from-purple-500 to-indigo-500 dark:from-purple-400 dark:to-indigo-300 bg-clip-text text-transparent font-bold">platform-optimized</span>
                <span className="ml-1.5">assets</span>
              </div>
              
              {/* Animated dots with enhanced styling */}
              <div className="flex justify-center mt-1.5">
                {[0, 1, 2].map((dot) => (
                  <div 
                    key={dot}
                    className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 dark:from-purple-400 dark:to-indigo-300 mx-0.5 animate-bounce"
                    style={{ animationDelay: `${dot * 0.2}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default LoadingPage;
