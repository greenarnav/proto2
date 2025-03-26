
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { cn } from '@/lib/utils';

interface DataCardProps {
  title: string;
  description?: string;
  footer?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
  isLoading?: boolean;
  animation?: 'fade' | 'scale' | 'slide' | 'none';
  delay?: number;
}

const DataCard = ({
  title,
  description,
  footer,
  className,
  children,
  isLoading = false,
  animation = 'scale',
  delay = 0
}: DataCardProps) => {
  const [isVisible, setIsVisible] = React.useState(false);
  
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [delay]);
  
  const getAnimationClass = () => {
    if (!isVisible || animation === 'none') return 'opacity-0';
    
    switch (animation) {
      case 'fade': return 'animate-fade-in';
      case 'scale': return 'animate-scale-in';
      case 'slide': return 'animate-slide-up';
      default: return '';
    }
  };
  
  return (
    <Card 
      className={cn(
        'overflow-hidden transition-all duration-400 ease-smooth border bg-card/70 backdrop-blur-sm shadow-card hover:shadow-hover',
        isLoading ? 'animate-pulse' : getAnimationClass(),
        className
      )}
      style={{ 
        transitionDelay: `${delay}ms`,
        opacity: isVisible || animation === 'none' ? 1 : 0
      }}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
      {footer && <CardFooter className="pt-1 border-t">{footer}</CardFooter>}
    </Card>
  );
};

export default DataCard;
