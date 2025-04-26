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

    // Generate and cache new value for this day based on metric type
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
