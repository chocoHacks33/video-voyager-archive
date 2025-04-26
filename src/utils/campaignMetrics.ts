// Cache to store generated values for each metric
const dataCache: Record<string, Record<number, number>> = {};

export const generateRandomData = (metric: string) => {
  if (!dataCache[metric]) {
    dataCache[metric] = {};
  }

  const days = [0, 7, 14, 21, 28];
  return days.map(day => {
    // If we already have a value for this day and metric, use it
    if (dataCache[metric][day] !== undefined) {
      return {
        name: day,
        mutationNumber: Math.floor(day / 7),
        value: dataCache[metric][day],
        videoSrc: `/stock-videos/video${Math.floor(day / 7)}.mp4`
      };
    }

    // Generate and cache new value for this day
    const value = Math.floor(Math.random() * 1000) + 100;
    dataCache[metric][day] = value;
    
    return {
      name: day,
      mutationNumber: Math.floor(day / 7),
      value,
      videoSrc: `/stock-videos/video${Math.floor(day / 7)}.mp4`
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
