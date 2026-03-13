import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useRecommendations } from './useRecommendations';
import recommendationsAPI from '../api/recommendations';
import {
  ClothingCategory,
  Season,
  type OutfitRecommendation,
  type RecommendationFilters,
  type ClothingItem,
} from '../types';

// Mock the APIs
vi.mock('../api/recommendations', () => ({
  default: {
    getRecommendations: vi.fn(),
  },
}));

// Mock useOutfits hook
vi.mock('./useOutfits', () => ({
  useOutfits: () => ({
    createOutfit: vi.fn().mockResolvedValue({
      id: 1,
      name: 'Saved Recommendation',
      notes: 'Test explanation',
      items: [],
      isComplete: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    }),
  }),
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
    it('should convert recommendation to outfit and save', async () => {
      const { result } = renderHook(() => useRecommendations());

      const outfitName = 'My Saved Outfit';

      await act(async () => {
        const outfit = await result.current.saveRecommendation(mockRecommendation, outfitName);
        expect(outfit).toBeDefined();
        expect(outfit.name).toBe('Saved Recommendation');
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

      const { result } = renderHook(() => useRecommendations());

      await act(async () => {
        const outfit = await result.current.saveRecommendation(
          multiItemRecommendation,
          'Multi-Item Outfit'
        );
        expect(outfit).toBeDefined();
      });
    });

    it('should include explanation as notes', async () => {
      const { result } = renderHook(() => useRecommendations());

      await act(async () => {
        const outfit = await result.current.saveRecommendation(mockRecommendation, 'Test Outfit');
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
