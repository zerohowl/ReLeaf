// Authentication service
// Handles login, registration, token storage and auth state management

import { isTokenExpired } from './tokenUtils';

// Get API URL from environment variable or use a fallback for production
const API_URL = import.meta.env.VITE_API_URL || 'https://api.releaf-recycling.com';

// For demo purposes: enable mock auth when running on Pages
const IS_DEMO = window.location.hostname.includes('pages.dev') || 
               window.location.hostname.includes('re-leaf.xyz');

// Mock user for demo purposes
const MOCK_USER = {
  id: 1,
  email: 'demo@releaf.com'
};

// Mock token
const MOCK_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwibmFtZSI6IkRlbW8gVXNlciIsImlhdCI6MTcxNDI5NDgwMCwiZXhwIjoxNzQ1ODMwODAwfQ.mock-signature';

// Token storage keys
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

// Types
export interface User {
  id: number;
  email: string;
  createdAt?: string;
}

interface AuthResponse {
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name?: string;
  // Add more fields as needed
}

/**
 * Register a new user
 */
export const register = async (credentials: RegisterCredentials): Promise<User> => {
  // For demo mode, use mock authentication
  if (IS_DEMO) {
    console.log('Using mock authentication for demo');
    localStorage.setItem(TOKEN_KEY, MOCK_TOKEN);
    localStorage.setItem(USER_KEY, JSON.stringify(MOCK_USER));
    return Promise.resolve(MOCK_USER);
  }

  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Registration failed');
  }

  // After registration, automatically log the user in
  const user = await response.json();
  return login(credentials).then(() => user);
};

/**
 * Log in a user
 */
export const login = async (credentials: LoginCredentials): Promise<User> => {
  try {
    // For demo mode (Cloudflare Pages), use mock authentication
    if (IS_DEMO) {
      console.log('Using mock authentication for demo');
      // Check if using test credentials
      if (credentials.email === 'user@example.com' && credentials.password === 'password123') {
        localStorage.setItem(TOKEN_KEY, MOCK_TOKEN);
        localStorage.setItem(USER_KEY, JSON.stringify(MOCK_USER));
        return Promise.resolve(MOCK_USER);
      } else {
        throw new Error('Invalid email or password. For demo, use user@example.com / password123');
      }
    }

    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });

    if (!response.ok) {
      let errorMessage = 'Login failed';
      try {
        const errorText = await response.text();
        if (errorText) {
          errorMessage = errorText;
        }
      } catch (textError) {
        console.error('Error parsing error response:', textError);
      }
      
      // Specific error messages based on status code
      if (response.status === 401) {
        errorMessage = 'Invalid email or password';
      } else if (response.status === 400) {
        errorMessage = 'Please provide both email and password';
      } else if (response.status >= 500) {
        errorMessage = 'Server error. Please try again later';
      }
      
      throw new Error(errorMessage);
    }

    const { token } = await response.json() as AuthResponse;
    
    // Store token in localStorage
    localStorage.setItem(TOKEN_KEY, token);
    
    // Get user profile
    return getUserProfile();
  } catch (error) {
    // Handle fetch errors (network issues, etc.)
    if (!(error instanceof Error) || !error.message) {
      throw new Error('Network error or server unavailable. Please try again.');
    }
    throw error;
  }
};

/**
 * Get the current user profile
 */
export const getUserProfile = async (): Promise<User> => {
  const token = localStorage.getItem(TOKEN_KEY);
  
  if (!token) {
    throw new Error('No authentication token found');
  }

  // For demo mode, return the mock user
  if (IS_DEMO) {
    return Promise.resolve(MOCK_USER);
  }
  
  const response = await fetch(`${API_URL}/profile`, {
    headers: { 
      'Authorization': `Bearer ${token}` 
    }
  });
  
  if (!response.ok) {
    if (response.status === 401) {
      logout();
      throw new Error('Session expired. Please login again.');
    }
    throw new Error('Failed to get user profile');
  }
  
  const user = await response.json();
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  
  return user;
};

/**
 * Log out the current user
 */
export const logout = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  window.location.href = '/login';
};

/**
 * Check if user is logged in
 */
export function isAuthenticated(): boolean {
  const token = getToken();
  if (!token) return false;
  
  // Also check if token is expired
  if (isTokenExpired(token)) {
    // If expired, clean up the storage
    localStorage.removeItem(TOKEN_KEY);
    return false;
  }
  
  return true;
}

/**
 * Get the current user from localStorage
 */
export const getCurrentUser = (): User | null => {
  const userJson = localStorage.getItem(USER_KEY);
  return userJson ? JSON.parse(userJson) : null;
};

/**
 * Get auth token
 */
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Helper to make authenticated API requests
 */
export const authFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const token = getToken();
  
  if (!token) {
    throw new Error('No authentication token found');
  }
  
  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`
  };
  
  return fetch(url, { ...options, headers });
};
