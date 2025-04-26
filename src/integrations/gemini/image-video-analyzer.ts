
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
    // Remove the data URL prefix to get just the base64 content
    const base64Data = imageOrVideoBase64.split(',')[1];
    if (!base64Data) {
      throw new Error('Invalid base64 data format');
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

    const prompt = `Analyze this ${isVideo ? 'video' : 'image'} and determine if the person correctly disposed of the material in the appropriate recycling or waste bin.
    
    For a correct disposal:
    1. Recyclable materials (like plastic bottles, paper, cardboard, aluminum cans) should go in recycling bins
    2. Food waste and non-recyclable materials should go in trash bins
    3. The person should be placing the item fully into the correct bin
    
    Only respond with 'yes' if you're confident the disposal is correct, or 'no' if it's incorrect or you're unsure.`;

    console.log(`Analyzing ${isVideo ? 'video' : 'image'} with Gemini...`);

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: isVideo ? "video/mp4" : "image/jpeg",
          data: base64Data
        }
      }
    ]);

    const response = result.response.text().toLowerCase().trim();
    console.log('Gemini response:', response);
    
    // Handle various response formats by checking if the response contains 'yes' or 'no'
    const isCorrect = response.includes('yes');
    const confidence = response.includes('yes') || response.includes('no') ? 0.8 : 0.5;
    
    return {
      isCorrect,
      confidence
    };
  } catch (error) {
    console.error('Error analyzing with Gemini:', error);
    throw error;
  }
};

export { analyzeRecyclingAction };
