
import React from 'react';
import DataCard from '@/components/UI/DataCard';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Smile, Frown, Angry, Heart, Info, MapIcon } from "lucide-react";
import { cn } from '@/lib/utils';

export interface SentimentData {
  period: string;
  happy: number;
  neutral: number;
  sad: number;
  angry: number;
  overall: number; // -1 to 1
  primaryEmotion?: 'happy' | 'sad' | 'angry' | 'surprised' | 'scared' | 'neutral';
  locationCorrelation?: {
    type: string;
    name: string;
    score: number;
  }[];
}

interface Friend {
  id: string;
  name: string;
  location: string;
  currentEmotion: 'happy' | 'sad' | 'angry' | 'surprised' | 'scared' | 'neutral';
  emotionIntensity: number;
  description: string;
}

interface SentimentAnalysisProps {
  data: SentimentData[];
  isLoading?: boolean;
  className?: string;
  friend?: Friend;
}

const SentimentAnalysis = ({ data = [], isLoading = false, className, friend }: SentimentAnalysisProps) => {
  // Calculate overall sentiment score from the latest data point
  const latestSentiment = data.length > 0 ? data[data.length - 1] : null;
  
  // Calculate sentiment trend
  const previousSentiment = data.length > 1 ? data[data.length - 2] : null;
  const sentimentChange = latestSentiment && previousSentiment 
    ? latestSentiment.overall - previousSentiment.overall
    : 0;
  
  const getEmotionLabel = (emotion: string, intensity: number) => {
    const intensityLabel = intensity >= 0.7 ? "Very " : 
                           intensity >= 0.4 ? "Moderately " : "Slightly ";
    
    const emotionMap: Record<string, string> = {
      'happy': 'Happy 😊',
      'sad': 'Sad 😢',
      'angry': 'Angry 😠',
      'surprised': 'Surprised 😮',
      'scared': 'Anxious 😨',
      'neutral': 'Neutral 😐'
    };
    
    return `${intensityLabel}${emotionMap[emotion] || 'Neutral 😐'}`;
  };
  
  const getEmotionIcon = (emotion: string) => {
    switch (emotion) {
      case 'happy': return <Smile className="h-10 w-10 text-sentiment-positive" />;
      case 'sad': return <Frown className="h-10 w-10 text-blue-400" />;
      case 'angry': return <Angry className="h-10 w-10 text-sentiment-negative" />;
      default: return <Smile className="h-10 w-10 text-sentiment-neutral" />;
    }
  };

  // Find top correlated location
  const topLocation = latestSentiment?.locationCorrelation?.sort((a, b) => b.score - a.score)[0];
  
  return (
    <DataCard 
      title="Current Mood" 
      description={friend ? `How ${friend.name} feels right now` : "How different places affect your mood"}
      className={cn("", className)}
      isLoading={isLoading}
      animation="fade"
      delay={100}
    >
      <div className="space-y-6">
        {friend && (
          <div className="flex items-start gap-4 pb-3 border-b">
            <div className="mt-1">
              {getEmotionIcon(friend.currentEmotion)}
            </div>
            <div className="flex-1">
              <div className="text-lg font-medium">
                {getEmotionLabel(friend.currentEmotion, friend.emotionIntensity)}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                {friend.description}
              </div>
              <div className="flex items-center gap-1.5 mt-3 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                <span>{friend.location}</span>
              </div>
            </div>
          </div>
        )}
        
        {/* Location correlation insight */}
        {topLocation && (
          <div className="flex items-start gap-3 p-3 rounded-md bg-primary/5 border border-primary/20">
            <MapPin className="h-5 w-5 mt-0.5 text-primary" />
            <div>
              <div className="text-sm font-medium">
                {friend ? `${friend.name}'s mood tends to improve at ${topLocation.name}` : 
                  `Your mood tends to improve at ${topLocation.name}`}
              </div>
              <div className="text-xs text-muted-foreground">
                Visiting {topLocation.type} locations correlates with {Math.round(topLocation.score * 100)}% more positive emotions
              </div>
            </div>
          </div>
        )}
        
        {/* Daily emotion summary tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="flex items-center p-3 rounded-md bg-sentiment-positive/10 border border-sentiment-positive/20">
            <Smile className="h-8 w-8 mr-3 text-sentiment-positive" />
            <div>
              <div className="text-xs text-muted-foreground">Happy</div>
              <div className="text-lg font-semibold">
                {latestSentiment ? `${(latestSentiment.happy * 100).toFixed(0)}%` : '--'}
              </div>
            </div>
          </div>
          
          <div className="flex items-center p-3 rounded-md bg-blue-100 border border-blue-200">
            <Frown className="h-8 w-8 mr-3 text-blue-500" />
            <div>
              <div className="text-xs text-muted-foreground">Sad</div>
              <div className="text-lg font-semibold">
                {latestSentiment ? `${(latestSentiment.sad * 100).toFixed(0)}%` : '--'}
              </div>
            </div>
          </div>
          
          <div className="flex items-center p-3 rounded-md bg-sentiment-negative/10 border border-sentiment-negative/20">
            <Angry className="h-8 w-8 mr-3 text-sentiment-negative" />
            <div>
              <div className="text-xs text-muted-foreground">Angry</div>
              <div className="text-lg font-semibold">
                {latestSentiment ? `${(latestSentiment.angry * 100).toFixed(0)}%` : '--'}
              </div>
            </div>
          </div>
          
          <div className="flex items-center p-3 rounded-md bg-sentiment-neutral/10 border border-sentiment-neutral/20">
            <MapPin className="h-8 w-8 mr-3 text-primary" />
            <div>
              <div className="text-xs text-muted-foreground">Places</div>
              <div className="text-lg font-semibold">
                {friend ? '5 today' : '11 today'}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-2 border-t">
          <Button variant="outline" size="sm" className="text-xs">
            <MapPin className="h-3.5 w-3.5 mr-1.5" />
            View emotional map
          </Button>
          
          <Button variant="ghost" size="sm" className="text-xs">
            <Info className="h-3.5 w-3.5 mr-1.5" />
            Get insights
          </Button>
        </div>
      </div>
    </DataCard>
  );
};

export default SentimentAnalysis;
