import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import AppLayout from '@/components/AppLayout';
import { Upload, CircleCheck, CircleX, CheckCircle2, Zap, Layers } from 'lucide-react';
import { toast } from 'sonner';
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Progress } from "@/components/ui/progress";
import Image from "@/components/ui/image";
import { Card, CardContent } from "@/components/ui/card";

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
          
          // Ensure all items are marked as completed before audiences are loaded
          setAudienceItems(prev => prev.map(item => ({ ...item, completed: true })));
          
          // Delay setting audiences loaded to show completion
          setTimeout(() => {
            setAudiencesLoaded(true);
            setLoading(false);
          }, 1000);
        }
      }, 7000); // ~42 seconds total divided by 6 items

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
    <AppLayout title="Upload Your Advertisement">
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
                      <div 
                        className={`h-16 w-16 rounded-lg flex items-center justify-center relative hover:bg-blue-50 transition-colors duration-200 cursor-pointer overflow-hidden ${
                          field.value ? 'ring-2 ring-green-500' : 'border border-gray-200'
                        }`}
                        onClick={() => field.onChange(!field.value)}
                      >
                        <Image 
                          src="https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png"
                          alt="Facebook"
                          className="h-full w-full object-contain p-2"
                        />
                        <FormControl>
                          <input 
                            type="checkbox" 
                            className="sr-only"
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
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
                      <div 
                        className={`h-16 w-16 rounded-lg flex items-center justify-center relative hover:bg-purple-50 transition-colors duration-200 cursor-pointer overflow-hidden ${
                          field.value ? 'ring-2 ring-green-500' : 'border border-gray-200'
                        }`}
                        onClick={() => field.onChange(!field.value)}
                      >
                        <Image 
                          src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Instagram_logo_2016.svg/1024px-Instagram_logo_2016.svg.png"
                          alt="Instagram"
                          className="h-full w-full object-contain p-2"
                        />
                        <FormControl>
                          <input 
                            type="checkbox" 
                            className="sr-only"
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
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
                      <div 
                        className={`h-16 w-16 rounded-lg flex items-center justify-center relative hover:bg-red-50 transition-colors duration-200 cursor-pointer overflow-hidden ${
                          field.value ? 'ring-2 ring-green-500' : 'border border-gray-200'
                        }`}
                        onClick={() => field.onChange(!field.value)}
                      >
                        <Image 
                          src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/YouTube_social_white_square_%282017%29.svg/1024px-YouTube_social_white_square_%282017%29.svg.png"
                          alt="YouTube"
                          className="h-full w-full object-contain p-2"
                        />
                        <FormControl>
                          <input 
                            type="checkbox" 
                            className="sr-only"
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
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
            className="bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white font-medium px-10 py-2.5 rounded-md shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center gap-2"
            onClick={startAudienceLoading}
          >
            <Layers className="h-5 w-5" />
            Fetch Audiences
          </Button>
        )}

        {/* Loading progress */}
        {loading && (
          <div className="w-full max-w-md mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Fetching Interests & Demographics...</span>
              <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2 mb-6 bg-gray-200" />
          </div>
        )}

        {/* Modern Audience checklist */}
        {(loading || audiencesLoaded) && (
          <div className="w-full max-w-lg mb-6">
            <Card className="border border-blue-100 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 shadow-sm overflow-hidden">
              <CardContent className="p-5">
                <div className="grid grid-cols-2 gap-3">
                  {audienceItems.map((item, index) => (
                    <div 
                      key={index} 
                      className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                        item.completed ? 'bg-white/60 shadow-sm' : 'bg-white/30'
                      }`}
                    >
                      <div 
                        className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                          item.completed 
                            ? 'bg-gradient-to-br from-green-400 to-emerald-500 shadow-md' 
                            : 'bg-gray-200'
                        }`}
                      >
                        {item.completed && <CheckCircle2 className="h-5 w-5 text-white" stroke="white" strokeWidth={2.5} />}
                      </div>
                      <span className={`text-sm font-medium transition-all duration-200 ${
                        item.completed ? 'text-gray-800' : 'text-gray-500'
                      }`}>
                        {item.name}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        {/* Morph AD button */}
        {audiencesLoaded && (
          <Button 
            className="bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white font-medium px-10 py-2.5 rounded-md shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center gap-2"
            onClick={handleMorphAd}
          >
            <Zap className="h-5 w-5" />
            Morph Your Ad!
          </Button>
        )}
      </div>
    </AppLayout>
  );
};

export default UploadPage;
