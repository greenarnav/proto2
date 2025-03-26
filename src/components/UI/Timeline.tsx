
import React from 'react';
import { cn } from '@/lib/utils';

export interface TimelineItem {
  id: string;
  time: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  color?: string;
  link?: string;
}

interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

const Timeline = ({ items, className }: TimelineProps) => {
  if (!items.length) {
    return <div className="text-center text-muted-foreground">No timeline data available</div>;
  }

  return (
    <div className={cn("space-y-4 relative", className)}>
      {/* Line running through timeline */}
      <div className="absolute top-0 bottom-0 left-5 w-px bg-border dark:bg-muted"></div>

      {items.map((item, index) => (
        <div 
          key={item.id} 
          className="relative pl-12 pt-1 pb-3"
        >
          {/* Timeline dot with icon */}
          <div 
            className={cn(
              "absolute left-0 p-1.5 rounded-full z-10 flex items-center justify-center",
              "bg-background border-2 border-primary text-primary",
              "transition-all duration-300 hover:scale-110"
            )}
            style={{ 
              borderColor: item.color || 'hsl(var(--primary))',
              color: item.color || 'hsl(var(--primary))'
            }}
          >
            {item.icon || (
              <span className="w-2.5 h-2.5 rounded-full bg-current"></span>
            )}
          </div>

          {/* Content */}
          <div 
            className={cn(
              "group space-y-0.5",
              item.link && "cursor-pointer"
            )}
            onClick={() => item.link && window.open(item.link, '_blank')}
          >
            <time className="text-xs font-medium text-muted-foreground">
              {item.time}
            </time>
            <h4 className="text-sm font-medium group-hover:text-primary transition-colors duration-200">
              {item.title}
            </h4>
            {item.description && (
              <p className="text-xs text-muted-foreground">
                {item.description}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Timeline;
