import apiClient from './client';
import type { ClothingItem, ClothingItemFormData, ClothingItemFilters, PaginatedResponse } from '../types';

class ClothingItemsAPI {
  async getAll(filters?: ClothingItemFilters, page = 0, size = 20): Promise<PaginatedResponse<ClothingItem>> {
    return apiClient.get<PaginatedResponse<ClothingItem>>('/api/clothing', {
      ...filters,
      page,
      size,
    });
  }

  async getById(id: number): Promise<ClothingItem> {
    return apiClient.get<ClothingItem>(`/api/clothing/${id}`);
  }

  async create(data: ClothingItemFormData, photo?: File): Promise<ClothingItem> {
    const formData = new FormData();
    formData.append('data', JSON.stringify(data));
    if (photo) {
      formData.append('photo', photo);
    }
    return apiClient.postFormData<ClothingItem>('/api/clothing', formData);
  }

  async update(id: number, data: ClothingItemFormData): Promise<ClothingItem> {
    return apiClient.put<ClothingItem>(`/api/clothing/${id}`, data);
  }

  async delete(id: number): Promise<void> {
    return apiClient.delete<void>(`/api/clothing/${id}`);
  }

  async uploadPhoto(id: number, photo: File): Promise<ClothingItem> {
    const formData = new FormData();
    formData.append('photo', photo);
    return apiClient.postFormData<ClothingItem>(`/api/clothing/${id}/photo`, formData);
  }
}

const clothingItemsAPI = new ClothingItemsAPI();

export default clothingItemsAPI;
