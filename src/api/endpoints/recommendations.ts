import apiClient from '../client';
import { OutfitRecommendation, RecommendationFilters } from '../../types';

/**
 * RecommendationsAPI service
 * Handles outfit recommendation requests
 * Requirements: 9.1
 */
class RecommendationsAPI {
  /**
   * Fetch outfit recommendations based on filters
   * @param filters - Optional filters for season, occasion, color preference, and limit
   * @returns Promise resolving to array of outfit recommendations
   */
  async getRecommendations(filters: RecommendationFilters): Promise<OutfitRecommendation[]> {
    return apiClient.get<OutfitRecommendation[]>('/api/recommendations', filters);
  }
}

const recommendationsAPI = new RecommendationsAPI();

export default recommendationsAPI;
