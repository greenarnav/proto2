import { faker } from '@faker-js/faker';
import { LocationData } from '@/components/Dashboard/LocationTimeline';
import { SocialPost } from '@/components/Dashboard/SocialFeed';
import { Friend } from '@/context/DashboardContext';

interface ActivityData {
  date: string;
  steps: number;
  calories: number;
  sleep: number;
  activeMinutes: number;
}

interface ReportData {
  title: string;
  period: string;
  timestamp: string;
  summary: string;
  highlights: Array<{
    type: string;
    title: string;
    description: string;
  }>;
  stats: {
    socialInteractions: number;
    events: number;
    locations: number;
    sentiment: number;
  };
}

// Mock function to fetch friends data
export const fetchFriendsData = async (): Promise<Friend[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 'arnav',
          name: 'Arnav',
          location: 'ASU, Tempe',
          currentEmotion: 'happy',
          emotionIntensity: 0.8,
          description: 'Feeling great after acing my computer science exam!'
        },
        {
          id: 'sheetal',
          name: 'Sheetal',
          location: 'Manhattan, New York',
          currentEmotion: 'neutral',
          emotionIntensity: 0.5,
          description: 'Busy day at work, looking forward to the weekend'
        },
        {
          id: 'shahraan',
          name: 'Shahraan',
          location: 'Scarsdale, New York',
          currentEmotion: 'happy',
          emotionIntensity: 0.9,
          description: 'Had a great day at school, excited for baseball practice!'
        },
        {
          id: 'lena',
          name: 'Lena',
          location: 'Queens, New York',
          currentEmotion: 'neutral',
          emotionIntensity: 0.7,
          description: 'Long shift at the hospital, need some rest'
        }
      ]);
    }, 1000);
  });
};

// Mock function to fetch social media data
export const fetchSocialData = async (): Promise<SocialPost[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: '1',
          platform: 'twitter',
          author: {
            name: 'John Doe',
            handle: 'johndoe',
            avatar: ''
          },
          content: 'Just finished a great workout at the gym! Feeling energized and ready for the day ahead. #fitness #wellness',
          timestamp: '2 hours ago',
          metrics: {
            likes: 12,
            comments: 3,
            shares: 2
          },
          sentiment: {
            score: 0.8,
            label: 'positive'
          }
        },
        {
          id: '2',
          platform: 'facebook',
          author: {
            name: 'John Doe',
            avatar: ''
          },
          content: 'Had a frustrating experience with customer service today. Still waiting for a resolution after 2 hours on the phone.',
          timestamp: '5 hours ago',
          metrics: {
            likes: 5,
            comments: 8,
            shares: 0
          },
          sentiment: {
            score: -0.6,
            label: 'negative'
          }
        },
        {
          id: '3',
          platform: 'linkedin',
          author: {
            name: 'John Doe',
            handle: 'johndoe',
            avatar: ''
          },
          content: 'Excited to announce that I\'ll be speaking at the upcoming tech conference next month! Looking forward to sharing insights on data privacy and analytics.',
          timestamp: 'Yesterday',
          metrics: {
            likes: 45,
            comments: 7,
            shares: 5
          },
          sentiment: {
            score: 0.7,
            label: 'positive'
          },
          link: 'https://example.com/conference'
        },
        {
          id: '4',
          platform: 'email',
          author: {
            name: 'Project Team',
            handle: 'team@example.com',
            avatar: ''
          },
          content: 'The quarterly report is now available for review. Please provide your feedback by the end of the week.',
          timestamp: 'Yesterday',
          sentiment: {
            score: 0.1,
            label: 'neutral'
          }
        },
        {
          id: '5',
          platform: 'instagram',
          author: {
            name: 'John Doe',
            handle: 'johndoe',
            avatar: ''
          },
          content: 'Beautiful sunset at the beach today. The perfect end to a relaxing weekend! #sunset #weekend #beach',
          timestamp: '2 days ago',
          metrics: {
            likes: 87,
            comments: 12,
            shares: 0
          },
          sentiment: {
            score: 0.9,
            label: 'positive'
          }
        }
      ]);
    }, 1500);
  });
};

