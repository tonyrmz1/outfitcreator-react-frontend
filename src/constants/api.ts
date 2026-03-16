// API constants
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
  },
  CLOTHING: {
    LIST: '/clothing',
    CREATE: '/clothing',
    GET: (id: number) => `/clothing/${id}`,
    UPDATE: (id: number) => `/clothing/${id}`,
    DELETE: (id: number) => `/clothing/${id}`,
  },
  OUTFITS: {
    LIST: '/outfits',
    CREATE: '/outfits',
    GET: (id: number) => `/outfits/${id}`,
    UPDATE: (id: number) => `/outfits/${id}`,
    DELETE: (id: number) => `/outfits/${id}`,
  },
  RECOMMENDATIONS: {
    GET: '/recommendations',
  },
} as const;

export const API_TIMEOUT = 30000; // milliseconds

export const API_RETRY_ATTEMPTS = 3;

export const API_RETRY_DELAY = 1000; // milliseconds
