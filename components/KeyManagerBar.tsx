
import React from 'react';

interface KeyManagerBarProps {
  youtubeKey: string;
  geminiKey: string;
  onYoutubeKeyChange: (val: string) => void;
  onGeminiKeyChange: (val: string) => void;
}

const KeyManagerBar: React.FC<KeyManagerBarProps> = ({ 
  youtubeKey, 
  geminiKey, 
  onYoutubeKeyChange, 
  onGeminiKeyChange 
}) => {
  return (
    <div className="bg-slate-900 text-white px-4 py-2 border-b border-slate-700">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-4 text-xs">
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <label className="font-bold text-slate-400 whitespace-nowrap">
            <i className="fab fa-youtube mr-1 text-red-500"></i> YouTube API 키:
          </label>
          <input
            type="password"
            value={youtubeKey}
            onChange={(e) => onYoutubeKeyChange(e.target.value)}
            placeholder="YouTube Data API 키를 입력하세요"
            className={`flex-1 bg-slate-800 border ${youtubeKey ? 'border-slate-600' : 'border-red-500/50'} rounded px-2 py-1 outline-none focus:border-red-500 transition-colors`}
          />
        </div>
        
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <label className="font-bold text-slate-400 whitespace-nowrap">
            <i className="fas fa-brain mr-1 text-purple-400"></i> Gemini API 키:
          </label>
          <input
            type="password"
            value={geminiKey}
            onChange={(e) => onGeminiKeyChange(e.target.value)}
            placeholder="Gemini API 키를 입력하세요 (환경변수 우선)"
            className={`flex-1 bg-slate-800 border ${geminiKey ? 'border-slate-600' : 'border-purple-500/50'} rounded px-2 py-1 outline-none focus:border-purple-500 transition-colors`}
          />
        </div>

        <div className="hidden sm:flex items-center text-slate-500 italic">
          <i className="fas fa-lock mr-1"></i> 키는 브라우저에만 저장됩니다
        </div>
      </div>
    </div>
  );
};

export default KeyManagerBar;
