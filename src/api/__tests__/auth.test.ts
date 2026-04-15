import { describe, it, expect, vi, beforeEach } from 'vitest';
import authAPI from '../endpoints/auth';
import apiClient from '../client';
import type { LoginRequest, RegisterRequest, User, LoginResponse } from '../../types';

// Mock the apiClient
vi.mock('../client', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
    put: vi.fn(),
  },
}));

describe('AuthAPI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('login', () => {
    it('should call apiClient.post with correct endpoint and credentials', async () => {
      const credentials: LoginRequest = {
        email: 'test@example.com',
        password: 'Password123',
      };

      const mockResponse: LoginResponse = {
        token: 'mock-jwt-token',
        user: {
          id: 1,
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      };

      vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

      const result = await authAPI.login(credentials);

      expect(apiClient.post).toHaveBeenCalledWith('/api/auth/login', credentials);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('register', () => {
    it('should call apiClient.post with correct endpoint and registration data', async () => {
      const registerData: RegisterRequest = {
        email: 'newuser@example.com',
        password: 'Password123',
        firstName: 'New',
        lastName: 'User',
      };

      const mockUser: User = {
        id: 2,
        email: 'newuser@example.com',
        firstName: 'New',
        lastName: 'User',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };

      vi.mocked(apiClient.post).mockResolvedValue(mockUser);

      const result = await authAPI.register(registerData);

      expect(apiClient.post).toHaveBeenCalledWith('/api/auth/register', registerData);
      expect(result).toEqual(mockUser);
    });
  });

  describe('getProfile', () => {
    it('should call apiClient.get with correct endpoint', async () => {
      const mockUser: User = {
        id: 1,
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };

      vi.mocked(apiClient.get).mockResolvedValue(mockUser);

      const result = await authAPI.getProfile();

      expect(apiClient.get).toHaveBeenCalledWith('/api/auth/profile');
      expect(result).toEqual(mockUser);
    });
  });

  describe('updateProfile', () => {
    it('should call apiClient.put with correct endpoint and partial user data', async () => {
      const updateData: Partial<User> = {
        firstName: 'Updated',
        lastName: 'Name',
      };

      const mockUpdatedUser: User = {
        id: 1,
        email: 'test@example.com',
        firstName: 'Updated',
        lastName: 'Name',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-02T00:00:00Z',
      };

      vi.mocked(apiClient.put).mockResolvedValue(mockUpdatedUser);

      const result = await authAPI.updateProfile(updateData);

      expect(apiClient.put).toHaveBeenCalledWith('/api/auth/profile', updateData);
      expect(result).toEqual(mockUpdatedUser);
    });
  });
});
