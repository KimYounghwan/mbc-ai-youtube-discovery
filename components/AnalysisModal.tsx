
import React, { useState } from 'react';
import { YouTubeVideo, AIAnalysis, ScriptOutline } from '../types';
import { geminiService } from '../services/geminiService';

interface AnalysisModalProps {
  video: YouTubeVideo;
  analysis: AIAnalysis | null;
  isAnalyzing: boolean;
  onClose: () => void;
  geminiKey: string;
}

const AnalysisModal: React.FC<AnalysisModalProps> = ({ video, analysis, isAnalyzing, onClose, geminiKey }) => {
  const [selectedKeyword, setSelectedKeyword] = useState<string | null>(null);
  const [scriptOutline, setScriptOutline] = useState<ScriptOutline | null>(null);
  const [isGeneratingOutline, setIsGeneratingOutline] = useState(false);

  const handleKeywordClick = async (keyword: string) => {
    setSelectedKeyword(keyword);
    setScriptOutline(null);
    setIsGeneratingOutline(true);
    try {
      const outline = await geminiService.generateScriptOutline(keyword, video.title, geminiKey);
      setScriptOutline(outline);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingOutline(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b flex items-center justify-between shrink-0 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 text-purple-600 p-2 rounded-lg">
              <i className="fas fa-wand-magic-sparkles"></i>
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">AI 콘텐츠 발굴 보고서</h2>
              <p className="text-[10px] text-slate-500 truncate max-w-[300px]">{video.title}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-2">
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {isAnalyzing ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="relative">
                <div className="h-20 w-20 rounded-full border-4 border-slate-100 border-t-purple-600 animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <i className="fas fa-brain text-purple-600 animate-pulse text-xl"></i>
                </div>
              </div>
              <h3 className="mt-8 text-xl font-black text-slate-800">Gemini가 댓글을 정밀 분석 중입니다...</h3>
              <p className="mt-2 text-slate-500 text-sm">잠시만 기다려주시면 통찰력 있는 소재를 제안해 드릴게요.</p>
            </div>
          ) : analysis ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {/* Left Column: Analysis Results */}
              <div className="lg:col-span-2 space-y-8">
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="h-6 w-1 bg-purple-600 rounded-full"></span>
                    <h3 className="font-black text-slate-800 text-sm">핵심 인기 전략 요약</h3>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 text-slate-700 leading-relaxed text-sm italic">
                    "{analysis.summary}"
                  </div>
                </section>

                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="h-6 w-1 bg-red-500 rounded-full"></span>
                    <h3 className="font-black text-slate-800 text-sm">시청자 리액션 및 니즈</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {analysis.painPoints.map((point, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 bg-white border border-slate-100 rounded-xl shadow-sm text-xs text-slate-600">
                        <i className="fas fa-check-circle text-emerald-500 mt-0.5"></i>
                        {point}
                      </div>
                    ))}
                  </div>
                </section>

                <section className="bg-emerald-50/50 p-6 rounded-3xl border border-emerald-100">
                  <div className="flex items-center gap-2 mb-6">
                    <span className="h-6 w-1 bg-emerald-600 rounded-full"></span>
                    <h3 className="font-black text-slate-800 text-sm">✨ 강력 추천 키워드 (하나를 선택해 목차를 만드세요)</h3>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {analysis.recommendedKeywords.map((kw, idx) => (
                      <button 
                        key={idx}
                        onClick={() => handleKeywordClick(kw)}
                        className={`px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all ${selectedKeyword === kw ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg scale-105' : 'bg-white border-emerald-100 text-emerald-700 hover:border-emerald-300'}`}
                      >
                        <i className="fas fa-tag mr-2 opacity-50"></i>
                        {kw}
                      </button>
                    ))}
                  </div>

                  {/* Script Outline Section */}
                  <div className="mt-8">
                    {isGeneratingOutline ? (
                      <div className="py-12 flex flex-col items-center justify-center bg-white rounded-2xl border border-dashed border-emerald-200">
                        <div className="h-8 w-8 border-2 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-4"></div>
                        <p className="text-xs font-bold text-emerald-600">"{selectedKeyword}"에 최적화된 목차 생성 중...</p>
                      </div>
                    ) : scriptOutline ? (
                      <div className="bg-white rounded-2xl border border-emerald-100 overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="bg-emerald-600 px-5 py-3 flex items-center justify-between">
                          <h4 className="text-white font-black text-sm">[{scriptOutline.keyword}] 영상 대본 목차</h4>
                          <span className="text-[10px] text-emerald-100 bg-white/10 px-2 py-1 rounded">AI Generated</span>
                        </div>
                        <div className="p-5 space-y-4">
                          {scriptOutline.sections.map((section, idx) => (
                            <div key={idx} className="relative pl-6 border-l-2 border-emerald-50">
                              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-emerald-100 border-2 border-white flex items-center justify-center">
                                <span className="text-[8px] font-bold text-emerald-600">{idx+1}</span>
                              </div>
                              <h5 className="font-bold text-slate-800 text-xs mb-1">{section.title}</h5>
                              <p className="text-xs text-slate-500 leading-relaxed">{section.content}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : selectedKeyword && (
                      <div className="py-8 text-center text-slate-400 text-xs">
                        목차를 불러오는 중 오류가 발생했습니다.
                      </div>
                    )}
                  </div>
                </section>
              </div>

              {/* Right Column: Mini Ideas */}
              <div className="space-y-6">
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="h-6 w-1 bg-blue-500 rounded-full"></span>
                    <h3 className="font-black text-slate-800 text-sm">연관 트렌드</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {analysis.trendingKeywords.map((kw, idx) => (
                      <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-600 rounded-md text-[10px] font-bold">#{kw}</span>
                    ))}
                  </div>
                </section>

                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="h-6 w-1 bg-amber-500 rounded-full"></span>
                    <h3 className="font-black text-slate-800 text-sm">기획안 미리보기</h3>
                  </div>
                  <div className="space-y-3">
                    {analysis.contentIdeas.map((idea, idx) => (
                      <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <h4 className="font-bold text-slate-800 text-xs mb-2">{idea.title}</h4>
                        <p className="text-[10px] text-slate-500 mb-2">{idea.strategy}</p>
                        <div className="text-[9px] font-bold text-amber-600 bg-amber-100/50 px-2 py-1 rounded inline-block">
                          {idea.targetAudience}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t flex justify-end">
          <button 
            onClick={onClose}
            className="px-8 py-2.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors text-xs"
          >
            확인 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalysisModal;
