import apiClient from './client';
import type { LoginRequest, LoginResponse, RegisterRequest, User } from '../types';

class AuthAPI {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return apiClient.post<LoginResponse>('/api/auth/login', credentials);
  }

  async register(data: RegisterRequest): Promise<User> {
    return apiClient.post<User>('/api/auth/register', data);
  }

  async getProfile(): Promise<User> {
    return apiClient.get<User>('/api/auth/profile');
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    return apiClient.put<User>('/api/auth/profile', data);
  }
}

const authAPI = new AuthAPI();

export default authAPI;
