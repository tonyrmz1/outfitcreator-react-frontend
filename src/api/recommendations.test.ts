import { describe, it, expect, vi, beforeEach } from 'vitest';
import recommendationsAPI from './recommendations';
import apiClient from './client';
import type { OutfitRecommendation, RecommendationFilters } from '../types';
import { ClothingCategory, Season } from '../types';

// Mock the apiClient
vi.mock('./client', () => ({
  default: {
    get: vi.fn(),
  },
}));

describe('RecommendationsAPI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockRecommendation: OutfitRecommendation = {
    items: [
      {
        id: 1,
        name: 'Blue Jeans',
        primaryColor: 'blue',
        category: ClothingCategory.BOTTOM,
        wearCount: 5,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
      {
        id: 2,
        name: 'White T-Shirt',
        primaryColor: 'white',
        category: ClothingCategory.TOP,
        wearCount: 3,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
    ],
    colorCompatibilityScore: 85,
    fitCompatibilityScore: 90,
    overallScore: 87.5,
    seasonalAppropriateness: 'APPROPRIATE',
    itemPositions: {
      '1': 'BOTTOM',
      '2': 'TOP',
    },
    explanation: 'Classic combination with excellent color harmony',
  };

  describe('getRecommendations', () => {
    it('should call apiClient.get with correct endpoint and filters', async () => {
      const filters: RecommendationFilters = {
        season: Season.SUMMER,
        occasion: 'casual',
        colorPreference: 'blue',
        limit: 10,
      };

      const mockResponse: OutfitRecommendation[] = [mockRecommendation];

      vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

      const result = await recommendationsAPI.getRecommendations(filters);

      expect(apiClient.get).toHaveBeenCalledWith('/api/recommendations', filters);
      expect(result).toEqual(mockResponse);
    });

    it('should call apiClient.get with minimal filters', async () => {
      const filters: RecommendationFilters = {
        limit: 5,
      };

      const mockResponse: OutfitRecommendation[] = [mockRecommendation];

      vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

      const result = await recommendationsAPI.getRecommendations(filters);

      expect(apiClient.get).toHaveBeenCalledWith('/api/recommendations', filters);
      expect(result).toEqual(mockResponse);
    });

    it('should handle empty recommendations array', async () => {
      const filters: RecommendationFilters = {
        season: Season.WINTER,
        limit: 10,
      };

      const mockResponse: OutfitRecommendation[] = [];

      vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

      const result = await recommendationsAPI.getRecommendations(filters);

      expect(apiClient.get).toHaveBeenCalledWith('/api/recommendations', filters);
      expect(result).toEqual([]);
    });

    it('should handle multiple recommendations', async () => {
      const filters: RecommendationFilters = {
        limit: 20,
      };

      const mockRecommendation2: OutfitRecommendation = {
        items: [
          {
            id: 3,
            name: 'Black Dress',
            primaryColor: 'black',
            category: ClothingCategory.TOP,
            wearCount: 2,
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
          },
        ],
        colorCompatibilityScore: 95,
        fitCompatibilityScore: 88,
        overallScore: 91.5,
        seasonalAppropriateness: 'APPROPRIATE',
        itemPositions: {
          '3': 'TOP',
        },
        explanation: 'Elegant and versatile outfit',
      };

      const mockResponse: OutfitRecommendation[] = [mockRecommendation, mockRecommendation2];

      vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

      const result = await recommendationsAPI.getRecommendations(filters);

      expect(apiClient.get).toHaveBeenCalledWith('/api/recommendations', filters);
      expect(result).toEqual(mockResponse);
      expect(result).toHaveLength(2);
    });

    it('should handle recommendations with seasonal warnings', async () => {
      const filters: RecommendationFilters = {
        season: Season.WINTER,
        limit: 10,
      };

      const warningRecommendation: OutfitRecommendation = {
        ...mockRecommendation,
        seasonalAppropriateness: 'WARNING',
        explanation: 'May not be ideal for winter weather',
      };

      const mockResponse: OutfitRecommendation[] = [warningRecommendation];

      vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

      const result = await recommendationsAPI.getRecommendations(filters);

      expect(apiClient.get).toHaveBeenCalledWith('/api/recommendations', filters);
      expect(result[0].seasonalAppropriateness).toBe('WARNING');
    });
  });
});
