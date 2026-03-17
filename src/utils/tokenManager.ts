/**
 * TokenManager - Secure token handling utility
 * 
 * Provides secure methods for storing, retrieving, and validating JWT tokens.
 * Never logs tokens to prevent security leaks.
 * 
 * Requirements: 25
 */

const TOKEN_KEY = 'authToken';

/**
 * Validates JWT token format (basic structure check)
 * A valid JWT has three parts separated by dots: header.payload.signature
 */
function isValidTokenFormat(token: string): boolean {
  if (!token || typeof token !== 'string') {
    return false;
  }

  const parts = token.split('.');
  if (parts.length !== 3) {
    return false;
  }

  // Check that each part is non-empty and contains valid base64url characters
  const base64UrlPattern = /^[A-Za-z0-9_-]+$/;
  return parts.every((part) => part.length > 0 && base64UrlPattern.test(part));
}

/**
 * Stores a JWT token securely in localStorage
 * Validates token format before storing
 * 
 * @param token - JWT token to store
 * @returns true if stored successfully, false otherwise
 */
export function setToken(token: string): boolean {
  try {
    if (!isValidTokenFormat(token)) {
      console.error('Invalid token format - token not stored');
      return false;
    }

    localStorage.setItem(TOKEN_KEY, token);
    return true;
  } catch (error) {
    console.error('Failed to store token');
    return false;
  }
}

/**
 * Retrieves the stored JWT token
 * 
 * @returns The stored token or null if not found or invalid
 */
export function getToken(): string | null {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    
    if (!token) {
      return null;
    }

    // Validate format before returning
    if (!isValidTokenFormat(token)) {
      console.error('Stored token has invalid format - removing');
      removeToken();
      return null;
    }

    // Remove expired tokens so they are never sent to the backend
    if (isTokenExpired(token) === true) {
      removeToken();
      return null;
    }

    return token;
  } catch (error) {
    console.error('Failed to retrieve token');
    return null;
  }
}

/**
 * Removes the stored JWT token
 */
export function removeToken(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.error('Failed to remove token');
  }
}

/**
 * Checks if a valid token exists
 * 
 * @returns true if a valid token is stored, false otherwise
 */
export function hasToken(): boolean {
  return getToken() !== null;
}

/**
 * Decodes the JWT payload without verification
 * WARNING: This does not verify the token signature
 * Use only for reading non-sensitive claims like expiration
 * 
 * @param token - JWT token to decode
 * @returns Decoded payload or null if invalid
 */
export function decodeToken(token: string): Record<string, unknown> | null {
  try {
    if (!isValidTokenFormat(token)) {
      return null;
    }

    const parts = token.split('.');
    const payload = parts[1];

    // Decode base64url
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to decode token');
    return null;
  }
}

/**
 * Checks if the token is expired
 * 
 * @param token - JWT token to check
 * @returns true if expired, false if valid, null if cannot determine
 */
export function isTokenExpired(token: string): boolean | null {
  try {
    const payload = decodeToken(token);
    
    if (!payload || !payload.exp) {
      return null;
    }

    const expirationTime = (payload.exp as number) * 1000; // Convert to milliseconds
    return Date.now() >= expirationTime;
  } catch (error) {
    console.error('Failed to check token expiration');
    return null;
  }
}
