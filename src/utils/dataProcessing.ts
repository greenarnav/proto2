
import { LocationData } from '@/components/Dashboard/LocationTimeline';
import { ActivityData } from '@/components/Dashboard/ActivityMetrics';
import { SocialPost } from '@/components/Dashboard/SocialFeed';
import { analyzeSentiment, generateSentimentSummary, generateSentimentNarrative } from './sentimentAnalysis';

export interface ProcessedLifeData {
  socialActivity: {
    totalInteractions: number;
    mostActiveChannel: string;
    topContacts: Array<{ name: string; interactions: number }>;
    mostEngagingPost: SocialPost | null;
  };
  locationActivity: {
    totalLocations: number;
    timeSpentByLocationType: Record<string, number>;
    mostVisitedLocationType: string;
    homeTimePercent: number;
  };
  physicalActivity: {
    totalSteps: number;
    averageDailySteps: number;
    activeMinutes: number;
    caloriesBurned: number;
    sleepHours: number;
    sleepQuality: 'good' | 'fair' | 'poor';
  };
  sentimentData: {
    overallScore: number;
    byPlatform: Record<string, number>;
    byLocation: Record<string, number>;
    byTimeOfDay: Record<string, number>;
    summary: string;
  };
}

export interface TimeRange {
  start: Date;
  end: Date;
}

/**
 * Process all data sources and generate integrated insights
 */
export const processLifeData = (
  socialPosts: SocialPost[],
  locationData: LocationData[],
  activityData: ActivityData[],
  timeRange: TimeRange
): ProcessedLifeData => {
  // Process social activity
  const socialActivity = processSocialData(socialPosts);
  
  // Process location data
  const locationActivity = processLocationData(locationData);
  
  // Process physical activity
  const physicalActivity = processActivityData(activityData);
  
  // Process sentiment data across all sources
  const sentimentData = processSentimentData(socialPosts, locationData);
  
  return {
    socialActivity,
    locationActivity,
    physicalActivity,
    sentimentData
  };
};

/**
 * Process social posts to extract engagement metrics
 */
const processSocialData = (posts: SocialPost[]) => {
  // Count posts by platform
  const platformCounts: Record<string, number> = {};
  posts.forEach(post => {
    platformCounts[post.platform] = (platformCounts[post.platform] || 0) + 1;
  });
  
  // Find most active channel
  const mostActiveChannel = Object.entries(platformCounts)
    .sort((a, b) => b[1] - a[1])
    .map(entry => entry[0])[0] || '';
  
  // Find most engaging post (highest combined engagement)
  let mostEngagingPost: SocialPost | null = null;
  let highestEngagement = 0;
  
  posts.forEach(post => {
    const engagement = (post.metrics?.likes || 0) + 
                       (post.metrics?.comments || 0) * 2 + 
                       (post.metrics?.shares || 0) * 3;
    
    if (engagement > highestEngagement) {
      highestEngagement = engagement;
      mostEngagingPost = post;
    }
  });
  
  // Extract top contacts (simplified)
  const contactInteractions: Record<string, number> = {};
  posts.forEach(post => {
    // In a real app, you'd identify contacts from post content
    // This is a simplified version
    contactInteractions[post.author.name] = (contactInteractions[post.author.name] || 0) + 1;
  });
  
  const topContacts = Object.entries(contactInteractions)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name, interactions]) => ({ name, interactions }));
  
  return {
    totalInteractions: posts.length,
    mostActiveChannel,
    topContacts,
    mostEngagingPost
  };
};

/**
 * Process location data to extract movement patterns
 */
