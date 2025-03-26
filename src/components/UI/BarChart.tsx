
import React from 'react';
import { Bar, BarChart as RechartsBarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { cn } from '@/lib/utils';

export interface BarChartData {
  name: string;
  [key: string]: string | number;
}

interface BarChartProps {
  data: BarChartData[];
  bars: {
    dataKey: string;
    name: string;
    color?: string;
    stackId?: string;
  }[];
  xAxisDataKey?: string;
  className?: string;
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  animationDuration?: number;
}

const BarChart = ({
  data,
  bars,
  xAxisDataKey = 'name',
  className,
  height = 300,
  showGrid = true,
  showLegend = true,
  animationDuration = 1000
}: BarChartProps) => {
  return (
    <div className={cn("w-full h-full", className)}>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsBarChart
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: 0,
            bottom: 5,
          }}
          barGap={5}
          barSize={20}
        >
          {showGrid && <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />}
          <XAxis 
            dataKey={xAxisDataKey} 
            tick={{ fontSize: 12 }} 
            axisLine={{ stroke: 'var(--border)' }}
            tickLine={false}
          />
          <YAxis 
            tick={{ fontSize: 12 }} 
            axisLine={{ stroke: 'var(--border)' }}
            tickLine={false}
          />
          <Tooltip 
            cursor={{ fill: 'var(--muted)', opacity: 0.1 }}
            contentStyle={{ 
              background: 'var(--card)', 
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              boxShadow: 'var(--shadow-sm)',
            }}
          />
          {showLegend && (
            <Legend 
              verticalAlign="top" 
              height={36}
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: 12 }}
            />
          )}
          {bars.map((bar, index) => (
            <Bar
              key={bar.dataKey}
              dataKey={bar.dataKey}
              name={bar.name}
              fill={bar.color || `hsl(${210 + index * 30}, 70%, 55%)`}
              radius={[4, 4, 0, 0]}
              stackId={bar.stackId}
              animationBegin={index * 100}
              animationDuration={animationDuration}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChart;
