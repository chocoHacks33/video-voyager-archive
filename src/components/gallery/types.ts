
import { LucideIcon } from 'lucide-react';

export interface ImageData {
  id: number;
  source: string;
  description: string;
  allocatedBudget?: number;
}

export interface MetricTag {
  id: string;
  label: string;
  icon: LucideIcon;
}

export interface AdMutation {
  id: number;
  source: string;
  metrics: {
    engagement: number;
    outreach: number;
    ctr: number;
    views: number;
    convertibility: number;
  };
}
