
import { GoogleGenerativeAI } from "@google/generative-ai";

interface AnalysisResult {
  isCorrect: boolean;
  confidence: number;
  objectType?: string;
  isRecyclable?: boolean;
  explanation?: string;
}

const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
const genAI = new GoogleGenerativeAI(geminiApiKey || '');

const analyzeRecyclingAction = async (imageOrVideoBase64: string, isVideo: boolean): Promise<AnalysisResult> => {
  try {
    const base64Data = imageOrVideoBase64.split(',')[1];
    if (!base64Data) {
      throw new Error('Invalid base64 data format');
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

    if (!isVideo) {
      // First prompt: Validate if the image contains trash/recyclable items
      const validationPrompt = `Analyze this image and determine if it shows a discardable item or trash. 
      Respond only with:
      1. "yes" if the image clearly shows trash, recyclables, or discardable items
      2. "no" if the image doesn't show any trash or recyclable items
      3. Include the type of object you see in parentheses`;

      const validationResult = await model.generateContent([
        validationPrompt,
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: base64Data
          }
        }
      ]);

      const validationResponse = validationResult.response.text().toLowerCase();
      console.log('Validation response:', validationResponse);

      if (!validationResponse.includes('yes')) {
        return {
          isCorrect: false,
          confidence: 0.9,
          explanation: "The image doesn't appear to show any recyclable or trash items. Please upload an image of the item you want to check.",
        };
      }

      // Extract object type from validation response
      const objectMatch = validationResponse.match(/\((.*?)\)/);
      const objectType = objectMatch ? objectMatch[1] : 'unidentified object';

      // Second prompt: Analyze recyclability
      const recyclabilityPrompt = `Analyze this image of ${objectType} and determine if it's recyclable. Consider:

      Common recyclable materials:
      - Clean paper and cardboard
      - Plastic bottles and containers (PET, HDPE)
      - Glass bottles and jars
      - Metal cans and aluminum
      - Clean, dry packaging

      Non-recyclable materials:
      - Food-contaminated items
      - Plastic bags and films
      - Styrofoam
      - Electronics
      - Hazardous waste

      Respond in this format:
      1. "recyclable" or "not recyclable"
      2. Brief explanation in parentheses`;

      const recyclabilityResult = await model.generateContent([
        recyclabilityPrompt,
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: base64Data
          }
        }
      ]);

      const recyclabilityResponse = recyclabilityResult.response.text().toLowerCase();
      console.log('Recyclability response:', recyclabilityResponse);

      const isRecyclable = recyclabilityResponse.includes('recyclable') && !recyclabilityResponse.includes('not recyclable');
      const explanationMatch = recyclabilityResponse.match(/\((.*?)\)/);
      const explanation = explanationMatch ? explanationMatch[1] : '';

      return {
        isCorrect: true,
        confidence: 0.8,
        objectType,
        isRecyclable,
        explanation
      };
    }

    // For videos, keep existing video analysis logic
    const prompt = `Analyze this video and determine if the person correctly disposed of the material in the appropriate recycling or waste bin.
    
    For a correct disposal:
    1. Recyclable materials (like plastic bottles, paper, cardboard, aluminum cans) should go in recycling bins
    2. Food waste and non-recyclable materials should go in trash bins
    3. The person should be placing the item fully into the correct bin
    
    Only respond with 'yes' if you're confident the disposal is correct, or 'no' if it's incorrect or you're unsure.`;

    console.log(`Analyzing video with Gemini...`);

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: "video/mp4",
          data: base64Data
        }
      }
    ]);

    const response = result.response.text().toLowerCase().trim();
    console.log('Gemini video response:', response);
    
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

