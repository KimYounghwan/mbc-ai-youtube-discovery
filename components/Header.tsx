
import React from 'react';
import { VideoDuration } from '../types';

interface HeaderProps {
  keyword: string;
  setKeyword: (val: string) => void;
  duration: VideoDuration;
  setDuration: (val: VideoDuration) => void;
  minViralScore: number;
  setMinViralScore: (val: number) => void;
  onSearch: (e: React.FormEvent) => void;
  isLoading: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  keyword, setKeyword, 
  duration, setDuration, 
  minViralScore, setMinViralScore,
  onSearch, isLoading 
}) => {
  return (
    <header className="bg-white border-b sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="bg-red-600 text-white p-2 rounded-lg">
                <i className="fab fa-youtube text-2xl"></i>
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900">유튜브 소재 <span className="text-red-600">발굴기</span></h1>
                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">시청자가 반응하는 황금 소재 탐색기</p>
              </div>
            </div>

            <form onSubmit={onSearch} className="flex-1 max-w-2xl flex gap-2">
              <div className="relative group flex-1">
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="분석할 키워드를 입력하세요..."
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500 rounded-xl transition-all outline-none text-sm"
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-500 transition-colors">
                  <i className="fas fa-search"></i>
                </div>
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 disabled:bg-slate-300 transition-colors"
                >
                  {isLoading ? '검색 중' : '검색'}
                </button>
              </div>
            </form>
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-500">영상 길이:</span>
              <div className="flex bg-slate-100 p-1 rounded-lg">
                {(['any', 'short', 'long'] as const).map((d) => (
                  <button
                    key={d}
                    onClick={() => setDuration(d)}
                    className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${duration === d ? 'bg-white text-red-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                  >
                    {d === 'any' ? '전체' : d === 'short' ? '숏폼' : '롱폼'}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 flex-1 max-w-xs">
              <span className="text-xs font-bold text-slate-500 whitespace-nowrap">최소 바이럴 비율:</span>
              <input 
                type="range" 
                min="0" max="5" step="0.5" 
                value={minViralScore} 
                onChange={(e) => setMinViralScore(parseFloat(e.target.value))}
                className="w-full accent-red-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
              <span className="text-xs font-black text-red-600 w-8">{minViralScore}x</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
