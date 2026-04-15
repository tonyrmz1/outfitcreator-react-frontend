import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useRecommendations } from '../data/useRecommendations';
import recommendationsAPI from '../../api/endpoints/recommendations';
import {
  ClothingCategory,
  Season,
  type OutfitRecommendation,
  type RecommendationFilters,
  type ClothingItem,
  type Outfit,
} from '../../types';

// Mock the API (path must match what useRecommendations imports)
vi.mock('../../api/endpoints/recommendations', () => ({
  default: {
    getRecommendations: vi.fn(),
  },
}));

describe('useRecommendations', () => {
  const mockClothingItem: ClothingItem = {
    id: 1,
    name: 'Test Shirt',
    primaryColor: 'blue',
    category: ClothingCategory.TOP,
    wearCount: 0,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  };

  const mockRecommendation: OutfitRecommendation = {
    items: [mockClothingItem],
    colorCompatibilityScore: 85,
    fitCompatibilityScore: 90,
    overallScore: 87.5,
    seasonalAppropriateness: 'APPROPRIATE',
    itemPositions: {
      '1': 'TOP',
    },
    explanation: 'This outfit has great color harmony',
  };

  const mockFilters: RecommendationFilters = {
    season: Season.SPRING,
    limit: 5,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchRecommendations', () => {
    it('should fetch recommendations successfully', async () => {
      vi.mocked(recommendationsAPI.getRecommendations).mockResolvedValue([mockRecommendation]);

      const { result } = renderHook(() => useRecommendations());

      expect(result.current.isLoading).toBe(false);
      expect(result.current.recommendations).toEqual([]);

      await act(async () => {
        await result.current.fetchRecommendations(mockFilters);
      });

      expect(recommendationsAPI.getRecommendations).toHaveBeenCalledWith(mockFilters);
      expect(result.current.recommendations).toEqual([mockRecommendation]);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should handle fetch errors', async () => {
      const error = new Error('Network error');
      vi.mocked(recommendationsAPI.getRecommendations).mockRejectedValue(error);

      const { result } = renderHook(() => useRecommendations());

      await act(async () => {
        try {
          await result.current.fetchRecommendations(mockFilters);
        } catch (err) {
          // Expected to throw
        }
      });

      expect(result.current.error).toBe('Failed to fetch recommendations');
      expect(result.current.isLoading).toBe(false);
    });

    it('should clear error on successful fetch', async () => {
      // First, trigger an error
      const error = new Error('Network error');
      vi.mocked(recommendationsAPI.getRecommendations).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useRecommendations());

      await act(async () => {
        try {
          await result.current.fetchRecommendations(mockFilters);
        } catch (err) {
          // Expected to throw
        }
      });

      expect(result.current.error).toBe('Failed to fetch recommendations');

      // Now succeed
      vi.mocked(recommendationsAPI.getRecommendations).mockResolvedValue([mockRecommendation]);

      await act(async () => {
        await result.current.fetchRecommendations(mockFilters);
      });

      expect(result.current.error).toBeNull();
      expect(result.current.recommendations).toEqual([mockRecommendation]);
    });

    it('should handle empty recommendations', async () => {
      vi.mocked(recommendationsAPI.getRecommendations).mockResolvedValue([]);

      const { result } = renderHook(() => useRecommendations());

      await act(async () => {
        await result.current.fetchRecommendations(mockFilters);
      });

      expect(result.current.recommendations).toEqual([]);
      expect(result.current.error).toBeNull();
    });
  });

  describe('saveRecommendation', () => {
    const savedOutfit: Outfit = {
      id: 1,
      name: 'My Saved Outfit',
      notes: 'Test explanation',
      items: [],
      isComplete: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    };

    it('should convert recommendation to outfit and save', async () => {
      const createOutfit = vi.fn().mockResolvedValue(savedOutfit);
      const { result } = renderHook(() => useRecommendations());

      const outfitName = 'My Saved Outfit';

      await act(async () => {
        const outfit = await result.current.saveRecommendation(mockRecommendation, outfitName, createOutfit);
        expect(outfit).toBeDefined();
        expect(outfit.name).toBe('My Saved Outfit');
      });

      expect(createOutfit).toHaveBeenCalledWith({
        name: outfitName,
        notes: mockRecommendation.explanation,
        items: [
          {
            clothingItemId: mockClothingItem.id,
            position: 'TOP',
          },
        ],
      });
    });

    it('should convert recommendation with multiple items', async () => {
      const multiItemRecommendation: OutfitRecommendation = {
        items: [
          mockClothingItem,
          {
            id: 2,
            name: 'Test Pants',
            primaryColor: 'black',
            category: ClothingCategory.BOTTOM,
            wearCount: 0,
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
          },
        ],
        colorCompatibilityScore: 85,
        fitCompatibilityScore: 90,
        overallScore: 87.5,
        seasonalAppropriateness: 'APPROPRIATE',
        itemPositions: {
          '1': 'TOP',
          '2': 'BOTTOM',
        },
        explanation: 'Great combination',
      };

      const createOutfit = vi.fn().mockResolvedValue(savedOutfit);
      const { result } = renderHook(() => useRecommendations());

      await act(async () => {
        const outfit = await result.current.saveRecommendation(
          multiItemRecommendation,
          'Multi-Item Outfit',
          createOutfit
        );
        expect(outfit).toBeDefined();
      });

      expect(createOutfit).toHaveBeenCalledWith({
        name: 'Multi-Item Outfit',
        notes: 'Great combination',
        items: [
          { clothingItemId: 1, position: 'TOP' },
          { clothingItemId: 2, position: 'BOTTOM' },
        ],
      });
    });

    it('should include explanation as notes', async () => {
      const createOutfit = vi.fn().mockResolvedValue(savedOutfit);
      const { result } = renderHook(() => useRecommendations());

      await act(async () => {
        const outfit = await result.current.saveRecommendation(mockRecommendation, 'Test Outfit', createOutfit);
        expect(outfit.notes).toBe('Test explanation');
      });
    });
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useRecommendations());

      expect(result.current.recommendations).toEqual([]);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });
});
