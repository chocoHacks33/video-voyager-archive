
import React from 'react';
import { cn } from '@/lib/utils';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  className?: string;
}

const Image: React.FC<ImageProps> = ({ className, ...props }) => {
  return (
    <img 
      className={cn('', className)} 
      {...props} 
      alt={props.alt || 'Image'}
    />
  );
};

export default Image;
