
import { GoogleGenAI, Type } from "@google/genai";
import { AIAnalysis, YouTubeVideo, Comment, ScriptOutline } from "../types";

export const geminiService = {
  async analyzeVideo(video: YouTubeVideo, comments: Comment[], apiKey?: string): Promise<AIAnalysis> {
    const effectiveKey = apiKey || process.env.API_KEY;
    if (!effectiveKey) throw new Error("Gemini API 키가 없습니다.");

    const ai = new GoogleGenAI({ apiKey: effectiveKey });
    
    const commentsText = comments.map(c => `- ${c.text}`).join('\n');
    const prompt = `
      유튜브 비디오 분석 및 콘텐츠 기획 전문가로서 다음 데이터를 분석해주세요.
      모든 응답은 한국어로 작성하세요.

      비디오 제목: ${video.title}
      설명: ${video.description}
      Viral Score: ${video.viralScore}
      
      댓글 내용:
      ${commentsText}
      
      작업 내용:
      1. 영상의 인기 비결 요약 (summary)
      2. 시청자들의 구체적인 반응과 니즈 (painPoints)
      3. 검색 트렌드 키워드 (trendingKeywords)
      4. 다음 콘텐츠로 제작할만한 핵심 추천 키워드 '딱 5개' (recommendedKeywords)
      5. 3가지 구체적인 콘텐츠 기획안 (contentIdeas)
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            painPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
            trendingKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendedKeywords: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Exactly 5 keywords" },
            contentIdeas: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  strategy: { type: Type.STRING },
                  targetAudience: { type: Type.STRING }
                },
                required: ["title", "strategy", "targetAudience"]
              }
            }
          },
          required: ["summary", "painPoints", "trendingKeywords", "recommendedKeywords", "contentIdeas"]
        }
      }
    });

    return JSON.parse(response.text);
  },

  async generateScriptOutline(keyword: string, videoTitle: string, apiKey?: string): Promise<ScriptOutline> {
    const effectiveKey = apiKey || process.env.API_KEY;
    if (!effectiveKey) throw new Error("Gemini API 키가 없습니다.");

    const ai = new GoogleGenAI({ apiKey: effectiveKey });
    
    const prompt = `
      키워드 "${keyword}"를 주제로 하는 유튜브 영상의 대본 목차를 작성해주세요.
      원본 참고 영상 제목: "${videoTitle}"
      
      요청 사항:
      1. 도입부(Hook), 본론(3~4단계), 결론(CTA), 핵심 팁 섹션으로 구성할 것.
      2. 각 섹션마다 구체적으로 어떤 내용을 말해야 하는지 1~2문장으로 설명할 것.
      3. 모든 내용은 한국어로 작성할 것.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            keyword: { type: Type.STRING },
            sections: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  content: { type: Type.STRING }
                },
                required: ["title", "content"]
              }
            }
          },
          required: ["keyword", "sections"]
        }
      }
    });

    return JSON.parse(response.text);
  }
};
