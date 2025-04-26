// Cache to store generated values for each metric
const dataCache: Record<string, Record<number, number>> = {};

// Fixed maximum values for each metric type
const metricMaxValues: Record<string, number> = {
  ctr: 100, // percentage
  engagement: 1000, // score
  views: 10000, // count
  outreach: 5000, // users
  convertibility: 2000, // buyers
  wild: 3000, // wild factor
};

// Define specific engagement values for each evolution point
const engagementPattern = {
  0: 400,  // Starting point
  7: 420,  // Evolution 1 (relatively constant from 0)
  14: 500, // Evolution 2 (slight increase)
  21: 800, // Evolution 3 (sharp increase)
  28: 820  // Evolution 4 (relatively constant from 3)
};

// Agent explanations for engagement evolution points
export const agentExplanations: Record<number, string> = {
  0: "We've just launched an ad targeting the kids' gaming demographic. Excited to monitor performance and optimize as the data starts coming in.",
  7: "Initial data shows stable engagement. The ad seems to resonate with our target audience, but there's room for improvement.",
  14: "Minor uptick in engagement after our first optimization. The tweaks are working, but we can push for better results.",
  21: "Significant breakthrough! Our latest evolution has dramatically increased engagement levels. The ad is really connecting with viewers now.",
  28: "Maintaining our strong performance. The high engagement levels from our previous evolution are holding steady."
};

export const generateRandomData = (metric: string) => {
  if (!dataCache[metric]) {
    dataCache[metric] = {};
  }

  // Only the 5 checkpoint days for mutations 0-4
  const days = [0, 7, 14, 21, 28];
  return days.map(day => {
    // If we already have a value for this day and metric, use it
    if (dataCache[metric][day] !== undefined) {
      return {
        name: day,
        mutationNumber: Math.floor(day / 7),
        value: dataCache[metric][day],
        imageSrc: `/lovable-uploads/evo${Math.floor(day / 7)}.jpg`
      };
    }

    // For engagement metric, use predetermined pattern
    if (metric.toLowerCase() === 'engagement') {
      const value = engagementPattern[day];
      dataCache[metric][day] = value;
      return {
        name: day,
        mutationNumber: Math.floor(day / 7),
        value,
        imageSrc: `/lovable-uploads/evo${Math.floor(day / 7)}.jpg`
      };
    }

    // For other metrics, keep existing random generation logic but always use evolution images
    const maxValue = metricMaxValues[metric.toLowerCase()] || 1000;
    const value = Math.floor(Math.random() * (maxValue * 0.8)) + (maxValue * 0.1);
    dataCache[metric][day] = value;
    
    return {
      name: day,
      mutationNumber: Math.floor(day / 7),
      value,
      imageSrc: `/lovable-uploads/evo${Math.floor(day / 7)}.jpg`
    };
  });
};

export const formatMetricName = (metric: string): string => {
  if (metric === 'ctr') return 'CTR';
  if (metric === 'convertibility') return 'Conversion';
  return metric.charAt(0).toUpperCase() + metric.slice(1);
};

export const getMetricUnit = (metric: string): string => {
  switch(metric.toLowerCase()) {
    case 'ctr': return '%';
    case 'engagement': return 'Score';
    case 'views': return 'count';
    case 'outreach': return 'users';
    case 'convertibility': return '# of Buyers';
    default: return '';
  }
};

export const formatYAxisTick = (value: number, metric: string): string => {
  switch(metric.toLowerCase()) {
    case 'ctr': return `${value}%`;
    default: return value.toLocaleString();
  }
};

export const getMetricMaxValue = (metric: string): number => {
  return metricMaxValues[metric.toLowerCase()] || 1000;
};
