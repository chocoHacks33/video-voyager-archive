
import React from 'react';
import { useCredits } from '@/contexts/CreditsContext';
import { Coins } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CreditsDisplayProps {
  className?: string;
  variant?: 'default' | 'compact';
  showIcon?: boolean;
  value?: number;
}

const CreditsDisplay: React.FC<CreditsDisplayProps> = ({ 
  className, 
  variant = 'default',
  showIcon = true,
  value
}) => {
  const { credits } = useCredits();
  const displayValue = value !== undefined ? value : credits;

  return (
    <div className={cn(
      "flex items-center gap-1.5 font-medium",
      variant === 'default' ? "text-base" : "text-sm",
      className
    )}>
      {showIcon && (
        <div className="relative">
          <Coins className={cn(
            "transition-all duration-300",
            variant === 'default' ? "h-5 w-5" : "h-4 w-4",
            "text-yellow-400 drop-shadow-md"
          )} />
          <div className={cn(
            "absolute inset-0 text-yellow-500 animate-pulse opacity-50", 
            variant === 'default' ? "h-5 w-5" : "h-4 w-4"
          )}>
            <Coins className={cn(
              variant === 'default' ? "h-5 w-5" : "h-4 w-4"
            )} />
          </div>
        </div>
      )}
      <span className={cn(
        "transition-all duration-300 font-bold",
        displayValue < 200 ? "text-red-500" : displayValue < 500 ? "text-amber-500" : "bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent",
        variant === 'default' ? "drop-shadow-sm" : ""
      )}>
        {displayValue.toLocaleString()}
      </span>
    </div>
  );
};

export default CreditsDisplay;
