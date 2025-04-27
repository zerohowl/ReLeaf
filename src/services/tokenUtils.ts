// tokenUtils.ts - Utility functions for JWT token handling
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  exp: number;
  userId?: number;
  email?: string;
  iat?: number;
  [key: string]: any;
}

/**
 * Check if a JWT token is expired
 */
export function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    // exp is in seconds, Date.now() is in milliseconds
    return decoded.exp * 1000 < Date.now();
  } catch (error) {
    console.error('Error decoding token:', error);
    // If we can't decode the token, consider it expired
    return true;
  }
}

/**
 * Get token expiration date
 */
export function getTokenExpirationDate(token: string): Date | null {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    if (!decoded.exp) return null;
    
    // Create date from expiration timestamp (converting seconds to milliseconds)
    return new Date(decoded.exp * 1000);
  } catch (error) {
    return null;
  }
}

/**
 * Get time remaining until token expires (in seconds)
 */
export function getTokenRemainingTime(token: string): number {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    if (!decoded.exp) return 0;
    
    const now = Date.now() / 1000; // convert to seconds
    const timeRemaining = decoded.exp - now;
    
    return Math.max(0, Math.floor(timeRemaining));
  } catch (error) {
    return 0;
  }
}
