
import { GoogleGenAI, Type } from "@google/genai";
import { RecommendationResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getDailyRecommendations = async (userTheme: string): Promise<RecommendationResponse> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Recommend 7 songs for a daily commute based on the theme: "${userTheme}".
    Constraints:
    1. Exactly 5 songs must be Korean (K-POP/K-Indie/K-Ballad).
    2. Exactly 2 songs must be International (Pop/Rock/Jazz/etc).
    3. Provide a brief reason for each choice suitable for subway/bus travel.
    4. Generate a YouTube search link for each (format: https://www.youtube.com/results?search_query=Artist+Song+Title).`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          date: { type: Type.STRING },
          theme: { type: Type.STRING },
          songs: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                artist: { type: Type.STRING },
                category: { type: Type.STRING, enum: ["K-POP", "GLOBAL"] },
                reason: { type: Type.STRING },
                youtubeUrl: { type: Type.STRING }
              },
              required: ["title", "artist", "category", "reason", "youtubeUrl"]
            }
          }
        },
        required: ["date", "theme", "songs"]
      }
    }
  });

  return JSON.parse(response.text || '{}') as RecommendationResponse;
};
