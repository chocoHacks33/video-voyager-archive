
// Utility functions for campaign metrics data generation and formatting

export const generateRandomData = (metric: string) => {
  return [
    // Original state (day 0)
    {
      name: 0,
      value: Math.floor(Math.random() * 500) + 100,
      videoSrc: '/stock-videos/video0.mp4'
    },
    // Mutation 1 (day 7)
    {
      name: 7,
      value: Math.floor(Math.random() * 800) + 200,
      videoSrc: '/stock-videos/video1.mp4'
    },
    // Mutation 2 (day 14)
    {
      name: 14,
      value: Math.floor(Math.random() * 1100) + 300,
      videoSrc: '/stock-videos/video2.mp4'
    },
    // Mutation 3 (day 21)
    {
      name: 21,
      value: Math.floor(Math.random() * 1400) + 400,
      videoSrc: '/stock-videos/video3.mp4'
    },
    // Mutation 4 (day 28)
    {
      name: 28,
      value: Math.floor(Math.random() * 1700) + 500,
      videoSrc: '/stock-videos/video4.mp4'
    }
  ];
};

export const formatMetricName = (metric: string): string => {
  if (metric === 'ctr') return 'CTR';
  return metric.charAt(0).toUpperCase() + metric.slice(1);
};

export const getMetricUnit = (metric: string): string => {
  switch(metric.toLowerCase()) {
    case 'ctr': return '%';
    case 'engagement': return 'actions';
    case 'views': return 'count';
    case 'outreach': return 'users';
    case 'convertibility': return 'conversions';
    default: return '';
  }
};

export const formatYAxisTick = (value: number, metric: string): string => {
  switch(metric.toLowerCase()) {
    case 'ctr': return `${value}%`;
    default: return value.toLocaleString();
  }
};
