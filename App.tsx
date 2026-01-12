
import React, { useState, useEffect } from 'react';
import { youtubeService } from './services/youtubeService';
import { geminiService } from './services/geminiService';
import { YouTubeVideo, AIAnalysis, VideoDuration } from './types';
import VideoCard from './components/VideoCard';
import AnalysisModal from './components/AnalysisModal';
import Header from './components/Header';
import KeyManagerBar from './components/KeyManagerBar';

export default function App() {
  const [keyword, setKeyword] = useState('');
  const [duration, setDuration] = useState<VideoDuration>('any');
  const [minViralScore, setMinViralScore] = useState(1.0);
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<YouTubeVideo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // API Key Management
  const [youtubeApiKey, setYoutubeApiKey] = useState<string>(() => localStorage.getItem('youtube_api_key') || '');
  const [geminiApiKey, setGeminiApiKey] = useState<string>(() => localStorage.getItem('gemini_api_key') || '');

  useEffect(() => {
    // Filter videos based on viral score client-side for smoother UX
    setFilteredVideos(videos.filter(v => v.viralScore >= minViralScore));
  }, [videos, minViralScore]);

  const handleYoutubeKeyChange = (val: string) => {
    setYoutubeApiKey(val);
    localStorage.setItem('youtube_api_key', val);
  };

  const handleGeminiKeyChange = (val: string) => {
    setGeminiApiKey(val);
    localStorage.setItem('gemini_api_key', val);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) return;

    if (!youtubeApiKey) {
      setError("상단 바에 YouTube API 키를 먼저 입력해주세요.");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const results = await youtubeService.searchVideos(keyword, youtubeApiKey, duration);
      setVideos(results);
    } catch (err: any) {
      setError(err.message || "영상 검색에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyze = async (video: YouTubeVideo) => {
    setSelectedVideo(video);
    setIsAnalyzing(true);
    setError(null);
    try {
      const comments = await youtubeService.getVideoComments(video.id, youtubeApiKey);
      const result = await geminiService.analyzeVideo(video, comments, geminiApiKey);
      setAnalysis(result);
    } catch (err: any) {
      setError(err.message || "AI 분석에 실패했습니다.");
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen pb-12 bg-slate-50">
      <KeyManagerBar 
        youtubeKey={youtubeApiKey}
        geminiKey={geminiApiKey}
        onYoutubeKeyChange={handleYoutubeKeyChange}
        onGeminiKeyChange={handleGeminiKeyChange}
      />
      
      <Header 
        keyword={keyword} 
        setKeyword={setKeyword} 
        duration={duration}
        setDuration={setDuration}
        minViralScore={minViralScore}
        setMinViralScore={setMinViralScore}
        onSearch={handleSearch} 
        isLoading={isLoading}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8 flex items-center justify-between animate-in slide-in-from-top-2">
            <div className="flex items-center">
              <i className="fas fa-exclamation-circle text-red-400 mr-3"></i>
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600">
              <i className="fas fa-times"></i>
            </button>
          </div>
        )}

        {filteredVideos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredVideos.map((video) => (
              <VideoCard 
                key={video.id} 
                video={video} 
                onAnalyze={() => handleAnalyze(video)} 
              />
            ))}
          </div>
        ) : (
          !isLoading && (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200 shadow-sm">
              <div className="bg-slate-50 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-magic text-3xl text-slate-300"></i>
              </div>
              <h2 className="text-xl font-black text-slate-800">어떤 소재를 분석해볼까요?</h2>
              <p className="text-slate-400 mt-2 max-w-sm mx-auto text-sm leading-relaxed">
                키워드 입력 후 <b>검색</b>을 누르면 바이럴 성적이 좋은 영상을 찾아드립니다. 필터를 사용해 숏폼이나 특정 효율 이상의 영상만 골라볼 수도 있습니다.
              </p>
            </div>
          )
        )}

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="h-16 w-16 rounded-full border-4 border-slate-100 border-t-red-600 animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <i className="fab fa-youtube text-red-600 text-xl"></i>
              </div>
            </div>
            <p className="mt-4 text-slate-500 font-black">실시간 유튜브 데이터 스캔 중...</p>
          </div>
        )}
      </main>

      {selectedVideo && (
        <AnalysisModal 
          video={selectedVideo} 
          analysis={analysis} 
          isAnalyzing={isAnalyzing} 
          geminiKey={geminiApiKey}
          onClose={() => {
            setSelectedVideo(null);
            setAnalysis(null);
          }}
        />
      )}
    </div>
  );
}
