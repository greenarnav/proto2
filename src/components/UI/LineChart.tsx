
import React from 'react';
import { Line, LineChart as RechartsLineChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { cn } from '@/lib/utils';

export interface LineChartData {
  name: string;
  [key: string]: string | number;
}

interface LineChartProps {
  data: LineChartData[];
  lines: {
    dataKey: string;
    name: string;
    color?: string;
    strokeWidth?: number;
    type?: 'linear' | 'monotone' | 'step' | 'stepAfter' | 'stepBefore' | 'natural' | 'basis';
    dot?: boolean;
  }[];
  xAxisDataKey?: string;
  className?: string;
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  animationDuration?: number;
}

const LineChart = ({
  data,
  lines,
  xAxisDataKey = 'name',
  className,
  height = 300,
  showGrid = true,
  showLegend = true,
  animationDuration = 1500
}: LineChartProps) => {
  return (
    <div className={cn("w-full h-full", className)}>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsLineChart
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: 0,
            bottom: 5,
          }}
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
            cursor={{ stroke: 'var(--muted-foreground)', strokeWidth: 1, strokeDasharray: '3 3' }}
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
          {lines.map((line, index) => (
            <Line
              key={line.dataKey}
              type={line.type || 'monotone'}
              dataKey={line.dataKey}
              name={line.name}
              stroke={line.color || `hsl(${210 + index * 40}, 70%, 55%)`}
              strokeWidth={line.strokeWidth || 2}
              activeDot={{ r: 6, strokeWidth: 0 }}
              dot={line.dot !== false ? { r: 3, strokeWidth: 0 } : false}
              animationBegin={index * 150}
              animationDuration={animationDuration}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChart;
