
import { GoogleGenerativeAI } from "@google/generative-ai";

interface AnalysisResult {
  isCorrect: boolean;
  confidence: number;
}

// Use environment variable from Vite
const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(geminiApiKey || '');

const analyzeRecyclingAction = async (imageOrVideoBase64: string, isVideo: boolean): Promise<AnalysisResult> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

    const prompt = `Analyze this ${isVideo ? 'video' : 'image'} and determine if the person correctly disposed of the material in the appropriate recycling or waste bin. Only respond with 'yes' or 'no'. Base your answer on standard recycling guidelines and visible indicators in the ${isVideo ? 'video' : 'image'}.`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: isVideo ? "video/mp4" : "image/jpeg",
          data: imageOrVideoBase64
        }
      }
    ]);

    const response = result.response.text().toLowerCase().trim();
    return {
      isCorrect: response === 'yes',
      confidence: response === 'yes' || response === 'no' ? 1 : 0
    };
  } catch (error) {
    console.error('Error analyzing with Gemini:', error);
    throw error;
  }
};

export { analyzeRecyclingAction };
