
import React, { useState,useEffect } from "react";
import { DashboardProvider, useDashboard } from '@/context/DashboardContext';
import DashboardLayout from '@/components/Dashboard/DashboardLayout';
import DashboardHeader from '@/components/Dashboard/DashboardHeader';
import SentimentAnalysis from '@/components/Dashboard/SentimentAnalysis';
import LocationTimeline from '@/components/Dashboard/LocationTimeline';
import { Button } from "@/components/ui/button";
import { MapPin, RefreshCw, PlusCircle, Users } from "lucide-react";
import { toast } from "sonner";

const Dashboard = () => {
  const {
    locations,
    sentimentData,
    isLocationLoading,
    isSentimentLoading,
    activePeriod,
    setActivePeriod,
    refreshData,
    currentFriend
  } = useDashboard();

  const handleRefresh = async () => {
    await refreshData();
    toast.success("Data refreshed successfully");
  };

  const handleFriendChange = (friend: string) => {
    setActivePeriod(friend);
  };

  const handleAddLocation = () => {
    toast.success("Location added", {
      description: "Your current location has been recorded"
    });
  };

  const getEmotionEmoji = (emotion: string) => {
    switch(emotion) {
      case 'happy': return '😊';
      case 'sad': return '😢';
      case 'angry': return '😠';
      case 'surprised': return '😮';
      case 'scared': return '😨';
      case 'neutral': return '😐';
      default: return '😐';
    }
  };

  // // function LocationComponent() {
  //   const [location, setLocation] = useState(null);
  //   const [error, setError] = useState(null);
  
  //   useEffect(() => {
  //     const getLocation = () => {
  //       if ("geolocation" in navigator) {
  //         navigator.geolocation.getCurrentPosition(
  //           (position) => {
  //             const newLocation = {
  //               latitude: position.coords.latitude,
  //               longitude: position.coords.longitude,
  //             };
  //             setLocation(newLocation);
  //             console.log("User's Location:", newLocation); // Log location
  //           },
  //           (error) => {
  //             setError(error.message);
  //             console.error("Error getting location:", error.message);
  //           }
  //         );
  //       } else {
  //         setError("Geolocation is not supported by your browser.");
  //       }
  //     };
  
  //     getLocation(); // Call function inside useEffect on component mount
  //   }, []);

  return (
    <>
      <DashboardHeader
        title="City-Mood"
        subtitle="Track your locations and feelings throughout the day"
        onTimeRangeChange={handleFriendChange}
      />

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="text-3xl">
            {currentFriend && getEmotionEmoji(currentFriend.currentEmotion)}
          </div>
          <div>
            <h2 className="text-xl font-medium">{currentFriend?.name}'s Journey</h2>
            <p className="text-sm text-muted-foreground">
              Currently in {currentFriend?.location} • {currentFriend?.description}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={handleAddLocation}
          >
            <PlusCircle className="h-4 w-4" />
            <span>Add Location</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={handleRefresh}
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-6">
        <LocationTimeline 
          locations={locations} 
          isLoading={isLocationLoading} 
        />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <SentimentAnalysis 
          data={sentimentData} 
          isLoading={isSentimentLoading} 
          friend={currentFriend}
        />
      </div>
    </>
  );
};

const Index = () => {
  return (
    <DashboardProvider>
      <DashboardLayout>
        <Dashboard />
      </DashboardLayout>
    </DashboardProvider>
  );
};

export default Index;
