
import React, { useEffect, useState, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from "@/lib/utils";
import VideoTooltip from './VideoTooltip';
import { formatMetricName, formatYAxisTick, getMetricUnit, getMetricMaxValue, agentExplanations } from '@/utils/campaignMetrics';
import { MessageSquare, Laptop, BrainCircuit } from 'lucide-react';

interface MetricsChartProps {
  metric: string;
  data: any[];
}

const MetricsChart = ({ metric, data }: MetricsChartProps) => {
  const [animatedData, setAnimatedData] = useState<any[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const maxValue = getMetricMaxValue(metric);
  const animationRef = useRef<number>();
  const previousDataRef = useRef<any[]>([]);
  const typingRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Find the last day with data
    const lastDataPoint = [...data].sort((a, b) => b.name - a.name)[0];
    if (!lastDataPoint) {
      setAnimatedData(data);
      return;
    }

    const currentDay = lastDataPoint.name;
    const prevDay = currentDay - 7 >= 0 ? currentDay - 7 : 0;

    setIsAnimating(true);
    setIsTyping(true);
    setTypedText("");

    // Get current and previous checkpoint data
    const currentCheckpointData = data.find(d => d.name === currentDay);
    const prevCheckpointData = data.find(d => d.name === prevDay) || 
      { name: prevDay, value: 0, mutationNumber: Math.floor(prevDay / 7), videoSrc: `/stock-videos/video${Math.floor(prevDay / 7)}.mp4` };

    // Start with previous data state
    let startData = previousDataRef.current.length > 0 
      ? previousDataRef.current.filter(d => d.name % 7 === 0)
      : data.filter(d => d.name <= prevDay && d.name % 7 === 0);

    // Ensure we have the previous checkpoint in our start data
    if (!startData.some(d => d.name === prevDay)) {
      startData = [...startData, prevCheckpointData];
    }

    const startTime = performance.now();
    const animationDuration = 5000; // 5 seconds
    
    const easeInOutQuint = (t: number) => {
      return t < 0.5 
        ? 16 * t * t * t * t * t 
        : 1 - Math.pow(-2 * t + 2, 5) / 2;
    };
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / animationDuration, 1);
      
      // Use custom easing function for even smoother progression
      const smoothProgress = easeInOutQuint(progress);

      const newAnimatedData = [...startData];
      
      if (prevDay < currentDay) {
        // Interpolate between previous and current checkpoint with enhanced smoothing
        const interpolatedDay = prevDay + Math.floor((currentDay - prevDay) * smoothProgress);
        const interpolatedValue = prevCheckpointData.value + 
          (currentCheckpointData.value - prevCheckpointData.value) * smoothProgress;
        
        if (progress > 0) {
          const interpolatedPoint = {
            name: interpolatedDay,
            mutationNumber: Math.floor(interpolatedDay / 7),
            value: Math.round(interpolatedValue),
            videoSrc: `/stock-videos/video${Math.floor(interpolatedDay / 7)}.mp4`
          };
          
          const existingIndex = newAnimatedData.findIndex(d => d.name === currentDay);
          if (existingIndex >= 0) {
            // Replace or add interpolated point
            newAnimatedData[existingIndex] = progress < 1 ? interpolatedPoint : currentCheckpointData;
          } else {
            newAnimatedData.push(progress < 1 ? interpolatedPoint : currentCheckpointData);
          }
        }
      }
      
      // Sort by day
      newAnimatedData.sort((a, b) => a.name - b.name);
      setAnimatedData(newAnimatedData);
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        // Animation complete, save final state
        setIsAnimating(false);
        previousDataRef.current = newAnimatedData.filter(d => d.name % 7 === 0);
        
        // Start typing animation when chart animation is done
        simulateTyping(lastDataPoint ? agentExplanations[lastDataPoint.name] : "");
      }
    };
    
    // Cancel any existing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    // Start new animation
    animationRef.current = requestAnimationFrame(animate);
    
    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (typingRef.current) {
        clearTimeout(typingRef.current);
      }
    };
  }, [data]);

  // Simulate typing character by character
  const simulateTyping = (text: string) => {
    setTypedText("");
    setIsTyping(true);
    
    // Clear any existing typing animation
    if (typingRef.current) {
      clearTimeout(typingRef.current);
    }
    
    let i = 0;
    const typeNextChar = () => {
      if (i < text.length) {
        setTypedText(prev => prev + text.charAt(i));
        i++;
        typingRef.current = setTimeout(typeNextChar, 30 + Math.random() * 50); // Randomize timing slightly
      } else {
        setIsTyping(false);
      }
    };
    
    // Start typing
    typingRef.current = setTimeout(typeNextChar, 300);
  };

  const lastDataPoint = [...(data || [])].sort((a, b) => b.name - a.name)[0];
  const currentEvolution = lastDataPoint ? Math.floor(lastDataPoint.name / 7) : 0;
  const explanation = lastDataPoint ? agentExplanations[lastDataPoint.name] : "";

  return (
    <Card className="overflow-hidden border border-indigo-100 dark:border-indigo-900 shadow-lg dark:shadow-indigo-900/20">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/40 dark:to-indigo-950/40 border-b border-indigo-100 dark:border-indigo-900/30">
        <CardTitle className="capitalize text-gradient bg-gradient-to-r from-purple-700 to-indigo-600 dark:from-purple-400 dark:to-indigo-300 bg-clip-text text-transparent">
          {formatMetricName(metric)} Evolution
        </CardTitle>
        <CardDescription>
          Track the {metric === 'ctr' ? 'CTR' : metric.toLowerCase()} performance over time
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="h-[400px] mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={animatedData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 30,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.4} />
              <XAxis 
                dataKey="name"
                domain={[0, 28]}
                ticks={[0, 7, 14, 21, 28]}
                tickFormatter={(value) => `Day ${value}`}
                label={{ value: 'Timeline (Days)', position: 'insideBottom', offset: -15 }}
                type="number"
                scale="linear" 
              />
              <YAxis 
                domain={[0, maxValue]}
                tickFormatter={(value) => formatYAxisTick(value, metric)}
                label={{ 
                  value: `${formatMetricName(metric)} (${getMetricUnit(metric)})`, 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { textAnchor: 'middle' }
                }}
              />
              <Tooltip content={<VideoTooltip />} />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#8884d8" 
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 8, strokeWidth: 2, className: "animate-pulse" }}
                name={metric}
                connectNulls={true}
                isAnimationActive={false} // We're handling our own animation
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {metric === 'engagement' && (
          <div className="mt-6 p-6 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl shadow-sm border border-blue-100/60 dark:border-blue-900/30 backdrop-blur-sm">
            <div className="flex items-start gap-5">
              <div className="flex-shrink-0 mt-1 relative">
                <Avatar className="h-14 w-14 ring-2 ring-cyan-300 dark:ring-cyan-600 shadow-lg animate-float-enhanced">
                  <AvatarImage src="/lovable-uploads/96df1a11-6aa6-4ffe-a590-a9b52232aa2b.png" className="object-cover" />
                  <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-600">
                    AI
                  </AvatarFallback>
                </Avatar>
                <div className="absolute top-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white dark:border-gray-800 animate-pulse"></div>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-sm text-cyan-700 dark:text-cyan-300 mb-2 flex items-center gap-2">
                  <BrainCircuit className="h-4 w-4 text-cyan-500" />
                  <span>AI Campaign Analyst</span>
                  <span className="bg-gradient-to-r from-cyan-200 to-blue-200 dark:from-cyan-900 dark:to-blue-900 px-2 py-0.5 rounded-full text-xs font-medium text-cyan-800 dark:text-cyan-200 ml-auto">
                    Evolution {currentEvolution}
                  </span>
                </h4>
                <div className={cn(
                  "rounded-xl p-4 bg-white/80 dark:bg-gray-800/60 backdrop-blur-sm shadow-sm relative",
                  "before:content-[''] before:absolute before:left-[-8px] before:top-4 before:w-4 before:h-4 before:rotate-45",
                  "before:bg-white/80 dark:before:bg-gray-800/60",
                  "border border-indigo-100/60 dark:border-indigo-900/30"
                )}>
                  {isAnimating || isTyping ? (
                    <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-300">
                      <div className="typing-container">
                        <div className="typing-text">
                          {isAnimating ? "Analyzing campaign data" : typedText}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600 dark:text-gray-300 animate-slideUp">
                      {typedText}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MetricsChart;