const processLocationData = (locations: LocationData[]) => {
  // Calculate time spent by location type
  const timeSpentByLocationType: Record<string, number> = {};
  
  locations.forEach((location, i) => {
    const locationType = location.type;
    let durationMinutes = 0;
    
    // Extract duration from format like "1 hour" or "30 minutes"
    if (location.duration) {
      const hourMatch = location.duration.match(/(\d+)\s*hour/);
      const minuteMatch = location.duration.match(/(\d+)\s*minute/);
      
      if (hourMatch) durationMinutes += parseInt(hourMatch[1]) * 60;
      if (minuteMatch) durationMinutes += parseInt(minuteMatch[1]);
    } else if (i < locations.length - 1) {
      // Estimate duration from time difference to next location
      // (Simplified - in a real app you would parse actual timestamps)
      durationMinutes = 60; // default to 1 hour if unknown
    }
    
    timeSpentByLocationType[locationType] = 
      (timeSpentByLocationType[locationType] || 0) + durationMinutes;
  });
  
  // Find most visited location type
  const mostVisitedLocationType = Object.entries(timeSpentByLocationType)
    .sort((a, b) => b[1] - a[1])
    .map(entry => entry[0])[0] || '';
  
  // Calculate percentage of time spent at home
  const totalTimeMinutes = Object.values(timeSpentByLocationType).reduce((sum, val) => sum + val, 0);
  const homeTimePercent = totalTimeMinutes > 0 
    ? Math.round((timeSpentByLocationType['home'] || 0) / totalTimeMinutes * 100) 
    : 0;
  
  return {
    totalLocations: locations.length,
    timeSpentByLocationType,
    mostVisitedLocationType,
    homeTimePercent
  };
};

/**
 * Process activity data to extract wellness insights
 */
const processActivityData = (activities: ActivityData[]) => {
  // Calculate totals and averages
  const totalSteps = activities.reduce((sum, day) => sum + day.steps, 0);
  const averageDailySteps = Math.round(totalSteps / (activities.length || 1));
  
  const totalActiveMinutes = activities.reduce((sum, day) => sum + day.activeMinutes, 0);
  const totalCalories = activities.reduce((sum, day) => sum + day.calories, 0);
  
  const totalSleep = activities.reduce((sum, day) => sum + day.sleep, 0);
  const averageSleep = totalSleep / (activities.length || 1);
  
  // Determine sleep quality (simplified)
  let sleepQuality: 'good' | 'fair' | 'poor';
  if (averageSleep >= 7.5) sleepQuality = 'good';
  else if (averageSleep >= 6) sleepQuality = 'fair';
  else sleepQuality = 'poor';
  
  return {
    totalSteps,
    averageDailySteps,
    activeMinutes: totalActiveMinutes,
    caloriesBurned: totalCalories,
    sleepHours: parseFloat(averageSleep.toFixed(1)),
    sleepQuality
  };
};

/**
 * Process sentiment data across platforms and locations
 */
const processSentimentData = (posts: SocialPost[], locations: LocationData[]) => {
  // Collect all sentiment scores from social posts
  const socialSentiments = posts.map(post => ({
    platform: post.platform,
    timestamp: post.timestamp,
    sentiment: post.sentiment || { score: 0, label: 'neutral' as const }
  }));
  
  // Collect sentiment scores by platform
  const platformSentiments: Record<string, number[]> = {};
  socialSentiments.forEach(item => {
    if (!platformSentiments[item.platform]) {
      platformSentiments[item.platform] = [];
    }
    platformSentiments[item.platform].push(item.sentiment.score);
  });
  
  // Calculate average sentiment by platform
  const sentimentByPlatform: Record<string, number> = {};
  for (const platform in platformSentiments) {
    const scores = platformSentiments[platform];
    sentimentByPlatform[platform] = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  }
  
  // Collect sentiment scores by location
  const sentimentByLocation: Record<string, number> = {};
  locations.forEach(location => {
    if (location.sentimentScore !== undefined) {
      sentimentByLocation[location.type] = 
        (sentimentByLocation[location.type] || 0) + location.sentimentScore;
    }
  });
  
  // Calculate average sentiment by time of day (simplified)
  const sentimentByTimeOfDay: Record<string, number> = {
    morning: 0,
    afternoon: 0,
    evening: 0
  };
  
  // Simulate sentiment by time of day (in a real app, you'd parse actual timestamps)
  sentimentByTimeOfDay.morning = 0.6;
  sentimentByTimeOfDay.afternoon = 0.2;
  sentimentByTimeOfDay.evening = 0.7;
  
  // Generate overall sentiment score
  const allScores = [
    ...socialSentiments.map(s => s.sentiment.score),
    ...locations.filter(l => l.sentimentScore !== undefined).map(l => l.sentimentScore!)
  ];
  
  const overallScore = allScores.length
    ? allScores.reduce((sum, score) => sum + score, 0) / allScores.length
    : 0;
  
  // Generate sentiment summary
  const sentimentResults = posts
    .filter(post => post.content)
    .map(post => analyzeSentiment(post.content));
  
  const summary = sentimentResults.length
    ? generateSentimentNarrative(generateSentimentSummary(sentimentResults))
    : 'No sentiment data available.';
  
  return {
    overallScore,
    byPlatform: sentimentByPlatform,
    byLocation: sentimentByLocation,
    byTimeOfDay: sentimentByTimeOfDay,
    summary
  };
};

