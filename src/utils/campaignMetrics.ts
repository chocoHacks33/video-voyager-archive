
// Cache to store generated values for each metric
const dataCache: Record<string, Record<number, number>> = {};

// Fixed maximum values for each metric type
const metricMaxValues: Record<string, number> = {
  ctr: 100, // percentage
  engagement: 1000, // score
  views: 10000, // count
  outreach: 5000, // users
  convertibility: 2000, // buyers
};

// Define specific engagement values for each evolution point
const engagementPattern = {
  0: 400,  // Starting point
  7: 405,  // Evolution 1 (plateau from 0)
  14: 480, // Evolution 2 (slight increase)
  21: 350, // Evolution 3 (dip)
  28: 850  // Evolution 4 (massive spike)
};

// Agent explanations for engagement evolution points
export const agentExplanations: Record<number, string> = {
  0: "We've just launched an ad targeting the kids' gaming demographic. Excited to monitor performance and optimize as the data starts coming in.",
  7: "I incorporated Minecraft into the ad creative, aligning with current gaming trends where sandbox and creative games are seeing a surge among younger demographics. We're already noticing a slight lift in engagement, and I'll continue optimizing around trending titles to capture even more momentum.",
  14: "We are doing great! Lets continue the same ad!",
  21: "To spark curiosity and amplify engagement, I altered the Coke color to green in the ads. Leveraging novelty and visual disruption is a proven way to drive higher interaction, and early signals will tell us how strongly the audience responds to the unexpected.",
  28: "After successfully leveraging the green Coke twist to boost engagement, I transitioned the campaign visuals back to the classic Coke once the trend had been established. Performance remains strong, and this final phase should sustain momentum and allow us to close the campaign on a high note."
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
