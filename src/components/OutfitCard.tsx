import React from 'react';
import { Outfit } from '../types';
import { Button } from './Button';

export interface OutfitCardProps {
  outfit: Outfit;
  onEdit?: (outfit: Outfit) => void;
  onDelete?: (outfitId: number) => void;
  onClick?: (outfit: Outfit) => void;
}

export const OutfitCard: React.FC<OutfitCardProps> = React.memo(({
  outfit,
  onEdit,
  onDelete,
  onClick,
}) => {
  const handleCardClick = () => {
    if (onClick) {
      onClick(outfit);
    }
  };

  const handleEditClick = () => {
    if (onEdit) {
      onEdit(outfit);
    }
  };

  const handleDeleteClick = () => {
    if (onDelete) {
      onDelete(outfit.id);
    }
  };

  const cardClasses = `
    bg-white rounded-lg shadow-md overflow-hidden transition-all
    ${onClick ? 'cursor-pointer hover:shadow-lg' : ''}
  `.trim();

  const placeholderImage = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"%3E%3Crect fill="%23e5e7eb" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="16" fill="%239ca3af"%3ENo Photo%3C/text%3E%3C/svg%3E';

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div
      className={cardClasses}
      onClick={handleCardClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleCardClick();
              }
            }
          : undefined
      }
    >
      {/* Item Photos Grid */}
      <div className="relative w-full h-48 bg-gray-100">
        {outfit.items.length > 0 ? (
          <div
            className={`grid h-full ${
              outfit.items.length === 1
                ? 'grid-cols-1'
                : outfit.items.length === 2
                ? 'grid-cols-2'
                : outfit.items.length === 3
                ? 'grid-cols-3'
                : 'grid-cols-2 grid-rows-2'
            }`}
          >
            {outfit.items.slice(0, 4).map((outfitItem) => (
              <div key={outfitItem.id} className="relative w-full h-full">
                <img
                  src={outfitItem.clothingItem.photoUrl || placeholderImage}
                  alt={outfitItem.clothingItem.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = placeholderImage;
                  }}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <img
              src={placeholderImage}
              alt="No items"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Completeness Indicator */}
        <div className="absolute top-2 right-2">
          <span
            className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded ${
              outfit.isComplete
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}
            aria-label={outfit.isComplete ? 'Complete outfit' : 'Incomplete outfit'}
          >
            {outfit.isComplete ? (
              <>
                <svg
                  className="w-3 h-3 mr-1"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Complete
              </>
            ) : (
              <>
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
                Incomplete
              </>
            )}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Name and Creation Date */}
        <div className="mb-2">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {outfit.name}
          </h3>
          <p className="text-xs text-gray-500">
            Created {formatDate(outfit.createdAt)}
          </p>
        </div>

        {/* Notes */}
        {outfit.notes && (
          <p className="text-sm text-gray-600 mb-3" title={outfit.notes}>
            {truncateText(outfit.notes, 100)}
          </p>
        )}

        {/* Item Count */}
        <div className="mb-3">
          <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded">
            {outfit.items.length} {outfit.items.length === 1 ? 'item' : 'items'}
          </span>
        </div>

        {/* Action Buttons */}
        {(onEdit || onDelete) && (
          <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
            {onEdit && (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleEditClick}
                fullWidth
                aria-label={`Edit ${outfit.name}`}
              >
                Edit
              </Button>
            )}
            {onDelete && (
              <Button
                variant="danger"
                size="sm"
                onClick={handleDeleteClick}
                fullWidth
                aria-label={`Delete ${outfit.name}`}
              >
                Delete
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
});
