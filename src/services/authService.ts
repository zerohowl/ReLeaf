// Authentication service to replace Supabase
// Handles login, registration, token storage and auth state management

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
  const response = await fetch('/api/register', {
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
    const response = await fetch('/api/login', {
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
  
  const response = await fetch('/api/profile', {
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
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem(TOKEN_KEY);
};

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
