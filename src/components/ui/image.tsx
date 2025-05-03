
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { AlertTriangle } from 'lucide-react';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  className?: string;
  fallbackUrl?: string;
}

const Image: React.FC<ImageProps> = ({ className, fallbackUrl, ...props }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | undefined>(props.src);
  
  useEffect(() => {
    setImageSrc(props.src);
    setHasError(false);
    setIsLoading(true);
  }, [props.src]);
  
  const handleLoad = () => {
    console.log(`Image loaded successfully: ${imageSrc}`);
    setIsLoading(false);
    setHasError(false);
  };
  
  const handleError = () => {
    console.error(`Image failed to load: ${imageSrc}`);
    setIsLoading(false);
    setHasError(true);
    
    // Try fallback if provided
    if (fallbackUrl && fallbackUrl !== imageSrc) {
      console.log(`Attempting fallback image: ${fallbackUrl}`);
      setImageSrc(fallbackUrl);
    }
  };
  
  return (
    <div className={cn('relative', className)}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200/50 dark:bg-gray-800/50 animate-pulse">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-t-purple-500 border-r-transparent border-b-purple-300 border-l-transparent"></div>
        </div>
      )}
      
      {hasError && !fallbackUrl && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
          <AlertTriangle className="h-8 w-8 mb-2 text-amber-500" />
          <p className="text-sm">{props.alt || 'Image not found'}</p>
        </div>
      )}
      
      <img 
        {...props}
        src={imageSrc}
        alt={props.alt || 'Image'}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          'object-contain transition-opacity duration-300',
          (isLoading || hasError) ? 'opacity-0' : 'opacity-100',
          className
        )}
      />
    </div>
  );
};

export default Image;
