
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { Loader } from 'lucide-react';

const LoadingPage = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Simulate processing time
    const timer = setTimeout(() => {
      navigate('/gallery');
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [navigate]);
  
  return (
    <AppLayout title="LOADING">
      <div className="flex flex-col items-center justify-center h-60">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
          <div className="w-16 h-16 border-4 border-blue-app rounded-full absolute top-0 left-0 animate-loader-spin border-t-transparent"></div>
        </div>
        <p className="mt-8 text-gray-600 text-lg">Processing...</p>
      </div>
    </AppLayout>
  );
};

export default LoadingPage;
