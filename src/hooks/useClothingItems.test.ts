import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useClothingItems } from './useClothingItems';
import clothingItemsAPI from '../api/clothing';
import type { ClothingItem, ClothingItemFormData, ClothingCategory, PaginatedResponse } from '../types';

// Mock the API
vi.mock('../api/clothing', () => ({
  default: {
    getAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    uploadPhoto: vi.fn(),
  },
}));

describe('useClothingItems', () => {
  const mockItem: ClothingItem = {
    id: 1,
    name: 'Test Shirt',
    brand: 'Test Brand',
    primaryColor: 'blue',
    category: 'TOP' as ClothingCategory,
    wearCount: 0,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  };

  const mockPaginatedResponse: PaginatedResponse<ClothingItem> = {
    content: [mockItem],
    page: 0,
    size: 20,
    totalElements: 1,
    totalPages: 1,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchItems', () => {
    it('should fetch items successfully', async () => {
      vi.mocked(clothingItemsAPI.getAll).mockResolvedValue(mockPaginatedResponse);

      const { result } = renderHook(() => useClothingItems());

      expect(result.current.isLoading).toBe(false);
      expect(result.current.items).toEqual([]);

      await act(async () => {
        await result.current.fetchItems();
      });

      expect(clothingItemsAPI.getAll).toHaveBeenCalledWith(undefined, 0, 20);
      expect(result.current.items).toEqual([mockItem]);
      expect(result.current.pagination).toEqual({
        page: 0,
        size: 20,
        totalElements: 1,
        totalPages: 1,
      });
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should handle fetch errors', async () => {
      const error = new Error('Network error');
      vi.mocked(clothingItemsAPI.getAll).mockRejectedValue(error);

      const { result } = renderHook(() => useClothingItems());

      await act(async () => {
        try {
          await result.current.fetchItems();
        } catch (err) {
          // Expected to throw
        }
      });

      expect(result.current.error).toBe('Failed to fetch clothing items');
      expect(result.current.isLoading).toBe(false);
    });

    it('should fetch with filters and pagination', async () => {
      vi.mocked(clothingItemsAPI.getAll).mockResolvedValue(mockPaginatedResponse);

      const { result } = renderHook(() => useClothingItems());

      const filters = { category: 'TOP' as ClothingCategory };
      await act(async () => {
        await result.current.fetchItems(filters, 1);
      });

      expect(clothingItemsAPI.getAll).toHaveBeenCalledWith(filters, 1, 20);
    });
  });

  describe('createItem', () => {
    it('should create item with optimistic update', async () => {
      const formData: ClothingItemFormData = {
        name: 'New Shirt',
        primaryColor: 'red',
        category: 'TOP' as ClothingCategory,
      };

      const createdItem: ClothingItem = {
        id: 2,
        ...formData,
        wearCount: 0,
        createdAt: '2024-01-02T00:00:00Z',
        updatedAt: '2024-01-02T00:00:00Z',
      };

      vi.mocked(clothingItemsAPI.create).mockResolvedValue(createdItem);

      const { result } = renderHook(() => useClothingItems());

      // Initially empty
      expect(result.current.items).toEqual([]);

      await act(async () => {
        await result.current.createItem(formData);
      });

      // Should have the created item
      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0]).toEqual(createdItem);
      expect(clothingItemsAPI.create).toHaveBeenCalledWith(formData, undefined);
    });

    it('should revert optimistic update on create failure', async () => {
      const formData: ClothingItemFormData = {
        name: 'New Shirt',
        primaryColor: 'red',
        category: 'TOP' as ClothingCategory,
      };

      const error = new Error('Create failed');
      vi.mocked(clothingItemsAPI.create).mockRejectedValue(error);

      const { result } = renderHook(() => useClothingItems());

      await act(async () => {
        try {
          await result.current.createItem(formData);
        } catch (err) {
          // Expected to throw
        }
      });

      // Should revert to empty
      expect(result.current.items).toEqual([]);
      expect(result.current.error).toBe('Failed to create clothing item');
    });

    it('should create item with photo', async () => {
      const formData: ClothingItemFormData = {
        name: 'New Shirt',
        primaryColor: 'red',
        category: 'TOP' as ClothingCategory,
      };

      const photo = new File(['photo'], 'photo.jpg', { type: 'image/jpeg' });

      const createdItem: ClothingItem = {
        id: 2,
        ...formData,
        photoUrl: 'http://example.com/photo.jpg',
        wearCount: 0,
        createdAt: '2024-01-02T00:00:00Z',
        updatedAt: '2024-01-02T00:00:00Z',
      };

      vi.mocked(clothingItemsAPI.create).mockResolvedValue(createdItem);

      const { result } = renderHook(() => useClothingItems());

      await act(async () => {
        await result.current.createItem(formData, photo);
      });

      expect(clothingItemsAPI.create).toHaveBeenCalledWith(formData, photo);
      expect(result.current.items[0].photoUrl).toBe('http://example.com/photo.jpg');
    });
  });

  describe('updateItem', () => {
    it('should update item with optimistic update', async () => {
      // Setup initial state with an item
      vi.mocked(clothingItemsAPI.getAll).mockResolvedValue(mockPaginatedResponse);

      const { result } = renderHook(() => useClothingItems());

      await act(async () => {
        await result.current.fetchItems();
      });

      const updateData: ClothingItemFormData = {
        name: 'Updated Shirt',
        primaryColor: 'green',
        category: 'TOP' as ClothingCategory,
      };

      const updatedItem: ClothingItem = {
        ...mockItem,
        ...updateData,
        updatedAt: '2024-01-02T00:00:00Z',
      };

      vi.mocked(clothingItemsAPI.update).mockResolvedValue(updatedItem);

      await act(async () => {
        await result.current.updateItem(1, updateData);
      });

      expect(result.current.items[0].name).toBe('Updated Shirt');
      expect(clothingItemsAPI.update).toHaveBeenCalledWith(1, updateData);
    });

    it('should revert optimistic update on update failure', async () => {
      // Setup initial state
      vi.mocked(clothingItemsAPI.getAll).mockResolvedValue(mockPaginatedResponse);

      const { result } = renderHook(() => useClothingItems());

      await act(async () => {
        await result.current.fetchItems();
      });

      const originalName = result.current.items[0].name;

      const updateData: ClothingItemFormData = {
        name: 'Updated Shirt',
        primaryColor: 'green',
        category: 'TOP' as ClothingCategory,
      };

      const error = new Error('Update failed');
      vi.mocked(clothingItemsAPI.update).mockRejectedValue(error);

      await act(async () => {
        try {
          await result.current.updateItem(1, updateData);
        } catch (err) {
          // Expected to throw
        }
      });

      // Should revert to original
      expect(result.current.items[0].name).toBe(originalName);
      expect(result.current.error).toBe('Failed to update clothing item');
    });

    it('should throw error when updating non-existent item', async () => {
      const { result } = renderHook(() => useClothingItems());

      const updateData: ClothingItemFormData = {
        name: 'Updated Shirt',
        primaryColor: 'green',
        category: 'TOP' as ClothingCategory,
      };

      await act(async () => {
        await expect(result.current.updateItem(999, updateData)).rejects.toThrow('Item not found');
      });
    });
  });

  describe('deleteItem', () => {
    it('should delete item with optimistic update', async () => {
      // Setup initial state
      vi.mocked(clothingItemsAPI.getAll).mockResolvedValue(mockPaginatedResponse);

      const { result } = renderHook(() => useClothingItems());

      await act(async () => {
        await result.current.fetchItems();
      });

      expect(result.current.items).toHaveLength(1);

      vi.mocked(clothingItemsAPI.delete).mockResolvedValue(undefined);

      await act(async () => {
        await result.current.deleteItem(1);
      });

      expect(result.current.items).toHaveLength(0);
      expect(clothingItemsAPI.delete).toHaveBeenCalledWith(1);
    });

    it('should revert optimistic update on delete failure', async () => {
      // Setup initial state
      vi.mocked(clothingItemsAPI.getAll).mockResolvedValue(mockPaginatedResponse);

      const { result } = renderHook(() => useClothingItems());

      await act(async () => {
        await result.current.fetchItems();
      });

      const error = new Error('Delete failed');
      vi.mocked(clothingItemsAPI.delete).mockRejectedValue(error);

      await act(async () => {
        try {
          await result.current.deleteItem(1);
        } catch (err) {
          // Expected to throw
        }
      });

      // Should revert - item still there
      expect(result.current.items).toHaveLength(1);
      expect(result.current.error).toBe('Failed to delete clothing item');
    });

    it('should throw error when deleting non-existent item', async () => {
      const { result } = renderHook(() => useClothingItems());

      await act(async () => {
        await expect(result.current.deleteItem(999)).rejects.toThrow('Item not found');
      });
    });
  });

  describe('uploadPhoto', () => {
    it('should upload photo and update item', async () => {
      // Setup initial state
      vi.mocked(clothingItemsAPI.getAll).mockResolvedValue(mockPaginatedResponse);

      const { result } = renderHook(() => useClothingItems());

      await act(async () => {
        await result.current.fetchItems();
      });

      const photo = new File(['photo'], 'photo.jpg', { type: 'image/jpeg' });

      const updatedItem: ClothingItem = {
        ...mockItem,
        photoUrl: 'http://example.com/photo.jpg',
      };

      vi.mocked(clothingItemsAPI.uploadPhoto).mockResolvedValue(updatedItem);

      await act(async () => {
        await result.current.uploadPhoto(1, photo);
      });

      expect(result.current.items[0].photoUrl).toBe('http://example.com/photo.jpg');
      expect(clothingItemsAPI.uploadPhoto).toHaveBeenCalledWith(1, photo);
    });

    it('should handle upload photo error', async () => {
      const { result } = renderHook(() => useClothingItems());

      const photo = new File(['photo'], 'photo.jpg', { type: 'image/jpeg' });

      const error = new Error('Upload failed');
      vi.mocked(clothingItemsAPI.uploadPhoto).mockRejectedValue(error);

      await act(async () => {
        try {
          await result.current.uploadPhoto(1, photo);
        } catch (err) {
          // Expected to throw
        }
      });

      expect(result.current.error).toBe('Failed to upload photo');
    });
  });
});
