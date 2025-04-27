// leaderboardService.ts - Handles leaderboard data fetching
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

// Interface for leaderboard data
export interface LeaderboardUser {
  id: number;
  name: string;
  score: number;
  rank: number;
  isCurrentUser: boolean;
}

// Get leaderboard data
export async function getLeaderboard(timeFrame: 'weekly' | 'monthly' | 'all-time' = 'weekly'): Promise<LeaderboardUser[]> {
  try {
    const response = await fetchWithRetry(`${API_URL}/leaderboard?timeFrame=${timeFrame}`, {
      headers: getAuthHeaders()
    }, 2);
    
    return handleResponse(response);
  } catch (error: any) {
    console.error('Error fetching leaderboard data:', error);
    // Return fallback data if the API call fails
    return getFallbackLeaderboardData(timeFrame);
  }
}

// Fallback data for demo purposes
function getFallbackLeaderboardData(timeFrame: string): LeaderboardUser[] {
  // This is shown if the API fails - the real data comes from the backend
  if (timeFrame === 'weekly') {
    return [
      { id: 1, name: "Alex Thompson", score: 450, rank: 1, isCurrentUser: false },
      { id: 2, name: "Jamie Rodriguez", score: 410, rank: 2, isCurrentUser: false },
      { id: 3, name: "Taylor Kim", score: 380, rank: 3, isCurrentUser: false },
      { id: 4, name: "Jordan Smith", score: 350, rank: 4, isCurrentUser: true },
      { id: 5, name: "Casey Johnson", score: 320, rank: 5, isCurrentUser: false },
    ];
  } else if (timeFrame === 'monthly') {
    return [
      { id: 6, name: "Morgan Williams", score: 1250, rank: 1, isCurrentUser: false },
      { id: 1, name: "Alex Thompson", score: 1150, rank: 2, isCurrentUser: false },
      { id: 4, name: "Jordan Smith", score: 980, rank: 3, isCurrentUser: true },
      { id: 3, name: "Taylor Kim", score: 920, rank: 4, isCurrentUser: false },
      { id: 5, name: "Casey Johnson", score: 870, rank: 5, isCurrentUser: false },
    ];
  } else {
    return [
      { id: 6, name: "Morgan Williams", score: 5680, rank: 1, isCurrentUser: false },
      { id: 7, name: "Riley Chen", score: 4950, rank: 2, isCurrentUser: false },
      { id: 1, name: "Alex Thompson", score: 4320, rank: 3, isCurrentUser: false },
      { id: 4, name: "Jordan Smith", score: 3760, rank: 4, isCurrentUser: true },
      { id: 2, name: "Jamie Rodriguez", score: 3540, rank: 5, isCurrentUser: false },
    ];
  }
}
