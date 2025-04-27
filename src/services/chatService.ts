// chatService.ts - Handles communication with the chat backend service
import { getToken } from './authService';

// Determine the API URL based on the current environment
const API_URL = window.location.hostname.includes('localhost') 
  ? 'http://localhost:4000/api'
  : '/api';

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
export async function sendChatMessage(message: string): Promise<AgentResponse> {
  try {
    console.log(`Sending chat message to: ${API_URL}/chat`);
    
    // Call our secure backend endpoint
    const response = await fetch(`${API_URL}/chat`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ message }),
      credentials: 'include',  // Include cookies for CORS requests
      mode: 'cors'            // Explicitly request CORS mode
    });
    
    return handleResponse(response);
  } catch (error: any) {
    console.error('Error sending chat message:', error);
    
    // Return a friendly error response with more details
    return {
      text: `Connection error: ${error.message || 'Unable to connect to the chat server'}. Please ensure the backend server is running at ${API_URL}`,
      sourceType: 'error'
    };
  }
}
