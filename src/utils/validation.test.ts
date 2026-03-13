import { describe, it, expect } from 'vitest';
import { validateOutfit } from './validation';
import { ItemPosition, OutfitFormData } from '../types';

describe('validateOutfit', () => {
  describe('name validation', () => {
    it('should return error when name is empty string', () => {
      const outfit: OutfitFormData = {
        name: '',
        items: [{ clothingItemId: 1, position: ItemPosition.TOP }],
      };

      const result = validateOutfit(outfit);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Outfit name is required');
    });

    it('should return error when name is only whitespace', () => {
      const outfit: OutfitFormData = {
        name: '   ',
        items: [{ clothingItemId: 1, position: ItemPosition.TOP }],
      };

      const result = validateOutfit(outfit);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Outfit name is required');
    });

    it('should return error when name exceeds 255 characters', () => {
      const outfit: OutfitFormData = {
        name: 'a'.repeat(256),
        items: [{ clothingItemId: 1, position: ItemPosition.TOP }],
      };

      const result = validateOutfit(outfit);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Outfit name must not exceed 255 characters');
    });

    it('should accept name with exactly 255 characters', () => {
      const outfit: OutfitFormData = {
        name: 'a'.repeat(255),
        items: [{ clothingItemId: 1, position: ItemPosition.TOP }],
      };

      const result = validateOutfit(outfit);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should accept valid name', () => {
      const outfit: OutfitFormData = {
        name: 'Summer Casual',
        items: [{ clothingItemId: 1, position: ItemPosition.TOP }],
      };

      const result = validateOutfit(outfit);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('items validation', () => {
    it('should return error when items array is empty', () => {
      const outfit: OutfitFormData = {
        name: 'Test Outfit',
        items: [],
      };

      const result = validateOutfit(outfit);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('At least one clothing item is required');
    });

    it('should accept outfit with one item', () => {
      const outfit: OutfitFormData = {
        name: 'Test Outfit',
        items: [{ clothingItemId: 1, position: ItemPosition.TOP }],
      };

      const result = validateOutfit(outfit);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should accept outfit with multiple items in different positions', () => {
      const outfit: OutfitFormData = {
        name: 'Test Outfit',
        items: [
          { clothingItemId: 1, position: ItemPosition.TOP },
          { clothingItemId: 2, position: ItemPosition.BOTTOM },
          { clothingItemId: 3, position: ItemPosition.FOOTWEAR },
        ],
      };

      const result = validateOutfit(outfit);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('position uniqueness validation', () => {
    it('should return error when same position is used twice', () => {
      const outfit: OutfitFormData = {
        name: 'Test Outfit',
        items: [
          { clothingItemId: 1, position: ItemPosition.TOP },
          { clothingItemId: 2, position: ItemPosition.TOP },
        ],
      };

      const result = validateOutfit(outfit);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Each position can only have one item');
    });

    it('should return error when multiple positions are duplicated', () => {
      const outfit: OutfitFormData = {
        name: 'Test Outfit',
        items: [
          { clothingItemId: 1, position: ItemPosition.TOP },
          { clothingItemId: 2, position: ItemPosition.TOP },
          { clothingItemId: 3, position: ItemPosition.BOTTOM },
          { clothingItemId: 4, position: ItemPosition.BOTTOM },
        ],
      };

      const result = validateOutfit(outfit);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Each position can only have one item');
    });

    it('should accept outfit with all unique positions', () => {
      const outfit: OutfitFormData = {
        name: 'Test Outfit',
        items: [
          { clothingItemId: 1, position: ItemPosition.TOP },
          { clothingItemId: 2, position: ItemPosition.BOTTOM },
          { clothingItemId: 3, position: ItemPosition.FOOTWEAR },
          { clothingItemId: 4, position: ItemPosition.OUTERWEAR },
          { clothingItemId: 5, position: ItemPosition.ACCESSORY },
        ],
      };

      const result = validateOutfit(outfit);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('notes validation', () => {
    it('should accept outfit without notes', () => {
      const outfit: OutfitFormData = {
        name: 'Test Outfit',
        items: [{ clothingItemId: 1, position: ItemPosition.TOP }],
      };

      const result = validateOutfit(outfit);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should accept outfit with notes under 1000 characters', () => {
      const outfit: OutfitFormData = {
        name: 'Test Outfit',
        items: [{ clothingItemId: 1, position: ItemPosition.TOP }],
        notes: 'This is a nice outfit for summer.',
      };

      const result = validateOutfit(outfit);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should accept outfit with notes exactly 1000 characters', () => {
      const outfit: OutfitFormData = {
        name: 'Test Outfit',
        items: [{ clothingItemId: 1, position: ItemPosition.TOP }],
        notes: 'a'.repeat(1000),
      };

      const result = validateOutfit(outfit);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return error when notes exceed 1000 characters', () => {
      const outfit: OutfitFormData = {
        name: 'Test Outfit',
        items: [{ clothingItemId: 1, position: ItemPosition.TOP }],
        notes: 'a'.repeat(1001),
      };

      const result = validateOutfit(outfit);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Notes must not exceed 1000 characters');
    });
  });

  describe('multiple validation errors', () => {
    it('should return all validation errors when multiple issues exist', () => {
      const outfit: OutfitFormData = {
        name: '',
        items: [],
        notes: 'a'.repeat(1001),
      };

      const result = validateOutfit(outfit);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(3);
      expect(result.errors).toContain('Outfit name is required');
      expect(result.errors).toContain('At least one clothing item is required');
      expect(result.errors).toContain('Notes must not exceed 1000 characters');
    });

    it('should return multiple errors for name and position issues', () => {
      const outfit: OutfitFormData = {
        name: 'a'.repeat(256),
        items: [
          { clothingItemId: 1, position: ItemPosition.TOP },
          { clothingItemId: 2, position: ItemPosition.TOP },
        ],
      };

      const result = validateOutfit(outfit);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(2);
      expect(result.errors).toContain('Outfit name must not exceed 255 characters');
      expect(result.errors).toContain('Each position can only have one item');
    });
  });

  describe('edge cases', () => {
    it('should handle outfit with empty notes string', () => {
      const outfit: OutfitFormData = {
        name: 'Test Outfit',
        items: [{ clothingItemId: 1, position: ItemPosition.TOP }],
        notes: '',
      };

      const result = validateOutfit(outfit);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should handle outfit with undefined notes', () => {
      const outfit: OutfitFormData = {
        name: 'Test Outfit',
        items: [{ clothingItemId: 1, position: ItemPosition.TOP }],
        notes: undefined,
      };

      const result = validateOutfit(outfit);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });
});
