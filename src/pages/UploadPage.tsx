
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import AppLayout from '@/components/AppLayout';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';

const UploadPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type.startsWith('video/')) {
        setFile(selectedFile);
      } else {
        toast.error('Please select a valid video file');
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
        toast.error('Please drop a valid video file');
      }
    }
  };

  const handleUpload = () => {
    if (!file) {
      toast.error('Please select a video file first');
      return;
    }

    toast.success('Upload started', {
      style: { background: '#4CAF50', color: 'white' }  // Green background with white text
    });
    
    // Simulate uploading process
    setTimeout(() => {
      navigate('/loading');
    }, 1500);
  };
  
  return (
    <AppLayout title="UPLOAD VIDEO">
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
        </div>
        
        <Button 
          className="bg-blue-app hover:bg-blue-500 px-12"
          disabled={!file}
          onClick={handleUpload}
        >
          Upload
        </Button>
      </div>
    </AppLayout>
  );
};

export default UploadPage;
