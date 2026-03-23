import React, { useState, useEffect } from 'react';
import { useRecommendations } from '../hooks/data/useRecommendations';
import { useOutfits } from '../hooks/data/useOutfits';
import { RecommendationCard } from '../components/features/Recommendations/RecommendationCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { Select } from '../components/common/Select';
import { Input } from '../components/common/Input';
import { NameOutfitModal } from '../components/common/NameOutfitModal';
import { Season, type OutfitRecommendation, type RecommendationFilters } from '../types';

/**
 * RecommendationsPage - AI-powered outfit recommendations page
 * 
 * Features:
 * - Display outfit recommendations with compatibility scores
 * - Filter by season, color preference, and limit
 * - Save recommendations as outfits
 * - Loading and error states with retry
 * - Success message after saving
 * 
 * Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 9.8, 9.9, 13.2, 14.1, 14.3
 */
export const RecommendationsPage: React.FC = () => {
  const { createOutfit } = useOutfits();
  const {
    recommendations,
    isLoading,
    error,
    fetchRecommendations,
    saveRecommendation,
  } = useRecommendations();

  const [filters, setFilters] = useState<RecommendationFilters>({
    limit: 10,
  });

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingRecommendation, setPendingRecommendation] = useState<OutfitRecommendation | null>(null);

  // Fetch recommendations on mount and when filters change
  useEffect(() => {
    fetchRecommendations(filters);
  }, [filters]);

  const handleSeasonChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      season: value ? (value as Season) : undefined,
    }));
  };

  const handleColorPreferenceChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      colorPreference: value || undefined,
    }));
  };

  const handleLimitChange = (value: string) => {
    const limit = parseInt(value, 10);
    if (!isNaN(limit) && limit > 0) {
      setFilters((prev) => ({
        ...prev,
        limit,
      }));
    }
  };

  const handleSaveRecommendation = (recommendation: OutfitRecommendation) => {
    setPendingRecommendation(recommendation);
    setModalOpen(true);
  };

  const handleModalConfirm = async (name: string) => {
    setModalOpen(false);
    if (!pendingRecommendation) return;
    try {
      await saveRecommendation(pendingRecommendation, name, createOutfit);
      setSuccessMessage(`Outfit "${name}" saved successfully!`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Failed to save recommendation:', err);
    } finally {
      setPendingRecommendation(null);
    }
  };

  const handleModalCancel = () => {
    setModalOpen(false);
    setPendingRecommendation(null);
  };

  const handleRetry = () => {
    fetchRecommendations(filters);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Outfit Recommendations</h1>
        <p className="text-gray-600">
          Discover AI-powered outfit suggestions based on your wardrobe
        </p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div
          className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4"
          role="alert"
          aria-live="polite"
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-green-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-800">{successMessage}</p>
            </div>
            <div className="ml-auto pl-3">
              <button
                type="button"
                onClick={() => setSuccessMessage(null)}
                className="inline-flex rounded-md bg-green-50 p-1.5 text-green-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-green-50"
                aria-label="Dismiss success message"
              >
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Controls */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Season Filter */}
          <Select
            label="Season"
            value={filters.season || ''}
            onChange={handleSeasonChange}
            options={[
              { value: '', label: 'All Seasons' },
              { value: Season.SPRING, label: 'Spring' },
              { value: Season.SUMMER, label: 'Summer' },
              { value: Season.AUTUMN, label: 'Autumn' },
              { value: Season.WINTER, label: 'Winter' },
            ]}
          />

          {/* Color Preference Filter */}
          <Input
            label="Color Preference"
            type="text"
            value={filters.colorPreference || ''}
            onChange={(e) => handleColorPreferenceChange(e.target.value)}
            placeholder="e.g., blue, red"
          />

          {/* Limit Filter */}
          <Input
            label="Number of Recommendations"
            type="number"
            value={filters.limit.toString()}
            onChange={(e) => handleLimitChange(e.target.value)}
            placeholder="10"
            min="1"
            max="50"
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6">
          <ErrorMessage message={error} onRetry={handleRetry} />
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {/* Recommendations Grid */}
      {!isLoading && recommendations.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((recommendation, index) => (
            <RecommendationCard
              key={index}
              recommendation={recommendation}
              onSave={handleSaveRecommendation}
            />
          ))}
        </div>
      )}

      {/* Name Outfit Modal */}
      <NameOutfitModal
        isOpen={modalOpen}
        onConfirm={handleModalConfirm}
        onCancel={handleModalCancel}
      />

      {/* Empty State */}
      {!isLoading && recommendations.length === 0 && !error && (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No recommendations</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your filters or add more items to your closet.
          </p>
        </div>
      )}
    </div>
  );
};

export default RecommendationsPage;
