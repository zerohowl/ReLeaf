// leaderboardService.ts - Handles leaderboard data fetching
import { getToken } from './authService';

// Central source of truth for leaderboard data
const BASE_LEADERBOARD_USERS = [
  { id: 1, name: 'Kevin H.', score: 1245, rank: 1, isCurrentUser: false },
  { id: 2, name: 'Turat Z.', score: 1120, rank: 2, isCurrentUser: false },
  { id: 3, name: 'Sean E.', score: 980, rank: 3, isCurrentUser: true },
  { id: 4, name: 'Enzo G.', score: 875, rank: 4, isCurrentUser: false },
  { id: 5, name: 'Ava W.', score: 840, rank: 5, isCurrentUser: false },
];

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

// Generate leaderboard data based on the central source
function getFallbackLeaderboardData(timeFrame: string): LeaderboardUser[] {
  // Get a fresh copy of the base data
  let data = [...BASE_LEADERBOARD_USERS];
  
  // Add user's current points if available in localStorage
  const userPoints = getUserPoints();
  if (userPoints > 0) {
    data = data.map(user => {
      if (user.isCurrentUser) {
        return { ...user, score: userPoints };
      }
      return user;
    });
    
    // Re-sort based on new scores and update ranks
    data.sort((a, b) => b.score - a.score);
    data = data.map((user, index) => ({
      ...user,
      rank: index + 1
    }));
  }
  
  // Adjust scores based on timeframe (while maintaining relative positions)
  if (timeFrame === 'weekly') {
    // For weekly, use roughly 1/4 of points
    return data.map(user => ({
      ...user,
      score: Math.round(user.score / 4)
    }));
  } else if (timeFrame === 'monthly') {
    // For monthly, use roughly 1/2 of points
    return data.map(user => ({
      ...user,
      score: Math.round(user.score / 2)
    }));
  } else {
    // For all-time, use full points
    return data;
  }
}

// Function to get current user points from localStorage
export function getUserPoints(): number {
  const pointsStr = localStorage.getItem('user_points');
  return pointsStr ? parseInt(pointsStr, 10) : 980; // Default to 980 if not set
}

// Function to update user points
export function updateUserPoints(newPoints: number): void {
  localStorage.setItem('user_points', newPoints.toString());
}

// Function to add points to the user
export function addUserPoints(pointsToAdd: number): number {
  const currentPoints = getUserPoints();
  const newPoints = currentPoints + pointsToAdd;
  updateUserPoints(newPoints);
  return newPoints;
}
