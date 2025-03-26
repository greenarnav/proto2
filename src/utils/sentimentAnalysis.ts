
// This is a simplified mock implementation of sentiment analysis
// In a real application, you would use a proper NLP library or API

interface SentimentResult {
  score: number; // -1 (very negative) to 1 (very positive)
  label: 'positive' | 'neutral' | 'negative';
  emotion?: {
    joy: number;
    sadness: number;
    anger: number;
    surprise: number;
    fear: number;
  };
  intensity?: number; // 0 to 1
}

// Dictionary of positive and negative words for basic sentiment analysis
const POSITIVE_WORDS = [
  'good', 'great', 'excellent', 'amazing', 'fantastic', 'wonderful', 'best',
  'love', 'happy', 'joy', 'excited', 'awesome', 'beautiful', 'enjoy', 'nice',
  'perfect', 'pleasant', 'delighted', 'glad', 'pleased', 'success', 'positive',
  'win', 'excellent', 'superb', 'outstanding', 'brilliant', 'favorite'
];

const NEGATIVE_WORDS = [
  'bad', 'terrible', 'horrible', 'awful', 'worst', 'hate', 'sad', 'angry',
  'upset', 'disappointed', 'frustrating', 'poor', 'negative', 'annoying',
  'fail', 'sucks', 'problem', 'issue', 'trouble', 'difficult', 'wrong', 'hard',
  'unhappy', 'unfortunate', 'scary', 'terrible', 'miserable', 'depressing'
];

// Emotion word mapping
const EMOTION_WORDS = {
  joy: ['happy', 'joyful', 'excited', 'delighted', 'thrilled', 'pleased'],
  sadness: ['sad', 'unhappy', 'depressed', 'gloomy', 'miserable', 'disappointed'],
  anger: ['angry', 'furious', 'outraged', 'annoyed', 'irritated', 'frustrated'],
  surprise: ['surprised', 'amazed', 'astonished', 'shocked', 'stunned', 'wow'],
  fear: ['afraid', 'scared', 'terrified', 'nervous', 'anxious', 'worried']
};

// Intensity modifiers
const INTENSITY_MODIFIERS = {
  increase: ['very', 'extremely', 'incredibly', 'absolutely', 'really', 'so'],
  decrease: ['somewhat', 'slightly', 'a bit', 'kind of', 'sort of', 'a little']
};

/**
 * Analyze text sentiment
 * @param text Text to analyze
 * @returns Sentiment analysis result
 */
export const analyzeSentiment = (text: string): SentimentResult => {
  const normalizedText = text.toLowerCase();
  const words = normalizedText.split(/\W+/);
  
  let positiveCount = 0;
  let negativeCount = 0;
  
  // Count positive and negative words
  words.forEach(word => {
    if (POSITIVE_WORDS.includes(word)) positiveCount++;
    if (NEGATIVE_WORDS.includes(word)) negativeCount++;
  });
  
  // Calculate base score
  const totalEmotionalWords = positiveCount + negativeCount;
  const score = totalEmotionalWords === 0 
    ? 0 
    : (positiveCount - negativeCount) / totalEmotionalWords;
  
  // Determine sentiment label
  let label: 'positive' | 'neutral' | 'negative';
  if (score >= 0.05) label = 'positive';
  else if (score <= -0.05) label = 'negative';
  else label = 'neutral';
  
  // Analyze emotions (simplified)
  const emotions = {
    joy: 0,
    sadness: 0,
    anger: 0,
    surprise: 0,
    fear: 0
  };
  
  // Count emotion words
  words.forEach(word => {
    for (const [emotion, emotionWords] of Object.entries(EMOTION_WORDS)) {
      if (emotionWords.includes(word)) {
        emotions[emotion as keyof typeof emotions] += 1;
      }
    }
  });
  
  // Normalize emotions to 0-1 range
  const totalEmotions = Object.values(emotions).reduce((sum, val) => sum + val, 0);
  if (totalEmotions > 0) {
    for (const emotion in emotions) {
      emotions[emotion as keyof typeof emotions] /= totalEmotions;
    }
  }
  
  // Analyze intensity (simplified)
  let intensity = Math.abs(score);
  
  // Check for intensity modifiers
  words.forEach((word, i) => {
    if (i < words.length - 1) {
      if (INTENSITY_MODIFIERS.increase.includes(word)) {
        intensity = Math.min(1, intensity * 1.5);
      } else if (INTENSITY_MODIFIERS.decrease.includes(word)) {
        intensity = Math.max(0, intensity * 0.7);
      }
    }
  });
  
  return {
    score,
    label,
    emotion: emotions,
    intensity
  };
};

