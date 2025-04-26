
import { Activity, TrendingUp, Zap, Eye, Tag, Flame } from 'lucide-react';
import { MetricTag } from '@/components/gallery/types';

export const metricTags: MetricTag[] = [
  { id: 'engagement', label: 'Engagement', icon: Activity },
  { id: 'outreach', label: 'Outreach', icon: TrendingUp },
  { id: 'ctr', label: 'CTR', icon: Zap },
  { id: 'views', label: 'Views', icon: Eye },
  { id: 'convertibility', label: 'Convertibility', icon: Tag },
  { id: 'wild', label: 'Wild', icon: Flame }
];

