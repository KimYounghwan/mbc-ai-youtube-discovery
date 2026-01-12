
export type VideoDuration = 'any' | 'short' | 'long';

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  channelId: string;
  channelTitle: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  subscriberCount: number;
  viralScore: number; // Ratio of views to subscribers
}

export interface Comment {
  author: string;
  text: string;
  likeCount: number;
  publishedAt: string;
}

export interface AIAnalysis {
  summary: string;
  painPoints: string[];
  trendingKeywords: string[];
  recommendedKeywords: string[]; // 5 specific keywords for next content
  contentIdeas: {
    title: string;
    strategy: string;
    targetAudience: string;
  }[];
}

export interface ScriptOutline {
  keyword: string;
  sections: {
    title: string;
    content: string;
  }[];
}

export interface AppState {
  videos: YouTubeVideo[];
  isLoading: boolean;
  selectedVideo: YouTubeVideo | null;
  analysis: AIAnalysis | null;
  error: string | null;
}
