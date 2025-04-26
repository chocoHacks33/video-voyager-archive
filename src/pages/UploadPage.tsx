
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
            accept="image/*" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleFileChange} 
          />
          
          <Upload className="w-16 h-16 text-gray-400 mb-4" />
          
          <p className="text-center text-gray-700 font-medium">
            {file ? file.name : "Select a product asset"}
          </p>
          {!file && (
            <p className="text-sm text-gray-500 mt-2 text-center">
              Drag and drop or click to browse
            </p>
          )}
          
          {file && (
            <p className="text-sm text-gray-500 mt-2 text-center">
              Your product image will be processed and subsequently morphed into platform-specific variations
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
                name="platforms.twitter"
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
                          src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Logo_of_Twitter.svg/1024px-Logo_of_Twitter.svg.png"
                          alt="Twitter"
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
                      <FormLabel className="mt-2 text-sm font-normal">Twitter</FormLabel>
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
            className="bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white font-medium px-10 py-2.5 rounded-md shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center gap-2"
            onClick={handleMorphAd}
          >
            <Zap className="h-5 w-5" />
            Morph!
          </Button>
        )}
      </div>
    </AppLayout>
  );
};

export default UploadPage;