// Mock function to fetch location data - updated to be friend-specific
export const fetchLocationData = (friendId: string = 'arnav'): Promise<LocationData[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Different location data for each friend
      if (friendId === 'arnav') {
        resolve([
          {
            id: '1',
            name: 'Morning Run at ASU Campus',
            type: 'park',
            address: 'ASU Tempe Campus',
            time: '6:15 AM',
            duration: '45 minutes',
            coordinates: { lat: 33.4242, lng: -111.9281 },
            emotion: {
              primary: 'happy',
              intensity: 0.8,
              note: 'Loved watching the sunrise during my morning run!'
            }
          },
          {
            id: '2',
            name: 'Coffee at Dutch Bros',
            type: 'food',
            address: 'Apache Blvd, Tempe',
            time: '7:30 AM',
            duration: '20 minutes',
            coordinates: { lat: 33.4150, lng: -111.9255 },
            emotion: {
              primary: 'happy',
              intensity: 0.6,
              note: 'Great coffee to start my day'
            }
          },
          {
            id: '3',
            name: 'Computer Science Class',
            type: 'school',
            address: 'Brickyard Building, ASU',
            time: '9:00 AM',
            duration: '1.5 hours',
            coordinates: { lat: 33.4242, lng: -111.9400 },
            emotion: {
              primary: 'neutral',
              intensity: 0.4,
              note: 'Challenging lecture but learned a lot'
            }
          },
          {
            id: '4',
            name: 'Lunch with Friends',
            type: 'food',
            address: 'Memorial Union, ASU',
            time: '12:30 PM',
            duration: '1 hour',
            coordinates: { lat: 33.4190, lng: -111.9350 },
            emotion: {
              primary: 'happy',
              intensity: 0.9,
              note: 'Had an amazing time with friends!'
            }
          },
          {
            id: '5',
            name: 'Study Session at Library',
            type: 'school',
            address: 'Hayden Library, ASU',
            time: '2:00 PM',
            duration: '3 hours',
            coordinates: { lat: 33.4190, lng: -111.9320 },
            emotion: {
              primary: 'neutral',
              intensity: 0.5,
              note: 'Productive study session'
            }
          }
        ]);
      } else if (friendId === 'sheetal') {
        resolve([
          {
            id: '1',
            name: 'Morning Yoga',
            type: 'park',
            address: 'Battery Park, Manhattan',
            time: '7:00 AM',
            duration: '1 hour',
            coordinates: { lat: 40.7033, lng: -74.0170 },
            emotion: {
              primary: 'happy',
              intensity: 0.7,
              note: 'Peaceful morning overlooking the water'
            }
          },
          {
            id: '2',
            name: 'Breakfast at Le Pain Quotidien',
            type: 'food',
            address: 'Brookfield Place, Manhattan',
            time: '8:30 AM',
            duration: '30 minutes',
            coordinates: { lat: 40.7133, lng: -74.0150 },
            emotion: {
              primary: 'happy',
              intensity: 0.6,
              note: 'Delicious avocado toast and coffee'
            }
          },
          {
            id: '3',
            name: 'Work at Wall Street Office',
            type: 'work',
            address: 'Wall Street, Manhattan',
            time: '9:30 AM',
            duration: '4 hours',
            coordinates: { lat: 40.7061, lng: -74.0088 },
            emotion: {
              primary: 'neutral',
              intensity: 0.4,
              note: 'Busy morning with client meetings'
            }
          },
          {
            id: '4',
            name: 'Lunch Meeting',
            type: 'food',
            address: 'Delmonico\'s, Manhattan',
            time: '1:30 PM',
            duration: '1.5 hours',
            coordinates: { lat: 40.7045, lng: -74.0101 },
            emotion: {
              primary: 'happy',
              intensity: 0.8,
              note: 'Closed a big deal over lunch!'
            }
          },
          {
            id: '5',
            name: 'Afternoon at Office',
            type: 'work',
            address: 'Wall Street, Manhattan',
            time: '3:00 PM',
            duration: '3 hours',
            coordinates: { lat: 40.7061, lng: -74.0088 },
            emotion: {
              primary: 'sad',
              intensity: 0.5,
              note: 'Tired from the long day and upcoming deadline'
            }
          }
        ]);
      } else if (friendId === 'shahraan') {
        resolve([
          {
            id: '1',
            name: 'Home Breakfast',
            type: 'home',
            address: 'Scarsdale, NY',
            time: '7:30 AM',
            duration: '30 minutes',
            coordinates: { lat: 41.0051, lng: -73.7846 },
            emotion: {
              primary: 'happy',
              intensity: 0.7,
              note: 'Mom made my favorite pancakes!'
            }
          },
          {
            id: '2',
            name: 'School Bus Ride',
            type: 'transit',
            address: 'Scarsdale, NY',
            time: '8:00 AM',
            duration: '20 minutes',
            coordinates: { lat: 41.0055, lng: -73.7830 },
            emotion: {
              primary: 'neutral',
              intensity: 0.4,
              note: 'Talking with friends on the bus'
            }
          },
          {
            id: '3',
            name: 'Elementary School',
            type: 'school',
            address: 'Scarsdale Elementary, Scarsdale',
            time: '8:30 AM',
            duration: '3.5 hours',
            coordinates: { lat: 41.0037, lng: -73.7789 },
            emotion: {
              primary: 'happy',
              intensity: 0.9,
              note: 'Math class was so fun today!'
            }
          },
          {
            id: '4',
            name: 'Lunch at School',
            type: 'food',
            address: 'Scarsdale Elementary, Scarsdale',
            time: '12:00 PM',
            duration: '45 minutes',
            coordinates: { lat: 41.0037, lng: -73.7789 },
            emotion: {
              primary: 'angry',
              intensity: 0.6,
              note: 'Someone took my dessert'
            }
          },
          {
            id: '5',
            name: 'Playground Time',
            type: 'park',
            address: 'School Playground, Scarsdale',
            time: '2:30 PM',
            duration: '30 minutes',
            coordinates: { lat: 41.0040, lng: -73.7780 },
            emotion: {
              primary: 'happy',
              intensity: 0.9,
              note: 'Playing tag with friends was awesome!'
            }
          }
        ]);
      } else if (friendId === 'lena') {
        resolve([
          {
            id: '1',
            name: 'Morning Coffee',
            type: 'home',
            address: 'Queens, NY',
            time: '5:30 AM',
            duration: '20 minutes',
            coordinates: { lat: 40.7282, lng: -73.7949 },
            emotion: {
              primary: 'neutral',
              intensity: 0.4,
              note: 'Early start for hospital shift'
            }
          },
          {
            id: '2',
            name: 'Commute to Hospital',
            type: 'transit',
            address: 'Queens to Manhattan',
            time: '6:00 AM',
            duration: '45 minutes',
            coordinates: { lat: 40.7500, lng: -73.8700 },
            emotion: {
              primary: 'neutral',
              intensity: 0.3,
              note: 'Subway was crowded as usual'
            }
          },
          {
            id: '3',
            name: 'Hospital Shift',
            type: 'hospital',
            address: 'NY Presbyterian, Manhattan',
            time: '7:00 AM',
            duration: '6 hours',
            coordinates: { lat: 40.7644, lng: -73.9857 },
            emotion: {
              primary: 'happy',
              intensity: 0.7,
              note: 'Saved a patient in critical condition'
            }
          },
          {
            id: '4',
            name: 'Lunch Break',
            type: 'food',
            address: 'Hospital Cafeteria, Manhattan',
            time: '1:00 PM',
            duration: '30 minutes',
            coordinates: { lat: 40.7644, lng: -73.9857 },
            emotion: {
              primary: 'sad',
              intensity: 0.6,
              note: 'Thinking about the difficult cases today'
            }
          },
          {
            id: '5',
            name: 'Patient Rounds',
            type: 'hospital',
            address: 'NY Presbyterian, Manhattan',
            time: '1:30 PM',
            duration: '3 hours',
            coordinates: { lat: 40.7644, lng: -73.9857 },
            emotion: {
              primary: 'surprised',
              intensity: 0.8,
              note: 'Patient showed remarkable improvement!'
            }
          }
        ]);
      } else {
        resolve([]);
      }
    }, 800);
  });
};

