
import React from 'react';
import { YouTubeVideo } from '../types';

interface VideoCardProps {
  video: YouTubeVideo;
  onAnalyze: () => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onAnalyze }) => {
  const formatNumber = (num: number) => {
    if (num >= 10000) return (num / 10000).toFixed(1) + '만';
    if (num >= 1000) return (num / 1000).toFixed(1) + '천';
    return num;
  };

  const getScoreColor = (score: number) => {
    if (score > 1.0) return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    if (score > 0.5) return 'bg-blue-100 text-blue-700 border-blue-200';
    return 'bg-slate-100 text-slate-600 border-slate-200';
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 hover:shadow-xl transition-all duration-300 group">
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={video.thumbnail} 
          alt={video.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-2 right-2 flex gap-1">
          <span className={`px-2 py-1 rounded-md text-[10px] font-bold border ${getScoreColor(video.viralScore)}`}>
            구독자 대비 조회수: {video.viralScore}배
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-slate-800 line-clamp-2 min-h-[3rem] mb-2 leading-tight text-sm" dangerouslySetInnerHTML={{__html: video.title}} />
        
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
            <i className="fas fa-user text-[10px]"></i>
          </div>
          <span className="text-xs font-medium text-slate-500 truncate">{video.channelTitle}</span>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4 border-y border-slate-50 py-3">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">조회수</span>
            <span className="text-xs font-semibold text-slate-700">{formatNumber(video.viewCount)}회</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">구독자</span>
            <span className="text-xs font-semibold text-slate-700">{formatNumber(video.subscriberCount)}명</span>
          </div>
        </div>

        <button 
          onClick={onAnalyze}
          className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
        >
          <i className="fas fa-wand-sparkles"></i>
          AI 소재 분석하기
        </button>
      </div>
    </div>
  );
};

export default VideoCard;
