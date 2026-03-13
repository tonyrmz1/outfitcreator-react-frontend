import apiClient from './client';
import type { Outfit, OutfitFormData, PaginatedResponse } from '../types';

class OutfitsAPI {
  async getAll(page = 0, size = 20): Promise<PaginatedResponse<Outfit>> {
    return apiClient.get<PaginatedResponse<Outfit>>('/api/outfits', { page, size });
  }

  async getById(id: number): Promise<Outfit> {
    return apiClient.get<Outfit>(`/api/outfits/${id}`);
  }

  async create(data: OutfitFormData): Promise<Outfit> {
    return apiClient.post<Outfit>('/api/outfits', data);
  }

  async update(id: number, data: Partial<OutfitFormData>): Promise<Outfit> {
    return apiClient.put<Outfit>(`/api/outfits/${id}`, data);
  }

  async delete(id: number): Promise<void> {
    return apiClient.delete<void>(`/api/outfits/${id}`);
  }
}

const outfitsAPI = new OutfitsAPI();

export default outfitsAPI;