// Mock function to fetch activity data
export const fetchActivityData = async (): Promise<ActivityData[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          date: 'Monday',
          steps: 8234,
          calories: 1850,
          sleep: 7.5,
          activeMinutes: 35
        },
        {
          date: 'Tuesday',
          steps: 10543,
          calories: 2100,
          sleep: 8,
          activeMinutes: 42
        },
        {
          date: 'Wednesday',
          steps: 7654,
          calories: 1950,
          sleep: 6.5,
          activeMinutes: 28
        },
        {
          date: 'Thursday',
          steps: 9876,
          calories: 2200,
          sleep: 7,
          activeMinutes: 45
        },
        {
          date: 'Friday',
          steps: 11234,
          calories: 2350,
          sleep: 7.5,
          activeMinutes: 55
        },
        {
          date: 'Saturday',
          steps: 12543,
          calories: 2450,
          sleep: 8.5,
          activeMinutes: 65
        },
        {
          date: 'Sunday',
          steps: 9234,
          calories: 2150,
          sleep: 8,
          activeMinutes: 40
        }
      ]);
    }, 1500);
  });
};

// Mock function to fetch sentiment data - updated to be friend-specific
export const fetchSentimentData = async (friendId = 'arnav'): Promise<any[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (friendId === 'arnav') {
        resolve([
          {
            period: 'Monday',
            happy: 0.65,
            sad: 0.1,
            angry: 0.0,
            neutral: 0.25,
            overall: 0.55,
            primaryEmotion: 'happy',
            locationCorrelation: [
              {
                type: 'school',
                name: 'Computer Science Building',
                score: 0.85
              },
              {
                type: 'park',
                name: 'Campus Recreation',
                score: 0.72
              }
            ]
          }
        ]);
      } else if (friendId === 'sheetal') {
        resolve([
          {
            period: 'Monday',
            happy: 0.55,
            sad: 0.1,
            angry: 0.05,
            neutral: 0.3,
            overall: 0.45,
            primaryEmotion: 'happy',
            locationCorrelation: [
              {
                type: 'park',
                name: 'Central Park',
                score: 0.9
              },
              {
                type: 'food',
                name: 'Shake Shack',
                score: 0.75
              }
            ]
          }
        ]);
      } else if (friendId === 'shahraan') {
        resolve([
          {
            period: 'Monday',
            happy: 0.8,
            sad: 0.05,
            angry: 0.05,
            neutral: 0.1,
            overall: 0.75,
            primaryEmotion: 'happy',
            locationCorrelation: [
              {
                type: 'park',
                name: 'Baseball Field',
                score: 0.95
              },
              {
                type: 'food',
                name: 'School Cafeteria',
                score: 0.8
              }
            ]
          }
        ]);
      } else if (friendId === 'lena') {
        resolve([
          {
            period: 'Monday',
            happy: 0.2,
            sad: 0.4,
            angry: 0.1,
            neutral: 0.3,
            overall: -0.1,
            primaryEmotion: 'sad',
            locationCorrelation: [
              {
                type: 'home',
                name: 'Queens Apartment',
                score: 0.6
              },
              {
                type: 'food',
                name: 'Coffee Shop',
                score: 0.5
              }
            ]
          }
        ]);
      } else {
        resolve([]);
      }
    }, 1500);
  });
};

