
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import AppLayout from '@/components/AppLayout';
import { Upload, CircleCheck, CircleX, Facebook, Instagram, Youtube, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Progress } from "@/components/ui/progress";

// Audience data model
interface AudienceItem {
  name: string;
  completed: boolean;
}

const UploadPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [audienceItems, setAudienceItems] = useState<AudienceItem[]>([
    { name: "Age Groups", completed: false },
    { name: "Career", completed: false },
    { name: "Interests", completed: false },
    { name: "Life Events", completed: false },
    { name: "Income", completed: false },
    { name: "Location", completed: false },
  ]);
  const [audiencesLoaded, setAudiencesLoaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Platform selection form
  const form = useForm({
    defaultValues: {
      platforms: {
        facebook: false,
        instagram: false,
        youtube: false,
      }
    }
  });

  // Track when platforms are selected
  const platformsSelected = Object.values(form.watch().platforms).some(value => value);

  // Effect to handle audience items loading
  useEffect(() => {
    if (loading) {
      // Start progress bar
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 98) {
            clearInterval(interval);
            return 100;
          }
          return prev + 2;
        });
      }, 900);

      // Complete audience items sequentially
      let index = 0;
      const itemInterval = setInterval(() => {
        if (index < audienceItems.length) {
          setAudienceItems(prev => 
            prev.map((item, i) => 
              i === index ? { ...item, completed: true } : item
            )
          );
          index++;
        } else {
          clearInterval(itemInterval);
          
          // Delay setting audiences loaded to show completion
          setTimeout(() => {
            setAudiencesLoaded(true);
            setLoading(false);
          }, 1000);
        }
      }, 7500); // ~45 seconds total divided by 6 items

      return () => {
        clearInterval(interval);
        clearInterval(itemInterval);
      };
    }
  }, [loading]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type.startsWith('video/')) {
        setFile(selectedFile);
      } else {
        toast.custom((id) => (
          <div className="bg-red-500 text-white rounded-md p-4 flex items-center gap-2 shadow-md">
            <CircleX className="h-5 w-5 text-white" />
            <span className="font-medium">Please select a valid video file</span>
          </div>
        ), { duration: 3000 });
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type.startsWith('video/')) {
        setFile(droppedFile);
      } else {
        toast.custom((id) => (
          <div className="bg-red-500 text-white rounded-md p-4 flex items-center gap-2 shadow-md">
            <CircleX className="h-5 w-5 text-white" />
            <span className="font-medium">Please drop a valid video file</span>
          </div>
        ), { duration: 3000 });
      }
    }
  };

  const startAudienceLoading = () => {
    // Verify platform selection
    const selectedPlatforms = Object.entries(form.getValues().platforms)
      .filter(([_, isSelected]) => isSelected)
      .map(([platform]) => platform);

    if (selectedPlatforms.length === 0) {
      toast.custom((id) => (
        <div className="bg-red-500 text-white rounded-md p-4 flex items-center gap-2 shadow-md">
          <CircleX className="h-5 w-5 text-white" />
          <span className="font-medium">Please select at least one platform</span>
        </div>
      ), { duration: 3000 });
      return;
    }

    // Start loading process
    setLoading(true);
    setProgress(0);
    setAudienceItems(prev => prev.map(item => ({ ...item, completed: false })));
    setAudiencesLoaded(false);
  };

  const handleMorphAd = () => {
    if (!file) {
      toast.custom((id) => (
        <div className="bg-red-500 text-white rounded-md p-4 flex items-center gap-2 shadow-md">
          <CircleX className="h-5 w-5 text-white" />
          <span className="font-medium">Please select a video file first</span>
        </div>
      ), { duration: 3000 });
      return;
    }

    // Get the selected platforms
    const selectedPlatforms = Object.entries(form.getValues().platforms)
      .filter(([_, isSelected]) => isSelected)
      .map(([platform]) => platform);

    // Check if at least one platform is selected
    if (selectedPlatforms.length === 0) {
      toast.custom((id) => (
        <div className="bg-red-500 text-white rounded-md p-4 flex items-center gap-2 shadow-md">
          <CircleX className="h-5 w-5 text-white" />
          <span className="font-medium">Please select at least one platform</span>
        </div>
      ), { duration: 3000 });
      return;
    }

    toast.custom((id) => (
      <div className="bg-green-500 text-white rounded-md p-4 flex items-center gap-2 shadow-md">
        <CircleCheck className="h-5 w-5 text-white" />
        <span className="font-medium">Morphing started</span>
      </div>
    ), { duration: 3000 });
    
    // Navigate to loading page with the file and selected platforms as state
    navigate('/loading', { 
      state: { 
        videoFile: file,
        platforms: selectedPlatforms
      } 
    });
  };
  
  return (
    <AppLayout title="UPLOAD ADVERTISEMENT">
      <div className="flex flex-col items-center">
        <div 
          className={`w-full max-w-md border-2 border-dashed rounded-lg p-12 mb-6 flex flex-col items-center justify-center cursor-pointer ${
            isDragging ? 'border-blue-app bg-blue-50' : 'border-gray-300'
          }`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input 
            type="file" 
            accept="video/*" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleFileChange} 
          />
          
          <Upload className="w-16 h-16 text-gray-400 mb-4" />
          
          <p className="text-center text-gray-700 font-medium">
            {file ? file.name : "Select a video file"}
          </p>
          {!file && (
            <p className="text-sm text-gray-500 mt-2">
              Drag and drop or click to browse
            </p>
          )}
          
          {file && (
            <p className="text-sm text-gray-500 mt-2">
              Your video will be processed and subsequently morphed into demographic specific variations
            </p>
          )}
        </div>
        
        <Form {...form}>
          <div className="w-full max-w-md mb-6">
            <h3 className="text-center mb-4 font-medium text-gray-700">Select Platform</h3>
            <div className="flex justify-center gap-8">
              <FormField
                control={form.control}
                name="platforms.facebook"
                render={({ field }) => (
                  <FormItem className="relative">
                    <div className="flex flex-col items-center">
                      <div className="h-16 w-16 bg-blue-100 rounded-lg flex items-center justify-center relative">
                        <Facebook className="h-10 w-10 text-blue-600" />
                        <FormControl>
                          <Checkbox 
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="absolute top-1 right-1 h-5 w-5 data-[state=checked]:bg-green-500 data-[state=checked]:text-white"
                          />
                        </FormControl>
                      </div>
                      <FormLabel className="mt-2 text-sm font-normal">Facebook</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="platforms.instagram"
                render={({ field }) => (
                  <FormItem className="relative">
                    <div className="flex flex-col items-center">
                      <div className="h-16 w-16 bg-purple-100 rounded-lg flex items-center justify-center relative">
                        <Instagram className="h-10 w-10 text-purple-600" />
                        <FormControl>
                          <Checkbox 
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="absolute top-1 right-1 h-5 w-5 data-[state=checked]:bg-green-500 data-[state=checked]:text-white"
                          />
                        </FormControl>
                      </div>
                      <FormLabel className="mt-2 text-sm font-normal">Instagram</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="platforms.youtube"
                render={({ field }) => (
                  <FormItem className="relative">
                    <div className="flex flex-col items-center">
                      <div className="h-16 w-16 bg-red-100 rounded-lg flex items-center justify-center relative">
                        <Youtube className="h-10 w-10 text-red-600" />
                        <FormControl>
                          <Checkbox 
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="absolute top-1 right-1 h-5 w-5 data-[state=checked]:bg-green-500 data-[state=checked]:text-white"
                          />
                        </FormControl>
                      </div>
                      <FormLabel className="mt-2 text-sm font-normal">YouTube</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </Form>
        
        {/* Audience loading section */}
        {file && platformsSelected && !loading && !audiencesLoaded && (
          <Button 
            className="bg-blue-app hover:bg-blue-500 px-12 mb-6"
            onClick={startAudienceLoading}
          >
            Fetch Audiences
          </Button>
        )}

        {/* Loading progress */}
        {loading && (
          <div className="w-full max-w-md mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Fetching Audiences...</span>
              <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2 mb-6" />
          </div>
        )}

        {/* Audience checklist */}
        {(loading || audiencesLoaded) && (
          <div className="w-full max-w-md mb-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Audience Segmentation</h4>
            <ul className="space-y-2">
              {audienceItems.map((item, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className={`flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center ${item.completed ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>
                    {item.completed && <CheckCircle2 className="h-5 w-5" />}
                  </div>
                  <span className={`text-sm ${item.completed ? 'text-gray-700' : 'text-gray-500'}`}>
                    {item.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Morph AD button appears after audiences are loaded */}
        {audiencesLoaded && (
          <Button 
            className="bg-blue-app hover:bg-blue-500 px-12"
            onClick={handleMorphAd}
          >
            Morph AD
          </Button>
        )}
      </div>
    </AppLayout>
  );
};

export default UploadPage;
