import { useState } from 'react';
import recommendationsAPI from '../api/recommendations';
import { useOutfits } from './useOutfits';
import type {
  OutfitRecommendation,
  RecommendationFilters,
  Outfit,
  OutfitFormData,
  ItemPosition,
} from '../types';

interface UseRecommendationsReturn {
  recommendations: OutfitRecommendation[];
  isLoading: boolean;
  error: string | null;
  fetchRecommendations: (filters: RecommendationFilters) => Promise<void>;
  saveRecommendation: (recommendation: OutfitRecommendation, name: string) => Promise<Outfit>;
}

/**
 * Custom hook for managing outfit recommendations
 * Requirements: 9.1, 9.8
 */
export function useRecommendations(): UseRecommendationsReturn {
  const [recommendations, setRecommendations] = useState<OutfitRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { createOutfit } = useOutfits();

  /**
   * Fetch outfit recommendations based on filters
   * @param filters - Filters for season, occasion, color preference, and limit
   */
  const fetchRecommendations = async (filters: RecommendationFilters): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const recs = await recommendationsAPI.getRecommendations(filters);
      setRecommendations(recs);
    } catch (err) {
      const errorMessage = 'Failed to fetch recommendations';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Save a recommendation as an outfit
   * Converts recommendation to outfit format and creates it
   * @param recommendation - The recommendation to save
   * @param name - The name for the new outfit
   * @returns Promise resolving to the created outfit
   */
  const saveRecommendation = async (
    recommendation: OutfitRecommendation,
    name: string
  ): Promise<Outfit> => {
    // Convert recommendation to outfit format
    const outfitData: OutfitFormData = {
      name,
      notes: recommendation.explanation,
      items: recommendation.items.map((item) => ({
        clothingItemId: item.id,
        position: recommendation.itemPositions[item.id.toString()] as ItemPosition,
      })),
    };
    return createOutfit(outfitData);
  };

  return {
    recommendations,
    isLoading,
    error,
    fetchRecommendations,
    saveRecommendation,
  };
}
