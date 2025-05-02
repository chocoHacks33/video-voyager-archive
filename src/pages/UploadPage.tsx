
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import AppLayout from '@/components/AppLayout';
import { Upload, CircleX, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import Image from "@/components/ui/image";

const UploadPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Platform selection form
  const form = useForm({
    defaultValues: {
      platforms: {
        facebook: false,
        instagram: false,
        twitter: false,
      }
    }
  });

  // Track when platforms are selected
  const platformsSelected = Object.values(form.watch().platforms).some(value => value);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type.startsWith('image/')) {
        setFile(selectedFile);
      } else {
        toast.custom((id) => (
          <div className="bg-red-500 text-white rounded-md p-4 flex items-center gap-2 shadow-md">
            <CircleX className="h-5 w-5 text-white" />
            <span className="font-medium">Please select a valid image file</span>
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
      if (droppedFile.type.startsWith('image/')) {
        setFile(droppedFile);
      } else {
        toast.custom((id) => (
          <div className="bg-red-500 text-white rounded-md p-4 flex items-center gap-2 shadow-md">
            <CircleX className="h-5 w-5 text-white" />
            <span className="font-medium">Please drop a valid image file</span>
          </div>
        ), { duration: 3000 });
      }
    }
  };

  const handleMorphAd = () => {
    if (!file) {
      toast.custom((id) => (
        <div className="bg-red-500 text-white rounded-md p-4 flex items-center gap-2 shadow-md">
          <CircleX className="h-5 w-5 text-white" />
          <span className="font-medium">Please select an image file first</span>
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

    // Navigate to loading page with the file and selected platforms as state
    navigate('/loading', { 
      state: { 
        imageFile: file,
        platforms: selectedPlatforms
      } 
    });
  };
  
  return (
    <AppLayout title="Upload Your Product Image">
      <div className="flex flex-col items-center w-full">
        <div 
          className={`w-full max-w-md border-2 border-dashed rounded-lg p-12 mb-6 flex flex-col items-center justify-center cursor-pointer relative overflow-hidden backdrop-blur-sm transition-all duration-300 transform hover:scale-[1.01] ${
            isDragging 
              ? 'border-purple-500 bg-purple-900/20 dark:bg-purple-800/30' 
              : 'border-gray-300 dark:border-gray-700 bg-white/5 dark:bg-gray-800/20'
          }`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {/* Decorative background elements */}
          <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full blur-3xl animate-pulse-slow"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
          </div>

          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleFileChange} 
          />
          
          {/* Animated Upload Icon */}
          <div className="relative z-10 mb-4 bg-gradient-to-br from-purple-500 to-indigo-500 p-4 rounded-full shadow-lg animate-float">
            <Upload className="w-12 h-12 text-white" />
          </div>
          
          <div className="relative z-10 text-center">
            <p className="font-medium text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text">
              {file ? file.name : "Select a product asset"}
            </p>
            {!file && (
              <p className="text-sm mt-2 text-gray-400 dark:text-gray-300">
                Drag and drop or click to browse
              </p>
            )}
            
            {file && (
              <p className="text-sm mt-2 text-gray-500 dark:text-gray-400">
                Your product image will be processed and subsequently morphed into demographic-specific variations
              </p>
            )}
          </div>
        </div>
          
        <Form {...form}>
          <div className="w-full max-w-md mb-6 relative">
            {/* Decorative gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 to-indigo-900/10 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl -z-10 blur-xl"></div>
            
            <h3 className="text-center mb-4 font-medium dark:text-gray-200 bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">Select Platform</h3>
            <div className="flex justify-center gap-8">
              <FormField
                control={form.control}
                name="platforms.facebook"
                render={({ field }) => (
                  <FormItem className="relative">
                    <div className="flex flex-col items-center">
                      <div 
                        className={`h-16 w-16 rounded-xl flex items-center justify-center relative hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all duration-300 cursor-pointer overflow-hidden shadow-lg ${
                          field.value 
                            ? 'ring-2 ring-green-500 dark:ring-green-400 shadow-green-500/20 dark:shadow-green-400/20' 
                            : 'border border-gray-200 dark:border-gray-700'
                        }`}
                        onClick={() => field.onChange(!field.value)}
                      >
                        <Image 
                          src="https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png"
                          alt="Facebook"
                          className="h-full w-full object-contain p-2"
                        />
                        {field.value && (
                          <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-green-500/10 dark:from-green-400/30 dark:to-green-400/10 animate-pulse-slow"></div>
                        )}
                        <FormControl>
                          <input 
                            type="checkbox" 
                            className="sr-only"
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                          />
                        </FormControl>
                      </div>
                      <FormLabel className="mt-2 text-sm font-normal dark:text-gray-300">Facebook</FormLabel>
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
                        className={`h-16 w-16 rounded-xl flex items-center justify-center relative hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-all duration-300 cursor-pointer overflow-hidden shadow-lg ${
                          field.value 
                            ? 'ring-2 ring-green-500 dark:ring-green-400 shadow-green-500/20 dark:shadow-green-400/20' 
                            : 'border border-gray-200 dark:border-gray-700'
                        }`}
                        onClick={() => field.onChange(!field.value)}
                      >
                        <Image 
                          src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Instagram_logo_2016.svg/1024px-Instagram_logo_2016.svg.png"
                          alt="Instagram"
                          className="h-full w-full object-contain p-2"
                        />
                        {field.value && (
                          <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-green-500/10 dark:from-green-400/30 dark:to-green-400/10 animate-pulse-slow"></div>
                        )}
                        <FormControl>
                          <input 
                            type="checkbox" 
                            className="sr-only"
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                          />
                        </FormControl>
                      </div>
                      <FormLabel className="mt-2 text-sm font-normal dark:text-gray-300">Instagram</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="platforms.twitter"
                render={({ field }) => (
                  <FormItem className="relative">
                    <div className="flex flex-col items-center">
                      <div 
                        className={`h-16 w-16 rounded-xl flex items-center justify-center relative hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all duration-300 cursor-pointer overflow-hidden shadow-lg ${
                          field.value 
                            ? 'ring-2 ring-green-500 dark:ring-green-400 shadow-green-500/20 dark:shadow-green-400/20' 
                            : 'border border-gray-200 dark:border-gray-700'
                        }`}
                        onClick={() => field.onChange(!field.value)}
                      >
                        <Image 
                          src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Logo_of_Twitter.svg/1024px-Logo_of_Twitter.svg.png"
                          alt="Twitter"
                          className="h-full w-full object-contain p-2"
                        />
                        {field.value && (
                          <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-green-500/10 dark:from-green-400/30 dark:to-green-400/10 animate-pulse-slow"></div>
                        )}
                        <FormControl>
                          <input 
                            type="checkbox" 
                            className="sr-only"
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                          />
                        </FormControl>
                      </div>
                      <FormLabel className="mt-2 text-sm font-normal dark:text-gray-300">Twitter</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </Form>
          
        {/* Morph button */}
        {file && platformsSelected && (
          <Button 
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium px-10 py-6 rounded-xl shadow-lg hover:shadow-xl dark:shadow-purple-500/20 transition-all duration-300 transform hover:scale-105 flex items-center gap-3"
            onClick={handleMorphAd}
          >
            <div className="relative">
              <Zap className="h-6 w-6 relative z-10" />
              <div className="absolute top-0 left-0 w-full h-full bg-white/20 blur-md rounded-full animate-pulse-slow"></div>
            </div>
            <span className="text-lg">Morph!</span>
          </Button>
        )}
      </div>
    </AppLayout>
  );
};

export default UploadPage;
