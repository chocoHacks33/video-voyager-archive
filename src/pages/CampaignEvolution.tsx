
import React from 'react';
import AppLayout from '@/components/AppLayout';
import CampaignChart from '@/components/campaign/CampaignChart';
import VideoTooltip from '@/components/campaign/VideoTooltip';
import { generateRandomData, formatMetricName, getMetricUnit, formatYAxisTick, getMetricMaxValue, agentExplanations } from '@/utils/campaignMetrics';
import { useState } from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import AIAnalyst from '@/components/campaign/AIAnalyst';

const CampaignEvolution = () => {
  const [metric, setMetric] = useState('ctr');
  const data = generateRandomData(metric);
  const [activeDay, setActiveDay] = useState<number | null>(null);

  const handleDotClick = (day: number) => {
    setActiveDay(day);
  };

  return (
    <AppLayout title="Campaign Evolution">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Chart Section */}
        <div className="md:w-3/4">
          <CampaignChart 
            data={data} 
            metric={metric} 
            onDotClick={handleDotClick}
            formatYAxisTick={formatYAxisTick}
            getMetricMaxValue={getMetricMaxValue}
            TooltipContent={<VideoTooltip />}
          />
          <div className="mt-4">
            <RadioGroup defaultValue="ctr" className="flex gap-2" onValueChange={setMetric}>
              <RadioGroupItem value="ctr" id="ctr" className="peer sr-only" />
              <label
                htmlFor="ctr"
                className="px-4 py-2 rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring peer-data-[state=checked]:bg-secondary peer-data-[state=checked]:text-secondary-foreground"
              >
                CTR
              </label>
              <RadioGroupItem value="engagement" id="engagement" className="peer sr-only" />
              <label
                htmlFor="engagement"
                className="px-4 py-2 rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring peer-data-[state=checked]:bg-secondary peer-data-[state=checked]:text-secondary-foreground"
              >
                Engagement
              </label>
              <RadioGroupItem value="views" id="views" className="peer sr-only" />
              <label
                htmlFor="views"
                className="px-4 py-2 rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring peer-data-[state=checked]:bg-secondary peer-data-[state=checked]:text-secondary-foreground"
              >
                Views
              </label>
              <RadioGroupItem value="outreach" id="outreach" className="peer sr-only" />
              <label
                htmlFor="outreach"
                className="px-4 py-2 rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring peer-data-[state=checked]:bg-secondary peer-data-[state=checked]:text-secondary-foreground"
              >
                Outreach
              </label>
              <RadioGroupItem value="convertibility" id="convertibility" className="peer sr-only" />
              <label
                htmlFor="convertibility"
                className="px-4 py-2 rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring peer-data-[state=checked]:bg-secondary peer-data-[state=checked]:text-secondary-foreground"
              >
                Conversion
              </label>
            </RadioGroup>
            <p className="text-sm text-muted-foreground mt-2">
              Selected Metric: {formatMetricName(metric)} ({getMetricUnit(metric)})
            </p>
          </div>
        </div>

        {/* Insights Section */}
        <div className="md:w-1/4">
          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-2">Campaign Insights</h3>
              <Separator className="my-2" />
              <ScrollArea className="h-[400px] space-y-3">
                {data.map((item) => (
                  <div key={item.name} className="mb-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">Day {item.name}</h4>
                      <Badge variant="secondary">Mutation {item.mutationNumber}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formatMetricName(metric)}: {item.value.toLocaleString()}
                    </p>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Agent Explanations Accordion */}
      <div className="mt-8">
        <Accordion type="single" collapsible>
          {Object.entries(agentExplanations).map(([day, explanation]) => (
            <AccordionItem value={day} key={day}>
              <AccordionTrigger>
                Day {day}: Mutation {Math.floor(Number(day) / 7)} Explanation
              </AccordionTrigger>
              <AccordionContent>
                {explanation}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
      <AIAnalyst />
    </AppLayout>
  );
};

export default CampaignEvolution;
