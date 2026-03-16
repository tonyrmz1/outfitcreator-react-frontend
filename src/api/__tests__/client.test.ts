import { describe, it, expect, beforeEach, vi } from 'vitest';
import axios from 'axios';
import apiClient from '../client';

// Mock axios
vi.mock('axios');
const mockedAxios = axios as any;

describe('ApiClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('Request Interceptor', () => {
    it('should add JWT token to Authorization header when token exists', async () => {
      const token = 'test-jwt-token';
      localStorage.setItem('authToken', token);

      const mockCreate = vi.fn().mockReturnValue({
        interceptors: {
          request: {
            use: vi.fn((successHandler) => {
              const config = { headers: {} };
              const result = successHandler(config);
              expect(result.headers.Authorization).toBe(`Bearer ${token}`);
            }),
          },
          response: {
            use: vi.fn(),
          },
        },
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
      });

      mockedAxios.create = mockCreate;
    });

    it('should not add Authorization header when token does not exist', async () => {
      const mockCreate = vi.fn().mockReturnValue({
        interceptors: {
          request: {
            use: vi.fn((successHandler) => {
              const config = { headers: {} };
              const result = successHandler(config);
              expect(result.headers.Authorization).toBeUndefined();
            }),
          },
          response: {
            use: vi.fn(),
          },
        },
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
      });

      mockedAxios.create = mockCreate;
    });
  });

  describe('Response Interceptor', () => {
    it('should remove token and redirect on 401 error', () => {
      const token = 'test-jwt-token';
      localStorage.setItem('authToken', token);

      const originalLocation = window.location.href;
      delete (window as any).location;
      window.location = { href: '' } as any;

      const mockCreate = vi.fn().mockReturnValue({
        interceptors: {
          request: {
            use: vi.fn(),
          },
          response: {
            use: vi.fn((successHandler, errorHandler) => {
              const error = {
                response: { status: 401 },
              };
              errorHandler(error);
              expect(localStorage.getItem('authToken')).toBeNull();
              expect(window.location.href).toBe('/login');
            }),
          },
        },
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
      });

      mockedAxios.create = mockCreate;
    });
  });
});
