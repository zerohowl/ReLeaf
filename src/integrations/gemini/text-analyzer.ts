
import { GoogleGenerativeAI } from "@google/generative-ai";

interface AnalysisResult {
  itemName: string;
  isRecyclable: boolean;
  material: string;
  disposalInstructions: string;
  additionalTips?: string;
}

const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(geminiApiKey || '');

export const analyzeItemText = async (description: string): Promise<AnalysisResult> => {
  try {
    if (!geminiApiKey) {
      console.error('No Gemini API key provided');
      return {
        itemName: description,
        isRecyclable: false,
        material: 'Unknown',
        disposalInstructions: 'API key required for detailed analysis',
        additionalTips: 'Please add a Gemini API key in your environment variables (VITE_GEMINI_API_KEY)'
      };
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    // Construct a prompt that will help identify the item and its recyclability
    const prompt = `
    Based on this description: "${description}", I need you to identify the item, determine whether it's recyclable, 
    and provide disposal instructions. Format your response as JSON with these fields:
    
    {
      "itemName": "Name of the identified item",
      "isRecyclable": true or false,
      "material": "Main material(s) of the item",
      "disposalInstructions": "Brief instructions on how to properly dispose of or recycle this item",
      "additionalTips": "Optional eco-friendly alternatives or sustainability tips related to this item"
    }
    
    Focus on clear, accurate recycling information. If you can't identify the item confidently, make your best guess
    but note any uncertainty in the description.
    `;

    console.log('Sending to Gemini:', description);
    
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Extract the JSON object from the response
    let jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse Gemini response');
    }
    
    const responseJson = JSON.parse(jsonMatch[0]);
    console.log('Gemini response:', responseJson);
    
    return {
      itemName: responseJson.itemName || 'Unknown item',
      isRecyclable: responseJson.isRecyclable === true,
      material: responseJson.material || 'Unknown material',
      disposalInstructions: responseJson.disposalInstructions || 'No disposal instructions available',
      additionalTips: responseJson.additionalTips || undefined
    };
  } catch (error) {
    console.error('Error in analyzeItemText:', error);
    // Return a fallback response when an error occurs
    return {
      itemName: description || 'Unknown item',
      isRecyclable: false,
      material: 'Could not determine',
      disposalInstructions: 'Analysis failed. Try a more detailed description or check your API key.',
      additionalTips: 'Make sure your VITE_GEMINI_API_KEY environment variable is set correctly.'
    };
  }
};
