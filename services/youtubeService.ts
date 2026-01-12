
import { YouTubeVideo, Comment, VideoDuration } from '../types';

const BASE_URL = 'https://www.googleapis.com/youtube/v3';

export const youtubeService = {
  async searchVideos(keyword: string, apiKey: string, duration: VideoDuration = 'any'): Promise<YouTubeVideo[]> {
    if (!apiKey) throw new Error("YouTube API Key is missing. Please set it in settings.");

    // YouTube API videoDuration: 'any', 'short' (under 4 min), 'medium' (4-20 min), 'long' (over 20 min)
    const durationParam = duration === 'any' ? '' : `&videoDuration=${duration}`;
    
    const searchRes = await fetch(
      `${BASE_URL}/search?part=snippet&maxResults=20&q=${encodeURIComponent(keyword)}&type=video${durationParam}&key=${apiKey}`
    );
    const searchData = await searchRes.json();
    
    if (searchData.error) throw new Error(searchData.error.message);

    const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',');
    
    // Get video stats
    const videoStatsRes = await fetch(
      `${BASE_URL}/videos?part=statistics&id=${videoIds}&key=${apiKey}`
    );
    const videoStatsData = await videoStatsRes.json();

    const channelIds = searchData.items.map((item: any) => item.snippet.channelId).join(',');
    
    // Get channel stats for subscriber count
    const channelStatsRes = await fetch(
      `${BASE_URL}/channels?part=statistics&id=${channelIds}&key=${apiKey}`
    );
    const channelStatsData = await channelStatsRes.json();

    const channelMap = new Map();
    channelStatsData.items.forEach((item: any) => {
      channelMap.set(item.id, parseInt(item.statistics.subscriberCount) || 1);
    });

    return searchData.items.map((item: any, index: number) => {
      const stats = videoStatsData.items.find((v: any) => v.id === item.id.videoId)?.statistics;
      const views = parseInt(stats?.viewCount) || 0;
      const subs = channelMap.get(item.snippet.channelId) || 1;
      
      return {
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.high.url,
        publishedAt: item.snippet.publishedAt,
        channelId: item.snippet.channelId,
        channelTitle: item.snippet.channelTitle,
        viewCount: views,
        likeCount: parseInt(stats?.likeCount) || 0,
        commentCount: parseInt(stats?.commentCount) || 0,
        subscriberCount: subs,
        viralScore: parseFloat((views / subs).toFixed(2))
      };
    }).sort((a: YouTubeVideo, b: YouTubeVideo) => b.viralScore - a.viralScore);
  },

  async getVideoComments(videoId: string, apiKey: string): Promise<Comment[]> {
    if (!apiKey) throw new Error("YouTube API Key is missing.");

    const res = await fetch(
      `${BASE_URL}/commentThreads?part=snippet&videoId=${videoId}&maxResults=50&order=relevance&key=${apiKey}`
    );
    const data = await res.json();
    if (data.error) return [];
    
    return data.items.map((item: any) => ({
      author: item.snippet.topLevelComment.snippet.authorDisplayName,
      text: item.snippet.topLevelComment.snippet.textDisplay,
      likeCount: item.snippet.topLevelComment.snippet.likeCount,
      publishedAt: item.snippet.topLevelComment.snippet.publishedAt,
    }));
  }
};
