// leaderboardService.ts - Handles leaderboard data fetching
import { getToken } from './authService';
import { leaderboardUsers as dashboardLeaderboard } from '@/pages/Dashboard';

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

// Use the same leaderboard data as Dashboard
function getFallbackLeaderboardData(timeFrame: string): LeaderboardUser[] {
  // Start with the dashboard leaderboard data
  let data = dashboardLeaderboard.map((user, index) => ({
    id: index + 1,
    name: user.name,
    score: user.score,
    rank: user.rank,
    isCurrentUser: user.name === 'Sean E.' // Mark Sean as the current user
  }));
  
  // Adjust scores based on timeframe
  if (timeFrame === 'weekly') {
    // For weekly, reduce points to roughly 1/3
    return data.map(user => ({
      ...user,
      score: Math.round(user.score / 3)
    }));
  } else if (timeFrame === 'monthly') {
    // For monthly, reduce points slightly
    return data.map(user => ({
      ...user,
      score: Math.round(user.score * 0.9)
    }));
  } else {
    // For all-time, increase points
    return data.map(user => ({
      ...user,
      score: Math.round(user.score * 3.5)
    }));
  }
}
