import { describe, it, expect } from 'vitest';
import { applyFilters } from './filters';
import { ClothingItem, ClothingCategory, Season, FitCategory } from '../types';

// Helper function to create test clothing items
const createTestItem = (overrides: Partial<ClothingItem> = {}): ClothingItem => ({
  id: 1,
  name: 'Test Item',
  brand: 'Test Brand',
  primaryColor: 'Blue',
  secondaryColor: undefined,
  category: ClothingCategory.TOP,
  size: 'M',
  season: Season.SPRING,
  fitCategory: FitCategory.REGULAR,
  purchaseDate: '2024-01-01',
  photoUrl: 'https://example.com/photo.jpg',
  wearCount: 0,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  ...overrides,
});

describe('applyFilters', () => {
  describe('category filter', () => {
    it('should filter items by category', () => {
      const items: ClothingItem[] = [
        createTestItem({ id: 1, category: ClothingCategory.TOP }),
        createTestItem({ id: 2, category: ClothingCategory.BOTTOM }),
        createTestItem({ id: 3, category: ClothingCategory.TOP }),
      ];

      const result = applyFilters(items, { category: ClothingCategory.TOP });

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(1);
      expect(result[1].id).toBe(3);
    });

    it('should return all items when no category filter is applied', () => {
      const items: ClothingItem[] = [
        createTestItem({ id: 1, category: ClothingCategory.TOP }),
        createTestItem({ id: 2, category: ClothingCategory.BOTTOM }),
      ];

      const result = applyFilters(items, {});

      expect(result).toHaveLength(2);
    });
  });

  describe('season filter', () => {
    it('should filter items by season', () => {
      const items: ClothingItem[] = [
        createTestItem({ id: 1, season: Season.SPRING }),
        createTestItem({ id: 2, season: Season.SUMMER }),
        createTestItem({ id: 3, season: Season.SPRING }),
      ];

      const result = applyFilters(items, { season: Season.SPRING });

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(1);
      expect(result[1].id).toBe(3);
    });

    it('should include ALL_SEASON items when filtering by season', () => {
      const items: ClothingItem[] = [
        createTestItem({ id: 1, season: Season.SPRING }),
        createTestItem({ id: 2, season: Season.ALL_SEASON }),
        createTestItem({ id: 3, season: Season.SUMMER }),
      ];

      const result = applyFilters(items, { season: Season.SPRING });

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(1);
      expect(result[1].id).toBe(2);
    });

    it('should return all items when no season filter is applied', () => {
      const items: ClothingItem[] = [
        createTestItem({ id: 1, season: Season.SPRING }),
        createTestItem({ id: 2, season: Season.SUMMER }),
      ];

      const result = applyFilters(items, {});

      expect(result).toHaveLength(2);
    });
  });

  describe('color filter', () => {
    it('should filter items by primary color (case-insensitive)', () => {
      const items: ClothingItem[] = [
        createTestItem({ id: 1, primaryColor: 'Blue' }),
        createTestItem({ id: 2, primaryColor: 'Red' }),
        createTestItem({ id: 3, primaryColor: 'blue' }),
      ];

      const result = applyFilters(items, { color: 'blue' });

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(1);
      expect(result[1].id).toBe(3);
    });

    it('should filter items by secondary color', () => {
      const items: ClothingItem[] = [
        createTestItem({ id: 1, primaryColor: 'Red', secondaryColor: 'Blue' }),
        createTestItem({ id: 2, primaryColor: 'Green', secondaryColor: 'Yellow' }),
        createTestItem({ id: 3, primaryColor: 'Blue' }),
      ];

      const result = applyFilters(items, { color: 'blue' });

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(1);
      expect(result[1].id).toBe(3);
    });

    it('should return all items when no color filter is applied', () => {
      const items: ClothingItem[] = [
        createTestItem({ id: 1, primaryColor: 'Blue' }),
        createTestItem({ id: 2, primaryColor: 'Red' }),
      ];

      const result = applyFilters(items, {});

      expect(result).toHaveLength(2);
    });
  });

  describe('search query filter', () => {
    it('should filter items by name (case-insensitive)', () => {
      const items: ClothingItem[] = [
        createTestItem({ id: 1, name: 'Blue Shirt' }),
        createTestItem({ id: 2, name: 'Red Pants' }),
        createTestItem({ id: 3, name: 'Blue Jeans' }),
      ];

      const result = applyFilters(items, { searchQuery: 'blue' });

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(1);
      expect(result[1].id).toBe(3);
    });

    it('should filter items by brand (case-insensitive)', () => {
      const items: ClothingItem[] = [
        createTestItem({ id: 1, name: 'Shirt', brand: 'Nike' }),
        createTestItem({ id: 2, name: 'Pants', brand: 'Adidas' }),
        createTestItem({ id: 3, name: 'Shoes', brand: 'Nike' }),
      ];

      const result = applyFilters(items, { searchQuery: 'nike' });

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(1);
      expect(result[1].id).toBe(3);
    });

    it('should handle partial matches in search', () => {
      const items: ClothingItem[] = [
        createTestItem({ id: 1, name: 'T-Shirt' }),
        createTestItem({ id: 2, name: 'Shirt' }),
        createTestItem({ id: 3, name: 'Pants' }),
      ];

      const result = applyFilters(items, { searchQuery: 'shirt' });

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(1);
      expect(result[1].id).toBe(2);
    });

    it('should return all items when no search query is applied', () => {
      const items: ClothingItem[] = [
        createTestItem({ id: 1, name: 'Shirt' }),
        createTestItem({ id: 2, name: 'Pants' }),
      ];

      const result = applyFilters(items, {});

      expect(result).toHaveLength(2);
    });
  });

  describe('combined filters', () => {
    it('should apply multiple filters in combination', () => {
      const items: ClothingItem[] = [
        createTestItem({ 
          id: 1, 
          name: 'Blue Shirt', 
          category: ClothingCategory.TOP, 
          season: Season.SPRING,
          primaryColor: 'Blue'
        }),
        createTestItem({ 
          id: 2, 
          name: 'Red Shirt', 
          category: ClothingCategory.TOP, 
          season: Season.SUMMER,
          primaryColor: 'Red'
        }),
        createTestItem({ 
          id: 3, 
          name: 'Blue Pants', 
          category: ClothingCategory.BOTTOM, 
          season: Season.SPRING,
          primaryColor: 'Blue'
        }),
        createTestItem({ 
          id: 4, 
          name: 'Blue Shirt', 
          category: ClothingCategory.TOP, 
          season: Season.SPRING,
          primaryColor: 'Blue'
        }),
      ];

      const result = applyFilters(items, {
        category: ClothingCategory.TOP,
        season: Season.SPRING,
        color: 'blue',
        searchQuery: 'shirt'
      });

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(1);
      expect(result[1].id).toBe(4);
    });

    it('should return empty array when no items match all filters', () => {
      const items: ClothingItem[] = [
        createTestItem({ 
          id: 1, 
          category: ClothingCategory.TOP, 
          season: Season.SPRING 
        }),
        createTestItem({ 
          id: 2, 
          category: ClothingCategory.BOTTOM, 
          season: Season.SUMMER 
        }),
      ];

      const result = applyFilters(items, {
        category: ClothingCategory.TOP,
        season: Season.SUMMER
      });

      expect(result).toHaveLength(0);
    });

    it('should work with ALL_SEASON items in combined filters', () => {
      const items: ClothingItem[] = [
        createTestItem({ 
          id: 1, 
          name: 'Blue Shirt',
          category: ClothingCategory.TOP, 
          season: Season.ALL_SEASON,
          primaryColor: 'Blue'
        }),
        createTestItem({ 
          id: 2, 
          name: 'Red Shirt',
          category: ClothingCategory.TOP, 
          season: Season.SPRING,
          primaryColor: 'Red'
        }),
      ];

      const result = applyFilters(items, {
        category: ClothingCategory.TOP,
        season: Season.SPRING,
        searchQuery: 'shirt'
      });

      expect(result).toHaveLength(2);
    });
  });

  describe('edge cases', () => {
    it('should handle empty items array', () => {
      const result = applyFilters([], { category: ClothingCategory.TOP });

      expect(result).toHaveLength(0);
    });

    it('should handle empty filters object', () => {
      const items: ClothingItem[] = [
        createTestItem({ id: 1 }),
        createTestItem({ id: 2 }),
      ];

      const result = applyFilters(items, {});

      expect(result).toHaveLength(2);
    });

    it('should not mutate the original items array', () => {
      const items: ClothingItem[] = [
        createTestItem({ id: 1, category: ClothingCategory.TOP }),
        createTestItem({ id: 2, category: ClothingCategory.BOTTOM }),
      ];
      const originalLength = items.length;

      applyFilters(items, { category: ClothingCategory.TOP });

      expect(items).toHaveLength(originalLength);
    });

    it('should handle items with undefined brand in search', () => {
      const items: ClothingItem[] = [
        createTestItem({ id: 1, name: 'Shirt', brand: undefined }),
        createTestItem({ id: 2, name: 'Pants', brand: 'Nike' }),
      ];

      const result = applyFilters(items, { searchQuery: 'nike' });

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(2);
    });

    it('should handle items with undefined secondaryColor in color filter', () => {
      const items: ClothingItem[] = [
        createTestItem({ id: 1, primaryColor: 'Blue', secondaryColor: undefined }),
        createTestItem({ id: 2, primaryColor: 'Red', secondaryColor: 'Blue' }),
      ];

      const result = applyFilters(items, { color: 'blue' });

      expect(result).toHaveLength(2);
    });
  });
});
