// analysisController.ts - Handles AI-based analysis functions
import { PrismaClient } from '@prisma/client';
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const prisma = new PrismaClient();

// Get Gemini API key from environment variables (secure)
const geminiApiKey = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(geminiApiKey);

interface AnalysisResult {
  isCorrect: boolean;
  confidence: number;
  objectType?: string;
  isRecyclable?: boolean;
  explanation?: string;
}

/**
 * Analyze an image or video for recycling information
 */
export const analyzeMedia = async (req: any, res: any) => {
  try {
    const { mediaBase64, isVideo } = req.body;
    
    if (!mediaBase64) {
      return res.status(400).send('Missing media data');
    }

    if (!geminiApiKey) {
      return res.status(500).send('Gemini API key not configured on server');
    }

    const result = await analyzeRecyclingAction(mediaBase64, isVideo === true);
    return res.status(200).json(result);
  } catch (error: any) {
    console.error('Error analyzing media:', error);
    return res.status(500).send(`Analysis failed: ${error.message}`);
  }
};

/**
 * Analyze recycling actions using Google's Gemini API
 */
const analyzeRecyclingAction = async (imageOrVideoBase64: string, isVideo: boolean): Promise<AnalysisResult> => {
  try {
    // Parse DataURL into mimeType and base64 payload
    const [meta, rawBase64] = imageOrVideoBase64.split(",");
    const base64Data = rawBase64 || '';
    const mimeMatch = meta.match(/^data:(.*);base64$/);
    const mimeType = mimeMatch ? mimeMatch[1] : (isVideo ? 'video/mp4' : 'image/jpeg');

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", generationConfig: { temperature: 0 } });

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
            mimeType,
            data: base64Data
          }
        }
      ]);

      const validationText = validationResult.response.text().toLowerCase();
      console.log('Validation result:', validationText);
      
      if (validationText.includes('no')) {
        return {
          isCorrect: false,
          confidence: 0.9,
          explanation: "The image doesn't appear to show a recyclable item or trash. Please upload an image of the item you want to check."
        };
      }

      // Extract object type from validation response if available
      const objectTypeMatch = validationText.match(/\((.*?)\)/);
      const objectType = objectTypeMatch ? objectTypeMatch[1] : undefined;

      // Second prompt: Analyze if the item is recyclable
      const recyclingPrompt = `Analyze this image of ${objectType || 'this item'} and determine if it's recyclable. 
      Respond with JSON in this exact format:
      {
        "isRecyclable": boolean,
        "confidence": number between 0-1,
        "objectType": "specific name of the object",
        "explanation": "detailed explanation about recyclability"
      }`;

      const recyclingResult = await model.generateContent([
        recyclingPrompt,
        {
          inlineData: {
            mimeType,
            data: base64Data
          }
        }
      ]);

      const recyclingText = recyclingResult.response.text();
      console.log('Recycling analysis:', recyclingText);
      
      try {
        // Find JSON in the response
        const jsonMatch = recyclingText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const analysisData = JSON.parse(jsonMatch[0]);
          
          // Apply correction for commonly recyclable materials that might be misclassified
          if (objectType) {
            const lowerObjectType = objectType.toLowerCase();
            
            // Metals are almost always recyclable
            if (lowerObjectType.includes('aluminum') || 
                lowerObjectType.includes('metal') || 
                lowerObjectType.includes('can') || 
                lowerObjectType.includes('tin')) {
              
              console.log(`Correcting recyclability for ${objectType} - metals are recyclable`);
              analysisData.isRecyclable = true;
              
              if (!analysisData.explanation?.includes('recyclable')) {
                analysisData.explanation = `This ${objectType} is recyclable. Metal and aluminum items are among the most valuable recyclable materials and can be recycled indefinitely without loss of quality.`;
              }
            }
          }
          
          return {
            isCorrect: true,
            ...analysisData
          };
        }
      } catch (e) {
        console.error('Error parsing JSON from Gemini response:', e);
      }

      // Fallback if parsing fails
      let isRecyclable = recyclingText.toLowerCase().includes('recyclable');
      let explanation = "This appears to be a recyclable item, but I couldn't determine specific details.";
      
      // Handle common recyclable materials even in fallback case
      if (objectType) {
        const lowerObjectType = objectType.toLowerCase();
        
        // Apply rules for commonly recyclable materials
        if (lowerObjectType.includes('aluminum') || 
            lowerObjectType.includes('metal') || 
            lowerObjectType.includes('can') || 
            lowerObjectType.includes('tin')) {
          
          isRecyclable = true;
          explanation = `This ${objectType} is recyclable. Metal and aluminum items are among the most valuable recyclable materials.`;
        }
      }
      
      return {
        isCorrect: true,
        confidence: 0.7,
        objectType: objectType || 'Unknown item',
        isRecyclable: isRecyclable,
        explanation: explanation
      };
    } else {
      // Video analysis
      const videoPrompt = `Analyze this recycling action video and determine:
      1. If the person is correctly recycling/disposing of an item
      2. What type of item is being handled
      3. If the disposal method is appropriate
      
      Respond with JSON in this exact format:
      {
        "isCorrect": boolean,
        "confidence": number between 0-1,
        "objectType": "type of item being handled",
        "explanation": "explanation about the correctness of the recycling action"
      }`;

      const videoResult = await model.generateContent([
        videoPrompt,
        {
          inlineData: {
            mimeType,
            data: base64Data
          }
        }
      ]);

      const videoText = videoResult.response.text();
      console.log('Video analysis:', videoText);
      
      try {
        // Find JSON in the response
        const jsonMatch = videoText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const analysisData = JSON.parse(jsonMatch[0]);
          return {
            isCorrect: true,
            ...analysisData
          };
        }
      } catch (e) {
        console.error('Error parsing JSON from Gemini response:', e);
      }

      // Fallback if parsing fails
      return {
        isCorrect: true,
        confidence: 0.7,
        objectType: 'Recycling action',
        explanation: "I can see a recycling action in this video, but I couldn't determine specific details."
      };
    }
  } catch (error) {
    console.error('Error analyzing recycling action:', error);
    return {
      isCorrect: false,
      confidence: 0,
      explanation: "I couldn't analyze this media. Please try again with a clearer image or video."
    };
  }
};
