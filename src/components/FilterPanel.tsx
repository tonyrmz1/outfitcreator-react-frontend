import React, { useState, useEffect } from 'react';
import { ClothingItemFilters, ClothingCategory, Season } from '../types';
import { useDebounce } from '../hooks/useDebounce';
import { Input } from './Input';
import { Select, SelectOption } from './Select';
import { Button } from './Button';

export interface FilterPanelProps {
  filters: ClothingItemFilters;
  onFilterChange: (filters: ClothingItemFilters) => void;
  onReset?: () => void;
}

/**
 * FilterPanel component provides filtering controls for clothing items.
 * 
 * Features:
 * - Category filter (select dropdown)
 * - Season filter (select dropdown)
 * - Color filter (text input)
 * - Search query filter (text input with 300ms debounce)
 * - Active filter count badge
 * - Reset button to clear all filters
 * 
 * Requirements: 6.1, 6.2, 6.3, 6.4, 6.6, 6.8
 */
export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFilterChange,
  onReset,
}) => {
  // Local state for search query to enable debouncing
  const [searchQuery, setSearchQuery] = useState(filters.searchQuery || '');
  
  // Debounce search query by 300ms
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Update filters when debounced search query changes
  useEffect(() => {
    // Only update if the debounced value is different from the current filter
    // and skip the initial mount
    if (debouncedSearchQuery !== filters.searchQuery) {
      onFilterChange({
        ...filters,
        searchQuery: debouncedSearchQuery || undefined,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchQuery]);

  // Calculate active filter count
  const activeFilterCount = [
    filters.category,
    filters.season,
    filters.color,
    filters.searchQuery,
  ].filter(Boolean).length;

  // Category options
  const categoryOptions: SelectOption[] = [
    { value: '', label: 'All Categories' },
    { value: ClothingCategory.TOP, label: 'Top' },
    { value: ClothingCategory.BOTTOM, label: 'Bottom' },
    { value: ClothingCategory.FOOTWEAR, label: 'Footwear' },
    { value: ClothingCategory.OUTERWEAR, label: 'Outerwear' },
    { value: ClothingCategory.ACCESSORIES, label: 'Accessories' },
  ];

  // Season options
  const seasonOptions: SelectOption[] = [
    { value: '', label: 'All Seasons' },
    { value: Season.SPRING, label: 'Spring' },
    { value: Season.SUMMER, label: 'Summer' },
    { value: Season.AUTUMN, label: 'Autumn' },
    { value: Season.WINTER, label: 'Winter' },
    { value: Season.ALL_SEASON, label: 'All Season' },
  ];

  const handleCategoryChange = (value: string) => {
    onFilterChange({
      ...filters,
      category: value ? (value as ClothingCategory) : undefined,
    });
  };

  const handleSeasonChange = (value: string) => {
    onFilterChange({
      ...filters,
      season: value ? (value as Season) : undefined,
    });
  };

  const handleColorChange = (value: string) => {
    onFilterChange({
      ...filters,
      color: value || undefined,
    });
  };

  const handleReset = () => {
    setSearchQuery('');
    if (onReset) {
      onReset();
    } else {
      onFilterChange({});
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          Filters
          {activeFilterCount > 0 && (
            <span
              className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-primary-600 rounded-full"
              aria-label={`${activeFilterCount} active filter${activeFilterCount !== 1 ? 's' : ''}`}
            >
              {activeFilterCount}
            </span>
          )}
        </h2>
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            aria-label="Clear all filters"
          >
            Reset
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search Query Input */}
        <div>
          <Input
            label="Search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or brand..."
            id="filter-search"
            name="search"
          />
        </div>

        {/* Category Filter */}
        <div>
          <Select
            label="Category"
            value={filters.category || ''}
            onChange={handleCategoryChange}
            options={categoryOptions}
            id="filter-category"
            name="category"
          />
        </div>

        {/* Season Filter */}
        <div>
          <Select
            label="Season"
            value={filters.season || ''}
            onChange={handleSeasonChange}
            options={seasonOptions}
            id="filter-season"
            name="season"
          />
        </div>

        {/* Color Filter */}
        <div>
          <Input
            label="Color"
            type="text"
            value={filters.color || ''}
            onChange={(e) => handleColorChange(e.target.value)}
            placeholder="e.g., blue, red..."
            id="filter-color"
            name="color"
          />
        </div>
      </div>
    </div>
  );
};
