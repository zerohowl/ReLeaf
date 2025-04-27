// chatService.ts - Handles communication with the chat backend service
import { getToken } from './authService';

// Determine the API URL based on the current environment
const API_URL = window.location.hostname.includes('localhost') 
  ? 'http://localhost:4000/api'
  : '/api';

// Time to wait before retries in milliseconds
const RETRY_DELAY = 1000;

// Maximum number of retries
const MAX_RETRIES = 2;

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

export interface AgentResponse {
  text: string;
  sourceType?: string;
  metadata?: any;
}

/**
 * Sends a message to the chat assistant through our secure backend
 * @param message The user's message to the chat assistant
 * @returns AgentResponse containing the assistant's reply
 */
/**
 * Retry wrapper for fetch to handle connection issues
 */
async function fetchWithRetry(url: string, options: RequestInit, retries = MAX_RETRIES): Promise<Response> {
  try {
    return await fetch(url, options);
  } catch (error) {
    if (retries <= 0) throw error;
    
    console.log(`Retrying fetch to ${url}, ${retries} attempts left...`);
    await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
    return fetchWithRetry(url, options, retries - 1);
  }
}

/**
 * Checks if the backend server is available
 * @returns A promise that resolves to a boolean indicating if the server is available
 */
export async function isChatServerAvailable(): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/health`, { method: 'GET', mode: 'cors' });
    return response.ok;
  } catch (error) {
    return false;
  }
}

/**
 * Gets an offline response for common recycling questions
 */
function getOfflineResponse(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  // Common recycling questions and canned responses
  if (lowerMessage.includes('aluminum') || lowerMessage.includes('metal') || lowerMessage.includes('can')) {
    return "Aluminum cans are highly recyclable and can be recycled indefinitely without losing quality. They should always go in your recycling bin.";
  }
  
  if (lowerMessage.includes('plastic')) {
    return "Most plastic bottles and containers marked with numbers 1 (PET) and 2 (HDPE) are widely recyclable. Always rinse them before recycling.";
  }
  
  if (lowerMessage.includes('paper') || lowerMessage.includes('cardboard')) {
    return "Paper and cardboard are recyclable, but should be clean and dry. Avoid recycling greasy or food-contaminated paper products.";
  }
  
  if (lowerMessage.includes('glass')) {
    return "Glass bottles and jars are 100% recyclable and can be recycled endlessly without loss in quality or purity.";
  }
  
  // Default response
  return "I'm currently in offline mode due to server connection issues. For specific recycling questions, please try again later when the backend server is available."
}

/**
 * Sends a message to the chat assistant through our secure backend
 * @param message The user's message to the chat assistant
 * @returns AgentResponse containing the assistant's reply
 */
export async function sendChatMessage(message: string): Promise<AgentResponse> {
  try {
    console.log(`Sending chat message to: ${API_URL}/chat`);
    
    // First check if server is available - do a quick health check
    const isServerAvailable = await isChatServerAvailable();
    
    if (!isServerAvailable) {
      console.log('Chat server unavailable, using offline response');
      // Return canned response for offline mode
      return {
        text: getOfflineResponse(message),
        sourceType: 'offline'
      };
    }
    
    // Call our secure backend endpoint with retry logic
    const response = await fetchWithRetry(`${API_URL}/chat`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ message }),
      credentials: 'include',  // Include cookies for CORS requests
      mode: 'cors'            // Explicitly request CORS mode
    }, MAX_RETRIES);
    
    return handleResponse(response);
  } catch (error: any) {
    console.error('Error sending chat message:', error);
    
    // Return a friendly error response with more details
    return {
      text: `Connection error: Failed to fetch. Please ensure the backend server is running at http://localhost:4000/api`,
      sourceType: 'error'
    };
  }
}
