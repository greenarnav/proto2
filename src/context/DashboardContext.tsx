
import React, { createContext, useContext, useState, useEffect } from 'react';
import { SocialPost } from '@/components/Dashboard/SocialFeed';
import { LocationData } from '@/components/Dashboard/LocationTimeline';
import { ActivityData } from '@/components/Dashboard/ActivityMetrics';
import { ReportData } from '@/components/Dashboard/LifeReport';
import { 
  fetchSocialData, 
  fetchLocationData, 
  fetchActivityData, 
  fetchSentimentData,
  fetchLifeReport,
  fetchPrivacySettings,
  fetchFriendsData
} from '@/utils/dataFetchers';
import { 
  processLifeData, 
  generateDailySummary, 
  generateCorrelations 
} from '@/utils/dataProcessing';

export interface Friend {
  id: string;
  name: string;
  location: string;
  currentEmotion: 'happy' | 'sad' | 'angry' | 'surprised' | 'scared' | 'neutral';
  emotionIntensity: number;
  description: string;
}

interface DashboardContextType {
  // Data states
  socialPosts: SocialPost[];
  locations: LocationData[];
  activityData: ActivityData[];
  sentimentData: any[];
  lifeReport: ReportData | null;
  privacySettings: any[];
  processedData: any | null;
  friends: Friend[];
  currentFriend: Friend | null;
  
  // Loading states
  isSocialLoading: boolean;
  isLocationLoading: boolean;
  isActivityLoading: boolean;
  isSentimentLoading: boolean;
  isReportLoading: boolean;
  isPrivacyLoading: boolean;
  
  // Time period state
  activePeriod: string;
  setActivePeriod: (period: string) => void;
  
  // Utility methods
  refreshData: () => Promise<void>;
  generateDailySummary: (date: Date) => string;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Data states
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>([]);
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [activityData, setActivityData] = useState<ActivityData[]>([]);
  const [sentimentData, setSentimentData] = useState<any[]>([]);
  const [lifeReport, setLifeReport] = useState<ReportData | null>(null);
  const [privacySettings, setPrivacySettings] = useState<any[]>([]);
  const [processedData, setProcessedData] = useState<any | null>(null);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [currentFriend, setCurrentFriend] = useState<Friend | null>(null);
  
  // Loading states
  const [isSocialLoading, setIsSocialLoading] = useState(true);
  const [isLocationLoading, setIsLocationLoading] = useState(true);
  const [isActivityLoading, setIsActivityLoading] = useState(true);
  const [isSentimentLoading, setIsSentimentLoading] = useState(true);
  const [isReportLoading, setIsReportLoading] = useState(true);
  const [isPrivacyLoading, setIsPrivacyLoading] = useState(true);
  
  // Time period state (now used for friend selection)
  const [activePeriod, setActivePeriod] = useState('arnav');
  
  // Fetch all data on initial load
  useEffect(() => {
    refreshData();
  }, []);

  // Update current friend when activePeriod changes
  useEffect(() => {
    if (friends.length > 0) {
      const friend = friends.find(f => f.id === activePeriod) || friends[0];
      setCurrentFriend(friend);
      
      // Clear previous data
      setLocations([]);
      setSentimentData([]);
      setIsLocationLoading(true);
      setIsSentimentLoading(true);
      
      // Load location data specific to the selected friend
      fetchLocationData(activePeriod).then(data => {
        setLocations(data);
        setIsLocationLoading(false);
      });
      
      // Load sentiment data specific to the selected friend
      fetchSentimentData(activePeriod).then(data => {
        setSentimentData(data);
        setIsSentimentLoading(false);
      });
    }
  }, [activePeriod, friends]);
  
  // Process the data when all sources are loaded
  useEffect(() => {
    if (!isSocialLoading && !isLocationLoading && !isActivityLoading && !isSentimentLoading) {
      const processed = processLifeData(
        socialPosts,
        locations,
        activityData,
        {
          start: new Date(),
          end: new Date()
        }
      );
      setProcessedData(processed);
    }
  }, [socialPosts, locations, activityData, sentimentData, isSocialLoading, isLocationLoading, isActivityLoading, isSentimentLoading]);
  
  // Function to refresh all data
  const refreshData = async () => {
    try {
      // Reset loading states
      setIsSocialLoading(true);
      setIsLocationLoading(true);
      setIsActivityLoading(true);
      setIsSentimentLoading(true);
      setIsReportLoading(true);
      setIsPrivacyLoading(true);
      
      // Fetch all data in parallel
      const [
        socialData,
        locationData,
        activityData,
        sentimentData,
        reportData,
        privacyData,
        friendsData
      ] = await Promise.all([
        fetchSocialData(),
        fetchLocationData(activePeriod),
        fetchActivityData(),
        fetchSentimentData(activePeriod),
        fetchLifeReport(),
        fetchPrivacySettings(),
        fetchFriendsData()
      ]);
      
      // Update state with fetched data
      setSocialPosts(socialData);
      setLocations(locationData);
      setActivityData(activityData);
      setSentimentData(sentimentData);
      setLifeReport(reportData);
      setPrivacySettings(privacyData);
      setFriends(friendsData);
      
      // Set current friend
      const friend = friendsData.find(f => f.id === activePeriod) || friendsData[0];
      setCurrentFriend(friend);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      // Update loading states
      setIsSocialLoading(false);
      setIsLocationLoading(false);
      setIsActivityLoading(false);
      setIsSentimentLoading(false);
      setIsReportLoading(false);
      setIsPrivacyLoading(false);
    }
  };
  
  // Generate daily summary for the given date
  const generateDailySummaryForDate = (date: Date): string => {
    if (activityData.length === 0 || socialPosts.length === 0) {
      return 'Insufficient data to generate a summary.';
    }
    
    // In a real app, you would filter data for the specific date
    // This is a simplified version
    return generateDailySummary(
      date,
      socialPosts,
      locations,
      activityData[activityData.length - 1],
      sentimentData[sentimentData.length - 1]
    );
  };
  
  const value = {
    // Data states
    socialPosts,
    locations,
    activityData,
    sentimentData,
    lifeReport,
    privacySettings,
    processedData,
    friends,
    currentFriend,
    
    // Loading states
    isSocialLoading,
    isLocationLoading,
    isActivityLoading,
    isSentimentLoading,
    isReportLoading,
    isPrivacyLoading,
    
    // Time period state
    activePeriod,
    setActivePeriod,
    
    // Utility methods
    refreshData,
    generateDailySummary: generateDailySummaryForDate
  };
  
  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  
  return context;
};
