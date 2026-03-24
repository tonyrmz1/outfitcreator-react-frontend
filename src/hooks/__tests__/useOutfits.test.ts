import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useOutfits } from '../data/useOutfits';
import outfitsAPI from '../../api/endpoints/outfits';
import type { Outfit, OutfitFormData, ItemPosition, PaginatedResponse } from '../../types';

// Mock the API (path must match what useOutfits imports)
vi.mock('../../api/endpoints/outfits', () => ({
  default: {
    getAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('useOutfits', () => {
  const mockOutfit: Outfit = {
    id: 1,
    name: 'Test Outfit',
    notes: 'Test notes',
    items: [],
    isComplete: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  };

  const mockPaginatedResponse: PaginatedResponse<Outfit> = {
    content: [mockOutfit],
    number: 0,
    size: 20,
    totalElements: 1,
    totalPages: 1,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchOutfits', () => {
    it('should fetch outfits successfully', async () => {
      vi.mocked(outfitsAPI.getAll).mockResolvedValue(mockPaginatedResponse);

      const { result } = renderHook(() => useOutfits());

      expect(result.current.isLoading).toBe(false);
      expect(result.current.outfits).toEqual([]);

      await act(async () => {
        await result.current.fetchOutfits();
      });

      expect(outfitsAPI.getAll).toHaveBeenCalledWith(0, 20);
      expect(result.current.outfits).toEqual([mockOutfit]);
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
      vi.mocked(outfitsAPI.getAll).mockRejectedValue(error);

      const { result } = renderHook(() => useOutfits());

      await act(async () => {
        try {
          await result.current.fetchOutfits();
        } catch (err) {
          // Expected to throw
        }
      });

      expect(result.current.error).toBe('Failed to fetch outfits');
      expect(result.current.isLoading).toBe(false);
    });

    it('should fetch with pagination', async () => {
      vi.mocked(outfitsAPI.getAll).mockResolvedValue(mockPaginatedResponse);

      const { result } = renderHook(() => useOutfits());

      await act(async () => {
        await result.current.fetchOutfits(1);
      });

      expect(outfitsAPI.getAll).toHaveBeenCalledWith(1, 20);
    });
  });

  describe('createOutfit', () => {
    it('should create outfit with optimistic update', async () => {
      const formData: OutfitFormData = {
        name: 'New Outfit',
        notes: 'New notes',
        items: [
          {
            clothingItemId: 1,
            position: 'TOP' as ItemPosition,
          },
        ],
      };

      const createdOutfit: Outfit = {
        id: 2,
        name: formData.name,
        notes: formData.notes,
        items: [],
        isComplete: false,
        createdAt: '2024-01-02T00:00:00Z',
        updatedAt: '2024-01-02T00:00:00Z',
      };

      vi.mocked(outfitsAPI.create).mockResolvedValue(createdOutfit);

      const { result } = renderHook(() => useOutfits());

      // Initially empty
      expect(result.current.outfits).toEqual([]);

      await act(async () => {
        await result.current.createOutfit(formData);
      });

      // Should have the created outfit
      expect(result.current.outfits).toHaveLength(1);
      expect(result.current.outfits[0]).toEqual(createdOutfit);
      expect(outfitsAPI.create).toHaveBeenCalledWith(formData);
    });

    it('should revert optimistic update on create failure', async () => {
      const formData: OutfitFormData = {
        name: 'New Outfit',
        items: [
          {
            clothingItemId: 1,
            position: 'TOP' as ItemPosition,
          },
        ],
      };

      const error = new Error('Create failed');
      vi.mocked(outfitsAPI.create).mockRejectedValue(error);

      const { result } = renderHook(() => useOutfits());

      await act(async () => {
        try {
          await result.current.createOutfit(formData);
        } catch (err) {
          // Expected to throw
        }
      });

      // Should revert to empty
      expect(result.current.outfits).toEqual([]);
      expect(result.current.error).toBe('Failed to create outfit');
    });
  });

  describe('updateOutfit', () => {
    it('should update outfit with optimistic update', async () => {
      // Setup initial state with an outfit
      vi.mocked(outfitsAPI.getAll).mockResolvedValue(mockPaginatedResponse);

      const { result } = renderHook(() => useOutfits());

      await act(async () => {
        await result.current.fetchOutfits();
      });

      const updateData: Partial<OutfitFormData> = {
        name: 'Updated Outfit',
        notes: 'Updated notes',
      };

      const updatedOutfit: Outfit = {
        ...mockOutfit,
        name: 'Updated Outfit',
        notes: 'Updated notes',
        updatedAt: '2024-01-02T00:00:00Z',
      };

      vi.mocked(outfitsAPI.update).mockResolvedValue(updatedOutfit);

      await act(async () => {
        await result.current.updateOutfit(1, updateData);
      });

      expect(result.current.outfits[0].name).toBe('Updated Outfit');
      expect(result.current.outfits[0].notes).toBe('Updated notes');
      expect(outfitsAPI.update).toHaveBeenCalledWith(1, updateData);
    });

    it('should revert optimistic update on update failure', async () => {
      // Setup initial state
      vi.mocked(outfitsAPI.getAll).mockResolvedValue(mockPaginatedResponse);

      const { result } = renderHook(() => useOutfits());

      await act(async () => {
        await result.current.fetchOutfits();
      });

      const originalName = result.current.outfits[0].name;

      const updateData: Partial<OutfitFormData> = {
        name: 'Updated Outfit',
      };

      const error = new Error('Update failed');
      vi.mocked(outfitsAPI.update).mockRejectedValue(error);

      await act(async () => {
        try {
          await result.current.updateOutfit(1, updateData);
        } catch (err) {
          // Expected to throw
        }
      });

      // Should revert to original
      expect(result.current.outfits[0].name).toBe(originalName);
      expect(result.current.error).toBe('Failed to update outfit');
    });

    it('should throw error when updating non-existent outfit', async () => {
      const { result } = renderHook(() => useOutfits());

      const updateData: Partial<OutfitFormData> = {
        name: 'Updated Outfit',
      };

      await act(async () => {
        await expect(result.current.updateOutfit(999, updateData)).rejects.toThrow('Outfit not found');
      });
    });
  });

  describe('deleteOutfit', () => {
    it('should delete outfit with optimistic update', async () => {
      // Setup initial state
      vi.mocked(outfitsAPI.getAll).mockResolvedValue(mockPaginatedResponse);

      const { result } = renderHook(() => useOutfits());

      await act(async () => {
        await result.current.fetchOutfits();
      });

      expect(result.current.outfits).toHaveLength(1);

      vi.mocked(outfitsAPI.delete).mockResolvedValue(undefined);

      await act(async () => {
        await result.current.deleteOutfit(1);
      });

      expect(result.current.outfits).toHaveLength(0);
      expect(outfitsAPI.delete).toHaveBeenCalledWith(1);
    });

    it('should revert optimistic update on delete failure', async () => {
      // Setup initial state
      vi.mocked(outfitsAPI.getAll).mockResolvedValue(mockPaginatedResponse);

      const { result } = renderHook(() => useOutfits());

      await act(async () => {
        await result.current.fetchOutfits();
      });

      const error = new Error('Delete failed');
      vi.mocked(outfitsAPI.delete).mockRejectedValue(error);

      await act(async () => {
        try {
          await result.current.deleteOutfit(1);
        } catch (err) {
          // Expected to throw
        }
      });

      // Should revert - outfit still there
      expect(result.current.outfits).toHaveLength(1);
      expect(result.current.error).toBe('Failed to delete outfit');
    });

    it('should throw error when deleting non-existent outfit', async () => {
      const { result } = renderHook(() => useOutfits());

      await act(async () => {
        await expect(result.current.deleteOutfit(999)).rejects.toThrow('Outfit not found');
      });
    });
  });
});
