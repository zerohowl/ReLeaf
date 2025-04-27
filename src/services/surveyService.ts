import { getToken } from './authService';

const API_URL = 'http://localhost:4000/api';

export interface SurveyData {
  recyclingExperience: string;
  recyclingGoals: string[];
  homeType?: string;
  homeTemperature?: string;
  stoveType?: string;
  hasVehicle?: boolean;
  vehicleType?: string;
  vehicleMake?: string;
  vehicleModel?: string;
  packageFrequency?: string;
}

export interface PersonalizationData {
  tipCards: TipCard[];
  pointsMultiplier: number;
  recyclingLevel: string;
  preferredTemperature?: string;
  hasVehicle?: boolean;
  vehicleType?: string;
}

export interface TipCard {
  id: number;
  title: string;
  content: string;
  category: string;
}

// Helper to handle API responses
async function handleResponse(response: Response) {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || response.statusText || `Error ${response.status}`);
  }
  return response.json();
}

// Get authentication headers
function getAuthHeaders() {
  const token = getToken();
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
}

// Fetcher function with retry logic
async function fetchWithRetry(url: string, options: RequestInit, retries = 2): Promise<Response> {
  try {
    return await fetch(url, options);
  } catch (err) {
    if (retries <= 0) throw err;
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
    return fetchWithRetry(url, options, retries - 1);
  }
}

// Save or update survey data
export async function saveSurvey(data: SurveyData): Promise<SurveyData> {
  const response = await fetchWithRetry(`${API_URL}/survey`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  }, 1);
  
  return handleResponse(response);
}

// Get survey data
export async function getSurvey(): Promise<SurveyData | null> {
  try {
    const response = await fetchWithRetry(`${API_URL}/survey`, {
      headers: getAuthHeaders()
    }, 1);
    
    if (response.status === 404) {
      return null;
    }
    
    return handleResponse(response);
  } catch (error: any) {
    if (error instanceof Error && error.message.includes('404')) {
      return null;
    }
    console.error('Error fetching survey data:', error);
    const errorMessage = error.message || 'Could not load your preferences';
    throw new Error(`Survey data error: ${errorMessage}`);
  }
}

// Delete survey data
export async function deleteSurvey(): Promise<void> {
  const response = await fetchWithRetry(`${API_URL}/survey`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  }, 1);
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || response.statusText);
  }
}

// Get personalized settings based on survey
export async function getPersonalization(): Promise<PersonalizationData> {
  try {
    const response = await fetchWithRetry(`${API_URL}/personalization`, {
      headers: getAuthHeaders()
    }, 1);
    
    return handleResponse(response);
  } catch (error: any) {
    console.error('Error fetching personalization:', error);
    // Return default values instead of throwing an error
    // This ensures the app can still function even if personalization fails
    return {
      tipCards: [],
      pointsMultiplier: 1.0,
      recyclingLevel: 'beginner'
    };
  }
  // This code is now unreachable because of the return in the try/catch
}