// Mock function to fetch life report
export const fetchLifeReport = async (): Promise<ReportData> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        title: 'Your Sunday Summary',
        period: 'Sunday, June 5, 2023',
        timestamp: '11:59 PM',
        summary: 'You had a balanced day with positive social interactions and good physical activity. Your overall sentiment was positive, and you visited 4 locations throughout the day. You spent most of your time at home and the park.',
        highlights: [
          {
            type: 'insight',
            title: 'Mood improvement after exercise',
            description: 'Your sentiment scores increased significantly after your morning run.'
          },
          {
            type: 'event',
            title: 'Family dinner',
            description: 'You spent 2 hours at an Italian restaurant with family members.'
          },
          {
            type: 'social',
            title: 'High engagement post',
            description: 'Your beach sunset photo received 87 likes, your highest this week.'
          },
          {
            type: 'wellness',
            title: 'Sleep quality improvement',
            description: 'You slept 8 hours with fewer disruptions than your weekly average.'
          }
        ],
        stats: {
          socialInteractions: 24,
          events: 3,
          locations: 4,
          sentiment: 0.7
        }
      });
    }, 1500);
  });
};

// Mock function to fetch privacy settings
export const fetchPrivacySettings = async (): Promise<any[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 'location-tracking',
          name: 'Location Tracking',
          description: 'Allow the app to collect and analyze your location data',
          enabled: true,
          category: 'data'
        },
        {
          id: 'social-content',
          name: 'Social Media Content',
          description: 'Collect and analyze content from your connected social accounts',
          enabled: true,
          category: 'data'
        },
        {
          id: 'health-data',
          name: 'Health & Activity Data',
          description: 'Access step count, sleep, and other wellness metrics',
          enabled: true,
          category: 'data'
        },
        {
          id: 'sentiment-analysis',
          name: 'Sentiment Analysis',
          description: 'Process text content to determine emotional tone',
          enabled: true,
          category: 'analytics'
        },
        {
          id: 'behavioral-patterns',
          name: 'Behavioral Pattern Analysis',
          description: 'Identify patterns in your daily activities and habits',
          enabled: true,
          category: 'analytics'
        },
        {
          id: 'social-graph',
          name: 'Social Connection Analysis',
          description: 'Analyze your social interactions and relationships',
          enabled: false,
          category: 'analytics'
        },
        {
          id: 'aggregate-stats',
          name: 'Anonymous Aggregate Statistics',
          description: 'Contribute anonymous data to improve the app (no personal information)',
          enabled: true,
          category: 'sharing'
        },
        {
          id: 'cross-device',
          name: 'Cross-Device Synchronization',
          description: 'Sync your data between different devices',
          enabled: true,
          category: 'sharing'
        },
        {
          id: 'third-party',
          name: 'Third-Party Integration',
          description: 'Share data with connected third-party services',
          enabled: false,
          category: 'sharing'
        }
      ]);
    }, 1500);
  });
};
