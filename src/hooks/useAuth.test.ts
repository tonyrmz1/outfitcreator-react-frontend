import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useAuth } from './useAuth';
import authAPI from '../api/auth';
import type { User, LoginResponse } from '../types';

// Mock the authAPI
vi.mock('../api/auth', () => ({
  default: {
    login: vi.fn(),
    register: vi.fn(),
    getProfile: vi.fn(),
    updateProfile: vi.fn(),
  },
}));

describe('useAuth', () => {
  const mockUser: User = {
    id: 1,
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  };

  const mockLoginResponse: LoginResponse = {
    token: 'mock-jwt-token',
    user: mockUser,
  };

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('initialization', () => {
    it('should initialize with no user when no token exists', async () => {
      const { result } = renderHook(() => useAuth());

      // Wait for loading to complete
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });

    it('should check for existing token on mount and restore session', async () => {
      localStorage.setItem('authToken', 'existing-token');
      vi.mocked(authAPI.getProfile).mockResolvedValue(mockUser);

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(authAPI.getProfile).toHaveBeenCalledOnce();
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
    });

    it('should remove invalid token if getProfile fails', async () => {
      localStorage.setItem('authToken', 'invalid-token');
      vi.mocked(authAPI.getProfile).mockRejectedValue(new Error('Unauthorized'));

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(localStorage.getItem('authToken')).toBeNull();
      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });

    it('should finish loading when no token exists', async () => {
      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(authAPI.getProfile).not.toHaveBeenCalled();
      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe('login', () => {
    it('should login successfully and store token', async () => {
      vi.mocked(authAPI.login).mockResolvedValue(mockLoginResponse);

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.login({
          email: 'test@example.com',
          password: 'password123',
        });
      });

      expect(authAPI.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(localStorage.getItem('authToken')).toBe('mock-jwt-token');
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
    });

    it('should throw error on failed login', async () => {
      vi.mocked(authAPI.login).mockRejectedValue(new Error('Invalid credentials'));

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await expect(
        act(async () => {
          await result.current.login({
            email: 'test@example.com',
            password: 'wrong-password',
          });
        })
      ).rejects.toThrow('Invalid credentials');

      expect(localStorage.getItem('authToken')).toBeNull();
      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe('register', () => {
    it('should register and auto-login successfully', async () => {
      vi.mocked(authAPI.register).mockResolvedValue(mockUser);
      vi.mocked(authAPI.login).mockResolvedValue(mockLoginResponse);

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.register({
          email: 'test@example.com',
          password: 'password123',
          firstName: 'Test',
          lastName: 'User',
        });
      });

      expect(authAPI.register).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
      });
      expect(authAPI.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(localStorage.getItem('authToken')).toBe('mock-jwt-token');
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
    });

    it('should throw error on failed registration', async () => {
      vi.mocked(authAPI.register).mockRejectedValue(new Error('Email already exists'));

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await expect(
        act(async () => {
          await result.current.register({
            email: 'test@example.com',
            password: 'password123',
            firstName: 'Test',
            lastName: 'User',
          });
        })
      ).rejects.toThrow('Email already exists');

      expect(authAPI.login).not.toHaveBeenCalled();
      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe('logout', () => {
    it('should logout and clear user state', async () => {
      localStorage.setItem('authToken', 'existing-token');
      vi.mocked(authAPI.getProfile).mockResolvedValue(mockUser);

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.user).toEqual(mockUser);
      });

      act(() => {
        result.current.logout();
      });

      expect(localStorage.getItem('authToken')).toBeNull();
      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe('updateProfile', () => {
    it('should update profile successfully', async () => {
      localStorage.setItem('authToken', 'existing-token');
      vi.mocked(authAPI.getProfile).mockResolvedValue(mockUser);

      const updatedUser: User = {
        ...mockUser,
        firstName: 'Updated',
        lastName: 'Name',
      };
      vi.mocked(authAPI.updateProfile).mockResolvedValue(updatedUser);

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.user).toEqual(mockUser);
      });

      await act(async () => {
        await result.current.updateProfile({
          firstName: 'Updated',
          lastName: 'Name',
        });
      });

      expect(authAPI.updateProfile).toHaveBeenCalledWith({
        firstName: 'Updated',
        lastName: 'Name',
      });
      expect(result.current.user).toEqual(updatedUser);
    });

    it('should throw error on failed profile update', async () => {
      localStorage.setItem('authToken', 'existing-token');
      vi.mocked(authAPI.getProfile).mockResolvedValue(mockUser);
      vi.mocked(authAPI.updateProfile).mockRejectedValue(new Error('Update failed'));

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.user).toEqual(mockUser);
      });

      await expect(
        act(async () => {
          await result.current.updateProfile({
            firstName: 'Updated',
          });
        })
      ).rejects.toThrow('Update failed');

      // User state should remain unchanged
      expect(result.current.user).toEqual(mockUser);
    });
  });

  describe('isAuthenticated', () => {
    it('should return false when user is null', async () => {
      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isAuthenticated).toBe(false);
    });

    it('should return true when user exists', async () => {
      localStorage.setItem('authToken', 'existing-token');
      vi.mocked(authAPI.getProfile).mockResolvedValue(mockUser);

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.user).toEqual(mockUser);
      });

      expect(result.current.isAuthenticated).toBe(true);
    });
  });
});
