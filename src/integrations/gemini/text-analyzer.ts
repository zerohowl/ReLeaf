import { GoogleGenerativeAI } from "@google/generative-ai";

interface AnalysisResult {
  itemName: string;
  isRecyclable: boolean;
  material: string;
  disposalInstructions: string;
  additionalTips?: string;
}

const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;  // loaded from Vite .env

console.log('Gemini API Key status:', geminiApiKey ? 'Key is present' : 'Key is missing');

const genAI = new GoogleGenerativeAI(geminiApiKey || '');

export const analyzeItemText = async (description: string): Promise<AnalysisResult> => {
  try {
    console.log('Starting analysis with API key status:', geminiApiKey ? 'Available' : 'Not available');
    
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

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", generationConfig: { temperature: 0 } });
    
    // Construct a prompt that will help identify the item and its recyclability
    const prompt = `
    Based on this description: "${description}", identify the item, determine whether it's recyclable, and provide disposal instructions.
    Respond only with the JSON object in this exact schema (no extra commentary):

    {
      "itemName": "Name of the item",
      "isRecyclable": true or false,
      "material": "Main material(s)",
      "disposalInstructions": "Proper disposal instructions",
      "additionalTips": "Optional eco-friendly tips"
    }
    `;

    console.log('Sending to Gemini:', description);
    
    const result = await model.generateContent(prompt);
    const responseText = await result.response.text();
    
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