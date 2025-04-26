
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Coins, Rocket, Activity } from 'lucide-react';
import MetricTag from './MetricTag';
import { MetricTag as MetricTagType } from './types';

interface CampaignSettingsProps {
  metricTags: MetricTagType[];
  selectedMetrics: string[];
  onMetricToggle: (metricId: string) => void;
  budget: string;
  onBudgetChange: (value: string) => void;
  onLaunch: () => void;
  selectedImagesCount: number;
}

const CampaignSettings = ({
  metricTags,
  selectedMetrics,
  onMetricToggle,
  budget,
  onBudgetChange,
  onLaunch,
  selectedImagesCount
}: CampaignSettingsProps) => {
  return (
    <div className="mt-10 space-y-8">
      <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <Label className="text-lg font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Activity className="w-5 h-5 text-purple-500" />
              Campaign Metrics
            </Label>
            <div className="flex flex-wrap gap-2.5">
              {metricTags.map(metric => (
                <MetricTag
                  key={metric.id}
                  {...metric}
                  isSelected={selectedMetrics.includes(metric.id)}
                  onToggle={onMetricToggle}
                />
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-lg font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2" htmlFor="budget">
              <Coins className="w-5 h-5 text-purple-500" />
              Campaign Budget
            </Label>
            <div className="flex items-center gap-3 max-w-xs">
              <div className="relative flex-1">
                <Input
                  id="budget"
                  type="number"
                  placeholder="Enter budget amount"
                  value={budget}
                  onChange={(e) => onBudgetChange(e.target.value)}
                  className="pl-9"
                />
                <Coins className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              </div>
              <span className="text-sm font-medium text-gray-500">credits</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <Button 
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 
                   text-white font-medium px-10 py-6 rounded-lg shadow-xl hover:shadow-2xl 
                   transform hover:scale-105 transition-all duration-300 flex items-center gap-3"
          onClick={onLaunch}
        >
          <Rocket className="w-6 h-6" />
          <span className="text-lg">
            Launch Campaign {selectedImagesCount > 0 && `(${selectedImagesCount})`}
          </span>
        </Button>
      </div>
    </div>
  );
};

export default CampaignSettings;
