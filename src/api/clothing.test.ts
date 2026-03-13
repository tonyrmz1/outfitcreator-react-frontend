import { describe, it, expect, vi, beforeEach } from 'vitest';
import clothingItemsAPI from './clothing';
import apiClient from './client';
import type { ClothingItem, ClothingItemFormData, ClothingItemFilters, PaginatedResponse } from '../types';
import { ClothingCategory, Season, FitCategory } from '../types';

// Mock the apiClient
vi.mock('./client', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    postFormData: vi.fn(),
  },
}));

describe('ClothingItemsAPI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockClothingItem: ClothingItem = {
    id: 1,
    name: 'Blue Jeans',
    brand: "Levi's",
    primaryColor: 'blue',
    secondaryColor: 'white',
    category: ClothingCategory.BOTTOM,
    size: '32x34',
    season: Season.ALL_SEASON,
    fitCategory: FitCategory.REGULAR,
    purchaseDate: '2024-01-15',
    photoUrl: 'https://example.com/photo.jpg',
    wearCount: 5,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  };

  describe('getAll', () => {
    it('should call apiClient.get with correct endpoint and default pagination', async () => {
      const mockResponse: PaginatedResponse<ClothingItem> = {
        content: [mockClothingItem],
        page: 0,
        size: 20,
        totalElements: 1,
        totalPages: 1,
      };

      vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

      const result = await clothingItemsAPI.getAll();

      expect(apiClient.get).toHaveBeenCalledWith('/api/clothing', {
        page: 0,
        size: 20,
      });
      expect(result).toEqual(mockResponse);
    });

    it('should call apiClient.get with filters and custom pagination', async () => {
      const filters: ClothingItemFilters = {
        category: ClothingCategory.BOTTOM,
        season: Season.WINTER,
        color: 'blue',
        searchQuery: 'jeans',
      };

      const mockResponse: PaginatedResponse<ClothingItem> = {
        content: [mockClothingItem],
        page: 2,
        size: 10,
        totalElements: 25,
        totalPages: 3,
      };

      vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

      const result = await clothingItemsAPI.getAll(filters, 2, 10);

      expect(apiClient.get).toHaveBeenCalledWith('/api/clothing', {
        category: ClothingCategory.BOTTOM,
        season: Season.WINTER,
        color: 'blue',
        searchQuery: 'jeans',
        page: 2,
        size: 10,
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getById', () => {
    it('should call apiClient.get with correct endpoint and id', async () => {
      vi.mocked(apiClient.get).mockResolvedValue(mockClothingItem);

      const result = await clothingItemsAPI.getById(1);

      expect(apiClient.get).toHaveBeenCalledWith('/api/clothing/1');
      expect(result).toEqual(mockClothingItem);
    });
  });

  describe('create', () => {
    it('should call apiClient.postFormData with correct endpoint and data without photo', async () => {
      const formData: ClothingItemFormData = {
        name: 'Blue Jeans',
        brand: "Levi's",
        primaryColor: 'blue',
        category: ClothingCategory.BOTTOM,
        size: '32x34',
        season: Season.ALL_SEASON,
        fitCategory: FitCategory.REGULAR,
      };

      vi.mocked(apiClient.postFormData).mockResolvedValue(mockClothingItem);

      const result = await clothingItemsAPI.create(formData);

      expect(apiClient.postFormData).toHaveBeenCalledWith('/api/clothing', expect.any(FormData));
      
      // Verify FormData contents
      const callArgs = vi.mocked(apiClient.postFormData).mock.calls[0];
      const sentFormData = callArgs[1] as FormData;
      expect(sentFormData.get('data')).toBe(JSON.stringify(formData));
      expect(sentFormData.get('photo')).toBeNull();
      
      expect(result).toEqual(mockClothingItem);
    });

    it('should call apiClient.postFormData with correct endpoint, data, and photo', async () => {
      const formData: ClothingItemFormData = {
        name: 'Blue Jeans',
        primaryColor: 'blue',
        category: ClothingCategory.BOTTOM,
      };

      const mockFile = new File(['photo content'], 'jeans.jpg', { type: 'image/jpeg' });

      vi.mocked(apiClient.postFormData).mockResolvedValue(mockClothingItem);

      const result = await clothingItemsAPI.create(formData, mockFile);

      expect(apiClient.postFormData).toHaveBeenCalledWith('/api/clothing', expect.any(FormData));
      
      // Verify FormData contents
      const callArgs = vi.mocked(apiClient.postFormData).mock.calls[0];
      const sentFormData = callArgs[1] as FormData;
      expect(sentFormData.get('data')).toBe(JSON.stringify(formData));
      expect(sentFormData.get('photo')).toBe(mockFile);
      
      expect(result).toEqual(mockClothingItem);
    });
  });

  describe('update', () => {
    it('should call apiClient.put with correct endpoint, id, and data', async () => {
      const updateData: ClothingItemFormData = {
        name: 'Updated Jeans',
        primaryColor: 'dark blue',
        category: ClothingCategory.BOTTOM,
        brand: "Levi's 501",
      };

      const updatedItem: ClothingItem = {
        ...mockClothingItem,
        name: 'Updated Jeans',
        brand: "Levi's 501",
        primaryColor: 'dark blue',
        updatedAt: '2024-01-02T00:00:00Z',
      };

      vi.mocked(apiClient.put).mockResolvedValue(updatedItem);

      const result = await clothingItemsAPI.update(1, updateData);

      expect(apiClient.put).toHaveBeenCalledWith('/api/clothing/1', updateData);
      expect(result).toEqual(updatedItem);
    });
  });

  describe('delete', () => {
    it('should call apiClient.delete with correct endpoint and id', async () => {
      vi.mocked(apiClient.delete).mockResolvedValue(undefined);

      await clothingItemsAPI.delete(1);

      expect(apiClient.delete).toHaveBeenCalledWith('/api/clothing/1');
    });
  });

  describe('uploadPhoto', () => {
    it('should call apiClient.postFormData with correct endpoint, id, and photo', async () => {
      const mockFile = new File(['photo content'], 'updated-jeans.jpg', { type: 'image/jpeg' });

      const updatedItem: ClothingItem = {
        ...mockClothingItem,
        photoUrl: 'https://example.com/updated-photo.jpg',
        updatedAt: '2024-01-02T00:00:00Z',
      };

      vi.mocked(apiClient.postFormData).mockResolvedValue(updatedItem);

      const result = await clothingItemsAPI.uploadPhoto(1, mockFile);

      expect(apiClient.postFormData).toHaveBeenCalledWith('/api/clothing/1/photo', expect.any(FormData));
      
      // Verify FormData contents
      const callArgs = vi.mocked(apiClient.postFormData).mock.calls[0];
      const sentFormData = callArgs[1] as FormData;
      expect(sentFormData.get('photo')).toBe(mockFile);
      
      expect(result).toEqual(updatedItem);
    });
  });
});
