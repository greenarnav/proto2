
import React from 'react';
import DataCard from '@/components/UI/DataCard';
import BarChart, { BarChartData } from '@/components/UI/BarChart';
import { Progress } from "@/components/ui/progress";
import { Heart, Activity, BedDouble, Footprints } from "lucide-react";
import { cn } from '@/lib/utils';

export interface ActivityData {
  date: string;
  steps: number;
  calories: number;
  sleep: number;
  activeMinutes: number;
}

interface ActivityGoals {
  steps: number;
  calories: number;
  sleep: number;
  activeMinutes: number;
}

interface ActivityMetricsProps {
  data: ActivityData[];
  goals?: ActivityGoals;
  isLoading?: boolean;
  className?: string;
}

const ActivityMetrics = ({ 
  data = [], 
  goals = { steps: 10000, calories: 2500, sleep: 8, activeMinutes: 30 },
  isLoading = false, 
  className 
}: ActivityMetricsProps) => {
  const todayData = data.length > 0 ? data[data.length - 1] : null;
  
  const getProgressPercentage = (value: number, goal: number) => {
    return Math.min(100, Math.round((value / goal) * 100));
  };
  
  // Convert ActivityData to BarChartData
  const chartData: BarChartData[] = data.map(item => ({
    name: item.date,
    steps: item.steps,
    activeMinutes: item.activeMinutes
  }));
  
  return (
    <DataCard 
      title="Activity & Wellness" 
      description="Physical activity and wellness metrics"
      className={cn("", className)}
      isLoading={isLoading}
      animation="fade"
      delay={300}
    >
      <div className="space-y-6">
        {/* Activity metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Footprints className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Steps</span>
              </div>
              <span className="text-xs text-muted-foreground">
                Goal: {goals.steps.toLocaleString()}
              </span>
            </div>
            <div className="text-2xl font-semibold">
              {todayData ? todayData.steps.toLocaleString() : '--'}
            </div>
            <Progress 
              value={todayData ? getProgressPercentage(todayData.steps, goals.steps) : 0} 
              className="h-1.5"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Activity className="h-4 w-4 text-activity-high" />
                <span className="text-sm font-medium">Active</span>
              </div>
              <span className="text-xs text-muted-foreground">
                Goal: {goals.activeMinutes} min
              </span>
            </div>
            <div className="text-2xl font-semibold">
              {todayData ? `${todayData.activeMinutes} min` : '--'}
            </div>
            <Progress 
              value={todayData ? getProgressPercentage(todayData.activeMinutes, goals.activeMinutes) : 0} 
              className="h-1.5"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Heart className="h-4 w-4 text-sentiment-negative" />
                <span className="text-sm font-medium">Calories</span>
              </div>
              <span className="text-xs text-muted-foreground">
                Goal: {goals.calories.toLocaleString()}
              </span>
            </div>
            <div className="text-2xl font-semibold">
              {todayData ? todayData.calories.toLocaleString() : '--'}
            </div>
            <Progress 
              value={todayData ? getProgressPercentage(todayData.calories, goals.calories) : 0} 
              className="h-1.5"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <BedDouble className="h-4 w-4 text-activity-low" />
                <span className="text-sm font-medium">Sleep</span>
              </div>
              <span className="text-xs text-muted-foreground">
                Goal: {goals.sleep} hr
              </span>
            </div>
            <div className="text-2xl font-semibold">
              {todayData ? `${todayData.sleep} hr` : '--'}
            </div>
            <Progress 
              value={todayData ? getProgressPercentage(todayData.sleep, goals.sleep) : 0} 
              className="h-1.5"
            />
          </div>
        </div>
        
        {/* Activity chart */}
        <div className="pt-2">
          <BarChart
            data={chartData}
            xAxisDataKey="name"
            bars={[
              { dataKey: 'steps', name: 'Steps', color: 'hsl(var(--primary))' },
              { dataKey: 'activeMinutes', name: 'Active Minutes', color: 'hsl(var(--activity-high))' }
            ]}
            height={200}
          />
        </div>
      </div>
    </DataCard>
  );
};

export default ActivityMetrics;
