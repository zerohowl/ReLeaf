// analysisService.ts - Handles AI analysis through our secure backend
import { getToken } from './authService';

const API_URL = 'http://localhost:4000/api';

// Get auth headers from token
const getAuthHeaders = () => {
  const token = getToken();
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || response.statusText);
  }
  return response.json();
};

// Interface for analysis results
export interface AnalysisResult {
  isCorrect: boolean;
  confidence: number;
  objectType?: string;
  isRecyclable?: boolean;
  explanation?: string;
}

/**
 * Analyzes an image or video using the backend AI service
 * Securely handles the API key on the server side
 */
export async function analyzeMedia(
  mediaBase64: string, 
  isVideo: boolean = false
): Promise<AnalysisResult> {
  try {
    // Call our secure backend endpoint instead of Gemini directly
    const response = await fetch(`${API_URL}/ai/analyze`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ 
        mediaBase64,
        isVideo
      })
    });
    
    return handleResponse(response);
  } catch (error: any) {
    console.error('Error analyzing media:', error);
    
    // Return a friendly error result
    return {
      isCorrect: false,
      confidence: 0,
      explanation: error.message || 'Unable to analyze the media. Please try again.'
    };
  }
}
