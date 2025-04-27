// settingsService.ts - Handles user settings API interactions
import { getToken } from './authService';

const API_URL = 'http://localhost:4000/api';

// Get auth headers from token
const getAuthHeaders = () => {
  const token = getToken();
  return {
    'Authorization': `Bearer ${token}`
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

// Retry logic for API requests
const fetchWithRetry = async (url: string, options: RequestInit, retries: number = 3) => {
  let lastError;
  for (let i = 0; i < retries; i++) {
    try {
      return await fetch(url, options);
    } catch (error) {
      lastError = error;
      await new Promise(resolve => setTimeout(resolve, 500)); // Wait before retrying
    }
  }
  throw lastError;
};

// Interface for settings
export interface UserSettings {
  public_profile: boolean;
}

// Get user settings
export async function getSettings(): Promise<UserSettings> {
  try {
    const response = await fetchWithRetry(`${API_URL}/settings`, {
      headers: getAuthHeaders()
    }, 2);
    
    return handleResponse(response);
  } catch (error: any) {
    console.error('Error fetching user settings:', error);
    // Return default settings if there's an error
    return {
      public_profile: true
    };
  }
}

// Update privacy settings
export async function updatePrivacy(isPublic: boolean): Promise<UserSettings> {
  try {
    const response = await fetchWithRetry(`${API_URL}/settings/privacy`, {
      method: 'PUT',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ public_profile: isPublic })
    }, 2);
    
    return handleResponse(response);
  } catch (error: any) {
    console.error('Error updating privacy settings:', error);
    throw new Error(error.message || 'Failed to update privacy settings');
  }
}

// Reset user data
export async function resetUserData(): Promise<{message: string}> {
  try {
    const response = await fetchWithRetry(`${API_URL}/settings/reset`, {
      method: 'POST',
      headers: getAuthHeaders()
    }, 1);
    
    return handleResponse(response);
  } catch (error: any) {
    console.error('Error resetting user data:', error);
    throw new Error(error.message || 'Failed to reset user data');
  }
}
