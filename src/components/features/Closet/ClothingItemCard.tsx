import React from 'react';
import { ClothingItem } from '../../../types';
import { Button } from '../../common/Button';
import { LazyImage } from '../../common/LazyImage';

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
      <div className="p-4 relative">
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
              style={{ backgroundColor: /^#[0-9a-fA-F]{3,6}$|^[a-zA-Z]+$/.test(item.primaryColor) ? item.primaryColor : '#e5e7eb' }}
              title={`Primary color: ${item.primaryColor}`}
              aria-label={`Primary color: ${item.primaryColor}`}
            />
            {item.secondaryColor && (
              <div
                className="w-6 h-6 rounded-full border-2 border-gray-300"
                style={{ backgroundColor: /^#[0-9a-fA-F]{3,6}$|^[a-zA-Z]+$/.test(item.secondaryColor) ? item.secondaryColor : '#e5e7eb' }}
                title={`Secondary color: ${item.secondaryColor}`}
                aria-label={`Secondary color: ${item.secondaryColor}`}
              />
            )}
          </div>
        </div>

        {/* Action Icons */}
        {(onEdit || onDelete) && (
          <div className="absolute bottom-2 right-2 flex gap-1" onClick={(e) => e.stopPropagation()}>
            {onEdit && (
              <button
                onClick={handleEdit}
                className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-colors flex items-center justify-center"
                aria-label={`Edit ${item.name}`}
                title="Edit"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </button>
            )}
            {onDelete && (
              <button
                onClick={handleDelete}
                className="p-1.5 rounded-full bg-red-100 hover:bg-red-200 text-red-600 hover:text-red-800 transition-colors flex items-center justify-center"
                aria-label={`Delete ${item.name}`}
                title="Delete"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
});
