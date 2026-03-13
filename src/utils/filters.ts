import { ClothingItem, ClothingItemFilters, Season } from '../types';

/**
 * Apply filters to a list of clothing items
 * 
 * Filters are applied in combination - an item must match ALL active filters to be included.
 * 
 * @param items - Array of clothing items to filter
 * @param filters - Filter criteria to apply
 * @returns Filtered array of clothing items
 * 
 * Requirements: 6.1, 6.2, 6.3, 6.4, 6.5
 */
export function applyFilters(
  items: ClothingItem[],
  filters: ClothingItemFilters
): ClothingItem[] {
  let filteredItems = [...items];

  // Apply category filter
  if (filters.category) {
    filteredItems = filteredItems.filter(item => item.category === filters.category);
  }

  // Apply season filter
  // Items marked as ALL_SEASON should match any season filter
  if (filters.season) {
    filteredItems = filteredItems.filter(item => 
      item.season === filters.season || item.season === Season.ALL_SEASON
    );
  }

  // Apply color filter
  // Match against both primary and secondary colors (case-insensitive)
  if (filters.color) {
    const colorQuery = filters.color.toLowerCase();
    filteredItems = filteredItems.filter(item => 
      item.primaryColor.toLowerCase() === colorQuery ||
      item.secondaryColor?.toLowerCase() === colorQuery
    );
  }

  // Apply search query
  // Search in both name and brand fields (case-insensitive)
  if (filters.searchQuery) {
    const query = filters.searchQuery.toLowerCase();
    filteredItems = filteredItems.filter(item =>
      item.name.toLowerCase().includes(query) ||
      item.brand?.toLowerCase().includes(query)
    );
  }

  return filteredItems;
}
