import React from 'react';
import { OutfitRecommendation } from '../../../types';
import { Button } from '../../common/Button';
import { LazyImage } from '../../common/LazyImage';
import { getScoreColor, formatScore, getScoreLabel } from '../../../utils/scores';

export interface RecommendationCardProps {
  recommendation: OutfitRecommendation;
  onSave: (recommendation: OutfitRecommendation) => Promise<void>;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = React.memo(({
  recommendation,
  onSave,
}) => {
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(recommendation);
    } catch (error) {
      // Error handling is delegated to the parent component
      // We just ensure the button is re-enabled
    } finally {
      setIsSaving(false);
    }
  };

  const placeholderImage = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"%3E%3Crect fill="%23e5e7eb" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="16" fill="%239ca3af"%3ENo Photo%3C/text%3E%3C/svg%3E';

  const getColorClasses = (color: string): string => {
    switch (color) {
      case 'green':
        return 'bg-green-100 text-green-800';
      case 'yellow':
        return 'bg-yellow-100 text-yellow-800';
      case 'orange':
        return 'bg-orange-100 text-orange-800';
      case 'red':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const colorCompatibilityColor = getScoreColor(recommendation.colorCompatibilityScore);
  const fitCompatibilityColor = getScoreColor(recommendation.fitCompatibilityScore);
  const overallScoreColor = getScoreColor(recommendation.overallScore);

  const showSeasonalWarning = recommendation.seasonalAppropriateness === 'WARNING' || 
                               recommendation.seasonalAppropriateness === 'NOT_APPROPRIATE';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Item Photos Grid */}
      <div className="relative w-full h-64 bg-gray-100">
        {recommendation.items.length > 0 ? (
          <div
            className="grid h-full"
            style={{
              gridTemplateColumns: 
                recommendation.items.length === 1
                  ? '1fr'
                  : recommendation.items.length === 2
                  ? 'repeat(2, 1fr)'
                  : recommendation.items.length === 3
                  ? 'repeat(3, 1fr)'
                  : 'repeat(2, 1fr)',
              gridTemplateRows: recommendation.items.length === 4 ? 'repeat(2, 1fr)' : '1fr'
            }}
          >
            {recommendation.items.slice(0, 4).map((item) => (
              <div key={item.id} className="relative w-full h-full bg-gray-50 overflow-hidden">
                <LazyImage
                  src={item.photoUrl || placeholderImage}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  placeholderSrc={placeholderImage}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-50">
            <LazyImage
              src={placeholderImage}
              alt="No items"
              className="w-full h-full object-contain"
              placeholderSrc={placeholderImage}
            />
          </div>
        )}

        {/* Seasonal Warning Indicator */}
        {showSeasonalWarning && (
          <div className="absolute top-2 right-2">
            <span
              className="inline-flex items-center px-2 py-1 text-xs font-medium rounded bg-yellow-100 text-yellow-800"
              aria-label="Seasonal appropriateness warning"
              title="This outfit may not be appropriate for the current season"
            >
              <svg
                className="w-3 h-3 mr-1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              Seasonal Warning
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Overall Score */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900">Overall Score</h3>
            <span
              className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded ${getColorClasses(
                overallScoreColor
              )}`}
              aria-label={`Overall score: ${formatScore(recommendation.overallScore)} - ${getScoreLabel(
                recommendation.overallScore
              )}`}
            >
              {formatScore(recommendation.overallScore)} - {getScoreLabel(recommendation.overallScore)}
            </span>
          </div>
        </div>

        {/* Compatibility Scores */}
        <div className="space-y-3 mb-4">
          {/* Color Compatibility */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">Color Compatibility</span>
              <span
                className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded ${getColorClasses(
                  colorCompatibilityColor
                )}`}
                aria-label={`Color compatibility: ${formatScore(
                  recommendation.colorCompatibilityScore
                )}`}
              >
                {formatScore(recommendation.colorCompatibilityScore)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  colorCompatibilityColor === 'green'
                    ? 'bg-green-500'
                    : colorCompatibilityColor === 'yellow'
                    ? 'bg-yellow-500'
                    : colorCompatibilityColor === 'orange'
                    ? 'bg-orange-500'
                    : 'bg-red-500'
                }`}
                style={{ width: `${recommendation.colorCompatibilityScore}%` }}
                role="progressbar"
                aria-valuenow={recommendation.colorCompatibilityScore}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
          </div>

          {/* Fit Compatibility */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">Fit Compatibility</span>
              <span
                className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded ${getColorClasses(
                  fitCompatibilityColor
                )}`}
                aria-label={`Fit compatibility: ${formatScore(
                  recommendation.fitCompatibilityScore
                )}`}
              >
                {formatScore(recommendation.fitCompatibilityScore)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  fitCompatibilityColor === 'green'
                    ? 'bg-green-500'
                    : fitCompatibilityColor === 'yellow'
                    ? 'bg-yellow-500'
                    : fitCompatibilityColor === 'orange'
                    ? 'bg-orange-500'
                    : 'bg-red-500'
                }`}
                style={{ width: `${recommendation.fitCompatibilityScore}%` }}
                role="progressbar"
                aria-valuenow={recommendation.fitCompatibilityScore}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
          </div>
        </div>

        {/* Explanation */}
        {recommendation.explanation && (
          <div className="mb-4">
            <p className="text-sm text-gray-600">{recommendation.explanation}</p>
          </div>
        )}

        {/* Item List */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Items in this outfit:</h4>
          <ul className="space-y-1">
            {recommendation.items.map((item) => (
              <li key={item.id} className="text-sm text-gray-600 flex items-center">
                <span className="inline-block w-2 h-2 rounded-full bg-gray-400 mr-2" aria-hidden="true" />
                {item.name}
                {item.brand && <span className="text-gray-500 ml-1">({item.brand})</span>}
              </li>
            ))}
          </ul>
        </div>

        {/* Save Button */}
        <Button
          onClick={handleSave}
          disabled={isSaving}
          loading={isSaving}
          fullWidth
          aria-label="Save this recommendation as an outfit"
        >
          {isSaving ? 'Saving...' : 'Save as Outfit'}
        </Button>
      </div>
    </div>
  );
});