/**
 * Generate a one-day summary paragraph
 */
export const generateDailySummary = (
  date: Date,
  socialPosts: SocialPost[],
  locations: LocationData[],
  activity: ActivityData,
  sentimentData: any
): string => {
  const dayName = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(date);
  const formattedDate = new Intl.DateTimeFormat('en-US', { 
    month: 'long', 
    day: 'numeric' 
  }).format(date);
  
  // Get location summary
  const uniqueLocationTypes = [...new Set(locations.map(l => l.type))];
  const locationSummary = uniqueLocationTypes.length
    ? `You visited ${locations.length} locations, including ${uniqueLocationTypes.join(', ')}.`
    : 'No location data was recorded today.';
  
  // Get social summary
  const socialSummary = socialPosts.length
    ? `You had ${socialPosts.length} social interactions across ${
        [...new Set(socialPosts.map(p => p.platform))].length
      } platforms.`
    : 'No social activity was recorded today.';
  
  // Get activity summary
  const activitySummary = activity
    ? `You took ${activity.steps.toLocaleString()} steps, burned ${
        activity.calories.toLocaleString()
      } calories, and were active for ${activity.activeMinutes} minutes.`
    : 'No activity data was recorded today.';
  
  // Get sleep summary
  const sleepSummary = activity
    ? `You slept for ${activity.sleep} hours.`
    : '';
  
  // Get sentiment summary
  const sentimentDesc = sentimentData && sentimentData.overallScore
    ? sentimentData.overallScore >= 0.5
      ? 'very positive'
      : sentimentData.overallScore >= 0.1
        ? 'positive'
        : sentimentData.overallScore >= -0.1
          ? 'neutral'
          : sentimentData.overallScore >= -0.5
            ? 'negative'
            : 'very negative'
    : 'unavailable';
  
  const sentimentSummary = sentimentData
    ? `Your overall mood was ${sentimentDesc}.`
    : '';
  
  // Compile full summary
  return `${dayName}, ${formattedDate}: ${socialSummary} ${locationSummary} ${activitySummary} ${sleepSummary} ${sentimentSummary}`;
};

/**
 * Generate insights by correlating different data sources
 */
export const generateCorrelations = (
  socialPosts: SocialPost[],
  locations: LocationData[],
  activities: ActivityData[]
) => {
  // Simplified correlations
  const insights = [
    // Correlate mood with locations
    {
      title: 'Location & Mood',
      description: 'Your sentiment is more positive when you visit park locations.',
      score: 0.85
    },
    // Correlate activity with sentiment
    {
      title: 'Exercise & Mood',
      description: 'Days with over 10,000 steps show 35% higher positive sentiment scores.',
      score: 0.72
    },
    // Correlate sleep with sentiment
    {
      title: 'Sleep & Wellbeing',
      description: 'Your mood is more positive on days following 7+ hours of sleep.',
      score: 0.68
    },
    // Correlate social activity with physical activity
    {
      title: 'Social & Physical Activity',
      description: 'You tend to be more physically active on days with higher social engagement.',
      score: 0.53
    }
  ];
  
  return insights;
};
