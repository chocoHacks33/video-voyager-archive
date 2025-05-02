
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { LucideIcon } from 'lucide-react';

interface MetricTagProps {
  id: string;
  label: string;
  icon: LucideIcon;
  isSelected: boolean;
  onToggle: (id: string) => void;
}

const MetricTag = ({ id, label, icon: Icon, isSelected, onToggle }: MetricTagProps) => {
  return (
    <Badge
      variant={isSelected ? "default" : "outline"}
      className={cn(
        "px-3 py-1.5 text-sm cursor-pointer transition-all duration-200",
        "hover:scale-105 active:scale-95",
        isSelected 
          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-500 dark:to-indigo-500 text-white dark:text-white hover:bg-purple-700 dark:hover:from-purple-600 dark:hover:to-indigo-600' 
          : 'hover:border-purple-400 dark:hover:border-purple-500'
      )}
      onClick={() => onToggle(id)}
    >
      <Icon className="h-3.5 w-3.5" />
      <span className="ml-1.5">{label}</span>
    </Badge>
  );
};

export default MetricTag;
