import { describe, it, expect, vi, beforeEach } from 'vitest';
import outfitsAPI from '../endpoints/outfits';
import apiClient from '../client';
import type { Outfit, OutfitFormData, PaginatedResponse } from '../../types';
import { ClothingCategory, ItemPosition, Season } from '../../types';

// Mock the apiClient
vi.mock('../client', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('OutfitsAPI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockOutfit: Outfit = {
    id: 1,
    name: 'Casual Friday',
    notes: 'Perfect for a relaxed office day',
    items: [
      {
        id: 1,
        clothingItem: {
          id: 10,
          name: 'Blue Jeans',
          primaryColor: 'blue',
          category: ClothingCategory.BOTTOM,
          wearCount: 5,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
        position: ItemPosition.BOTTOM,
      },
      {
        id: 2,
        clothingItem: {
          id: 20,
          name: 'White T-Shirt',
          primaryColor: 'white',
          category: ClothingCategory.TOP,
          wearCount: 3,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
        position: ItemPosition.TOP,
      },
    ],
    isComplete: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  };

  describe('getAll', () => {
    it('should call apiClient.get with correct endpoint and default pagination', async () => {
      const mockResponse: PaginatedResponse<Outfit> = {
        content: [mockOutfit],
        page: 0,
        size: 20,
        totalElements: 1,
        totalPages: 1,
      };

      vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

      const result = await outfitsAPI.getAll();

      expect(apiClient.get).toHaveBeenCalledWith('/api/outfits', {
        page: 0,
        size: 20,
      });
      expect(result).toEqual(mockResponse);
    });

    it('should call apiClient.get with custom pagination', async () => {
      const mockResponse: PaginatedResponse<Outfit> = {
        content: [mockOutfit],
        page: 2,
        size: 10,
        totalElements: 25,
        totalPages: 3,
      };

      vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

      const result = await outfitsAPI.getAll(2, 10);

      expect(apiClient.get).toHaveBeenCalledWith('/api/outfits', {
        page: 2,
        size: 10,
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getById', () => {
    it('should call apiClient.get with correct endpoint and id', async () => {
      vi.mocked(apiClient.get).mockResolvedValue(mockOutfit);

      const result = await outfitsAPI.getById(1);

      expect(apiClient.get).toHaveBeenCalledWith('/api/outfits/1');
      expect(result).toEqual(mockOutfit);
    });
  });

  describe('create', () => {
    it('should call apiClient.post with correct endpoint and data', async () => {
      const formData: OutfitFormData = {
        name: 'Casual Friday',
        notes: 'Perfect for a relaxed office day',
        items: [
          {
            clothingItemId: 10,
            position: ItemPosition.BOTTOM,
          },
          {
            clothingItemId: 20,
            position: ItemPosition.TOP,
          },
        ],
      };

      vi.mocked(apiClient.post).mockResolvedValue(mockOutfit);

      const result = await outfitsAPI.create(formData);

      expect(apiClient.post).toHaveBeenCalledWith('/api/outfits', formData);
      expect(result).toEqual(mockOutfit);
    });

    it('should call apiClient.post with minimal data', async () => {
      const formData: OutfitFormData = {
        name: 'Simple Outfit',
        items: [
          {
            clothingItemId: 10,
            position: ItemPosition.TOP,
          },
        ],
      };

      const simpleOutfit: Outfit = {
        id: 2,
        name: 'Simple Outfit',
        items: [
          {
            id: 1,
            clothingItem: {
              id: 10,
              name: 'White T-Shirt',
              primaryColor: 'white',
              category: ClothingCategory.TOP,
              wearCount: 3,
              createdAt: '2024-01-01T00:00:00Z',
              updatedAt: '2024-01-01T00:00:00Z',
            },
            position: ItemPosition.TOP,
          },
        ],
        isComplete: false,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };

      vi.mocked(apiClient.post).mockResolvedValue(simpleOutfit);

      const result = await outfitsAPI.create(formData);

      expect(apiClient.post).toHaveBeenCalledWith('/api/outfits', formData);
      expect(result).toEqual(simpleOutfit);
    });
  });

  describe('update', () => {
    it('should call apiClient.put with correct endpoint, id, and full data', async () => {
      const updateData: OutfitFormData = {
        name: 'Updated Casual Friday',
        notes: 'Updated notes',
        items: [
          {
            clothingItemId: 10,
            position: ItemPosition.BOTTOM,
          },
          {
            clothingItemId: 20,
            position: ItemPosition.TOP,
          },
          {
            clothingItemId: 30,
            position: ItemPosition.FOOTWEAR,
          },
        ],
      };

      const updatedOutfit: Outfit = {
        ...mockOutfit,
        name: 'Updated Casual Friday',
        notes: 'Updated notes',
        updatedAt: '2024-01-02T00:00:00Z',
      };

      vi.mocked(apiClient.put).mockResolvedValue(updatedOutfit);

      const result = await outfitsAPI.update(1, updateData);

      expect(apiClient.put).toHaveBeenCalledWith('/api/outfits/1', updateData);
      expect(result).toEqual(updatedOutfit);
    });

    it('should call apiClient.put with partial data', async () => {
      const updateData: Partial<OutfitFormData> = {
        name: 'Updated Name Only',
      };

      const updatedOutfit: Outfit = {
        ...mockOutfit,
        name: 'Updated Name Only',
        updatedAt: '2024-01-02T00:00:00Z',
      };

      vi.mocked(apiClient.put).mockResolvedValue(updatedOutfit);

      const result = await outfitsAPI.update(1, updateData);

      expect(apiClient.put).toHaveBeenCalledWith('/api/outfits/1', updateData);
      expect(result).toEqual(updatedOutfit);
    });
  });

  describe('delete', () => {
    it('should call apiClient.delete with correct endpoint and id', async () => {
      vi.mocked(apiClient.delete).mockResolvedValue(undefined);

      await outfitsAPI.delete(1);

      expect(apiClient.delete).toHaveBeenCalledWith('/api/outfits/1');
    });
  });
});