/**
 * Generate a sentiment summary from analysis results
 * @param results Array of sentiment analysis results
 * @returns A summary object with aggregated sentiment metrics
 */
export const generateSentimentSummary = (results: SentimentResult[]) => {
  if (!results.length) return null;
  
  // Calculate average scores
  const averageScore = results.reduce((sum, result) => sum + result.score, 0) / results.length;
  
  // Count sentiment labels
  const sentimentCounts = {
    positive: results.filter(r => r.label === 'positive').length,
    neutral: results.filter(r => r.label === 'neutral').length,
    negative: results.filter(r => r.label === 'negative').length
  };
  
  // Calculate percentages
  const total = results.length;
  const sentimentPercentages = {
    positive: sentimentCounts.positive / total,
    neutral: sentimentCounts.neutral / total,
    negative: sentimentCounts.negative / total
  };
  
  // Aggregate emotions
  const aggregateEmotions = {
    joy: 0,
    sadness: 0,
    anger: 0,
    surprise: 0,
    fear: 0
  };
  
  let emotionResultsCount = 0;
  
  results.forEach(result => {
    if (result.emotion) {
      emotionResultsCount++;
      for (const emotion in result.emotion) {
        aggregateEmotions[emotion as keyof typeof aggregateEmotions] += 
          result.emotion[emotion as keyof typeof result.emotion];
      }
    }
  });
  
  // Average emotions
  if (emotionResultsCount > 0) {
    for (const emotion in aggregateEmotions) {
      aggregateEmotions[emotion as keyof typeof aggregateEmotions] /= emotionResultsCount;
    }
  }
  
  // Calculate average intensity
  const averageIntensity = results
    .filter(r => r.intensity !== undefined)
    .reduce((sum, r) => sum + (r.intensity || 0), 0) / 
    results.filter(r => r.intensity !== undefined).length;
  
  return {
    averageScore,
    sentimentCounts,
    sentimentPercentages,
    dominantSentiment: Object.entries(sentimentCounts)
      .sort((a, b) => b[1] - a[1])[0][0],
    aggregateEmotions,
    dominantEmotion: Object.entries(aggregateEmotions)
      .sort((a, b) => b[1] - a[1])[0][0],
    averageIntensity
  };
};

/**
 * Generate a natural language summary of sentiment analysis
 * @param summary Sentiment summary data
 * @returns String with natural language description
 */
export const generateSentimentNarrative = (summary: any): string => {
  if (!summary) return 'No sentiment data available.';
  
  const { averageScore, sentimentPercentages, dominantSentiment, dominantEmotion, averageIntensity } = summary;
  
  // Create sentiment description
  let sentimentDesc = '';
  if (averageScore >= 0.5) {
    sentimentDesc = 'very positive';
  } else if (averageScore >= 0.2) {
    sentimentDesc = 'positive';
  } else if (averageScore >= -0.2) {
    sentimentDesc = 'neutral';
  } else if (averageScore >= -0.5) {
    sentimentDesc = 'negative';
  } else {
    sentimentDesc = 'very negative';
  }
  
  // Create intensity description
  let intensityDesc = '';
  if (averageIntensity >= 0.7) {
    intensityDesc = 'strongly';
  } else if (averageIntensity >= 0.4) {
    intensityDesc = 'moderately';
  } else {
    intensityDesc = 'mildly';
  }
  
  // Create percentages description
  const positivePercent = Math.round(sentimentPercentages.positive * 100);
  const neutralPercent = Math.round(sentimentPercentages.neutral * 100);
  const negativePercent = Math.round(sentimentPercentages.negative * 100);
  
  // Create emotion description
  let emotionDesc = '';
  switch (dominantEmotion) {
    case 'joy':
      emotionDesc = 'happiness and contentment';
      break;
    case 'sadness':
      emotionDesc = 'sadness or disappointment';
      break;
    case 'anger':
      emotionDesc = 'frustration or anger';
      break;
    case 'surprise':
      emotionDesc = 'surprise or astonishment';
      break;
    case 'fear':
      emotionDesc = 'concern or anxiety';
      break;
    default:
      emotionDesc = 'mixed emotions';
  }
  
  // Construct narrative
  return `Your overall sentiment today was ${intensityDesc} ${sentimentDesc}. ${positivePercent}% of your interactions were positive, ${neutralPercent}% were neutral, and ${negativePercent}% were negative. The dominant emotion expressed was ${emotionDesc}.`;
};
