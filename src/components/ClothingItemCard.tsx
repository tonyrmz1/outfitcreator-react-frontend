import React from 'react';
import { ClothingItem } from '../types';
import { Button } from './Button';
import { LazyImage } from './LazyImage';

export interface ClothingItemCardProps {
  item: ClothingItem;
  onEdit?: (item: ClothingItem) => void;
  onDelete?: (itemId: number) => void;
  onClick?: (item: ClothingItem) => void;
  selectable?: boolean;
  selected?: boolean;
}

export const ClothingItemCard: React.FC<ClothingItemCardProps> = React.memo(({
  item,
  onEdit,
  onDelete,
  onClick,
  selectable = false,
  selected = false,
}) => {
  const handleCardClick = () => {
    if (selectable && onClick) {
      onClick(item);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(item);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(item.id);
    }
  };

  const cardClasses = `
    bg-white rounded-lg shadow-md overflow-hidden transition-all
    ${selectable ? 'cursor-pointer hover:shadow-lg' : ''}
    ${selected ? 'ring-4 ring-primary-500' : ''}
  `.trim();

  const placeholderImage = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"%3E%3Crect fill="%23e5e7eb" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="16" fill="%239ca3af"%3ENo Photo%3C/text%3E%3C/svg%3E';

  return (
    <div
      className={cardClasses}
      onClick={handleCardClick}
      role={selectable ? 'button' : undefined}
      tabIndex={selectable ? 0 : undefined}
      onKeyDown={
        selectable
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleCardClick();
              }
            }
          : undefined
      }
      aria-pressed={selectable ? selected : undefined}
    >
      {/* Photo */}
      <div className="relative w-full h-48 bg-gray-50">
        <LazyImage
          src={item.photoUrl || placeholderImage}
          alt={item.name}
          className="w-full h-full object-contain"
          placeholderSrc={placeholderImage}
        />
        {selected && (
          <div className="absolute top-2 right-2 bg-primary-600 text-white rounded-full p-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
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
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Name and Brand */}
        <div className="mb-2">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {item.name}
          </h3>
          {item.brand && (
            <p className="text-sm text-gray-600 truncate">{item.brand}</p>
          )}
        </div>

        {/* Category */}
        <div className="mb-3">
          <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded">
            {item.category}
          </span>
        </div>

        {/* Color Indicators */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm text-gray-600">Colors:</span>
          <div className="flex items-center gap-1">
            <div
              className="w-6 h-6 rounded-full border-2 border-gray-300"
              style={{ backgroundColor: item.primaryColor }}
              title={`Primary color: ${item.primaryColor}`}
              aria-label={`Primary color: ${item.primaryColor}`}
            />
            {item.secondaryColor && (
              <div
                className="w-6 h-6 rounded-full border-2 border-gray-300"
                style={{ backgroundColor: item.secondaryColor }}
                title={`Secondary color: ${item.secondaryColor}`}
                aria-label={`Secondary color: ${item.secondaryColor}`}
              />
            )}
          </div>
        </div>

        {/* Action Buttons */}
        {(onEdit || onDelete) && (
          <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
            {onEdit && (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleEdit}
                fullWidth
                aria-label={`Edit ${item.name}`}
              >
                Edit
              </Button>
            )}
            {onDelete && (
              <Button
                variant="danger"
                size="sm"
                onClick={handleDelete}
                fullWidth
                aria-label={`Delete ${item.name}`}
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
