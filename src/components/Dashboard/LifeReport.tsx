
import React from 'react';
import DataCard from '@/components/UI/DataCard';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FileText, Download, Share2, Star, Calendar, Clock, MessageSquare, Users, Activity, MapPin, Smile } from "lucide-react";
import { cn } from '@/lib/utils';

interface ReportHighlight {
  type: 'insight' | 'event' | 'social' | 'wellness';
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export interface ReportData {
  title: string;
  period: string;
  timestamp: string;
  summary: string;
  highlights: ReportHighlight[];
  stats: {
    socialInteractions: number;
    events: number;
    locations: number;
    sentiment: number; // -1 to 1
  };
}

interface LifeReportProps {
  report?: ReportData;
  isLoading?: boolean;
  className?: string;
}

const LifeReport = ({ report, isLoading = false, className }: LifeReportProps) => {
  const getHighlightIcon = (type: ReportHighlight['type']) => {
    switch (type) {
      case 'insight': return <Star className="h-4 w-4 text-sentiment-positive" />;
      case 'event': return <Calendar className="h-4 w-4 text-primary" />;
      case 'social': return <Users className="h-4 w-4 text-sentiment-neutral" />;
      case 'wellness': return <Activity className="h-4 w-4 text-activity-high" />;
      default: return null;
    }
  };
  
  return (
    <DataCard 
      title="Life Report" 
      description={report?.period || "Your daily summary"}
      className={cn("", className)}
      isLoading={isLoading}
      animation="fade"
      delay={400}
      footer={
        <div className="flex items-center justify-between w-full pt-2">
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5 mr-1" />
            <span>Generated {report?.timestamp || "just now"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="h-8 px-2">
              <Share2 className="h-4 w-4 mr-1" />
              <span className="text-xs">Share</span>
            </Button>
            <Button variant="outline" size="sm" className="h-8 px-2">
              <Download className="h-4 w-4 mr-1" />
              <span className="text-xs">Export</span>
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {report ? (
          <>
            <div className="flex items-center gap-2 mb-1">
              <FileText className="h-4 w-4 text-primary" />
              <h3 className="text-base font-medium">{report.title}</h3>
            </div>
            
            <p className="text-sm text-balance">{report.summary}</p>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
              <div className="flex flex-col items-center p-2 text-center rounded-md bg-primary/5 border border-primary/10">
                <MessageSquare className="h-4 w-4 mb-1 text-primary" />
                <div className="text-xs font-medium">Social Interactions</div>
                <div className="text-base font-semibold mt-1">{report.stats.socialInteractions}</div>
              </div>
              
              <div className="flex flex-col items-center p-2 text-center rounded-md bg-sentiment-neutral/5 border border-sentiment-neutral/10">
                <Calendar className="h-4 w-4 mb-1 text-sentiment-neutral" />
                <div className="text-xs font-medium">Events</div>
                <div className="text-base font-semibold mt-1">{report.stats.events}</div>
              </div>
              
              <div className="flex flex-col items-center p-2 text-center rounded-md bg-activity-high/5 border border-activity-high/10">
                <MapPin className="h-4 w-4 mb-1 text-activity-high" />
                <div className="text-xs font-medium">Locations</div>
                <div className="text-base font-semibold mt-1">{report.stats.locations}</div>
              </div>
              
              <div className="flex flex-col items-center p-2 text-center rounded-md bg-sentiment-positive/5 border border-sentiment-positive/10">
                <Smile className="h-4 w-4 mb-1 text-sentiment-positive" />
                <div className="text-xs font-medium">Sentiment</div>
                <div className="text-base font-semibold mt-1">
                  {(report.stats.sentiment * 100).toFixed(0)}%
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Key Highlights</h4>
              
              {report.highlights.map((highlight, index) => (
                <div key={index} className="flex items-start gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors">
                  <div className="h-6 w-6 flex items-center justify-center rounded-full bg-card border">
                    {getHighlightIcon(highlight.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h5 className="text-sm font-medium">{highlight.title}</h5>
                      <Badge 
                        variant="outline" 
                        className="text-xs px-1.5 py-0 h-4 capitalize"
                      >
                        {highlight.type}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {highlight.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-base font-medium mb-1">No report available</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Connect your data sources to generate your first life report
            </p>
            <Button>Connect accounts</Button>
          </div>
        )}
      </div>
    </DataCard>
  );
};

export default LifeReport;
