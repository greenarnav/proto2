import React, { useState, useEffect } from 'react';
import DataCard from '@/components/UI/DataCard';
import Map from '@/components/UI/Map';
import Timeline, { TimelineItem } from '@/components/UI/Timeline';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar } from "lucide-react";
import { cn } from '@/lib/utils';
import { toast } from "sonner";

// Updated interface to match API response
export interface TrackerData {
  email_id: string;
  event_time: string;
  latitude: number;
  longitude: number;
  sentiment: 'happy' | 'sad' | 'angry' | 'neutral' | 'surprised' | 'scared';
  tracker_id: number;
}

interface LocationTimelineProps {
  className?: string;
}

const LocationTimeline: React.FC<LocationTimelineProps> = ({ className }) => {
  const [trackers, setTrackers] = useState<TrackerData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTrackers = async () => {
    const storedEmail = localStorage.getItem('email');
    
    if (!storedEmail) {
      toast.error("No email found. Please log in.");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`http://35.171.153.248/get_trackers?email_id=${storedEmail}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch trackers');
      }

      const result = await response.json();
      
      if (result.status === 'success') {
        setTrackers(result.data);
      } else {
        toast.error("Failed to retrieve tracker data");
      }
    } catch (error) {
      console.error('Error fetching trackers:', error);
      toast.error("Error retrieving location history");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Fetch trackers immediately when component mounts
    fetchTrackers();

    // Set up interval to fetch trackers every 5 minutes
    const intervalId = setInterval(fetchTrackers, 5 * 60 * 1000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // Convert trackers to map locations
  const mapLocations = trackers.map((tracker, index) => ({
    id: `map-${index}`,
    lat: tracker.latitude,
    lng: tracker.longitude,
    title: `Lat: ${tracker.latitude.toFixed(2)}, Lng: ${tracker.longitude.toFixed(2)}`,
    description: new Date(tracker.event_time).toLocaleDateString(),
    color: getSentimentColor(tracker.sentiment),
    size: 12
  }));
  
  // Convert trackers to timeline items
  const timelineItems: TimelineItem[] = trackers.map((tracker, index) => ({
    id: `timeline-${index}`,
    time: "",  // Empty time as requested
    title: `Lat: ${tracker.latitude.toFixed(2)}, Lng: ${tracker.longitude.toFixed(2)}`,
    description: `${new Date(tracker.event_time).toLocaleDateString()} · Sentiment: ${tracker.sentiment}`,
    icon: <MapPin className="h-5 w-5 text-gray-500" />,
    color: getSentimentColor(tracker.sentiment)
  }));

  function getSentimentColor(sentiment: TrackerData['sentiment']) {
    switch (sentiment) {
      case 'happy': return 'hsl(var(--sentiment-positive))';
      case 'sad': return 'hsl(200, 70%, 60%)';
      case 'angry': return 'hsl(var(--sentiment-negative))';
      case 'neutral': return 'hsl(var(--sentiment-neutral))';
      case 'surprised': return 'hsl(275, 80%, 60%)';
      case 'scared': return 'hsl(310, 70%, 50%)';
      default: return 'hsl(var(--muted-foreground))';
    }
  }
  
  const handleRecordEmotion = () => {
    toast.success("Emotion recorded", {
      description: "Your current emotional state has been saved."
    });
  };
  
  return (
    <DataCard 
      title="Location Tracker" 
      description="Your recent locations"
      className={cn("", className)}
      isLoading={isLoading}
      animation="fade"
      delay={200}
    >
      <Tabs defaultValue="timeline">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="timeline" className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <span>Timeline</span>
            </TabsTrigger>
            <TabsTrigger value="map" className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              <span>Location Map</span>
            </TabsTrigger>
          </TabsList>
          
          <Button variant="outline" size="sm" onClick={handleRecordEmotion}>Record emotion</Button>
        </div>
        
        <TabsContent value="timeline" className="mt-0">
          <div className="h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            <Timeline items={timelineItems} />
          </div>
        </TabsContent>
        
        <TabsContent value="map" className="mt-0">
          <div className="space-y-4">
            <Map 
              locations={mapLocations}
              height={300}
              isLoading={isLoading}
            />
          </div>
        </TabsContent>
      </Tabs>
    </DataCard>
  );
};

export default LocationTimeline;