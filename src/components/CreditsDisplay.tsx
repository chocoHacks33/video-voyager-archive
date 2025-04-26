
import React from 'react';
import { useCredits } from '@/contexts/CreditsContext';
import { Coins } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CreditsDisplayProps {
  className?: string;
  variant?: 'default' | 'compact';
  showIcon?: boolean;
}

const CreditsDisplay: React.FC<CreditsDisplayProps> = ({ 
  className, 
  variant = 'default',
  showIcon = true 
}) => {
  const { credits } = useCredits();

  return (
    <div className={cn(
      "flex items-center gap-1.5 font-medium",
      variant === 'default' ? "text-base" : "text-sm",
      className
    )}>
      {showIcon && <Coins className={cn("text-yellow-500", variant === 'default' ? "h-5 w-5" : "h-4 w-4")} />}
      <span className={cn(
        "transition-all duration-300",
        credits < 200 ? "text-red-500" : credits < 500 ? "text-amber-500" : "text-green-600"
      )}>
        {credits.toLocaleString()}
      </span>
    </div>
  );
};

export default CreditsDisplay;
