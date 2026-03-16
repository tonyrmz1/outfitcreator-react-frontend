import { useState, useEffect } from 'react';
import authAPI from '../../api/endpoints/auth';
import { getToken, setToken, removeToken } from '../../utils/tokenManager';
import type { User, LoginRequest, RegisterRequest } from '../../types';

interface UseAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on mount
    const token = getToken();
    if (token) {
      authAPI
        .getProfile()
        .then(setUser)
        .catch(() => removeToken())
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (credentials: LoginRequest): Promise<void> => {
    const response = await authAPI.login(credentials);
    setToken(response.token);
    setUser(response.user);
  };

  const register = async (data: RegisterRequest): Promise<void> => {
    await authAPI.register(data);
    // Auto-login after registration
    await login({ email: data.email, password: data.password });
  };

  const logout = (): void => {
    removeToken();
    setUser(null);
  };

  const updateProfile = async (data: Partial<User>): Promise<void> => {
    const updatedUser = await authAPI.updateProfile(data);
    setUser(updatedUser);
  };

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
  };
}
