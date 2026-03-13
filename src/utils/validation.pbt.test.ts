import { describe, it } from 'vitest';
import fc from 'fast-check';
import { validateOutfit } from './validation';
import { ItemPosition, OutfitFormData } from '../types';

describe('validateOutfit - Property-Based Tests', () => {
  /**
   * **Validates: Requirements 7.1, 7.2, 7.3, 7.4**
   * 
   * Property: Valid outfits always pass validation
   * For any outfit with a non-empty name (≤255 chars), at least one item,
   * unique positions, and notes ≤1000 chars, validation should succeed.
   */
  it('should validate all valid outfits as valid', () => {
    const validOutfitArbitrary = fc.record({
      name: fc.string({ minLength: 1, maxLength: 255 }).filter((s) => s.trim().length > 0),
      items: fc
        .uniqueArray(
          fc.record({
            clothingItemId: fc.integer({ min: 1 }),
            position: fc.constantFrom(
              ItemPosition.TOP,
              ItemPosition.BOTTOM,
              ItemPosition.FOOTWEAR,
              ItemPosition.OUTERWEAR,
              ItemPosition.ACCESSORY
            ),
          }),
          {
            minLength: 1,
            maxLength: 5,
            selector: (item) => item.position,
          }
        ),
      notes: fc.option(fc.string({ maxLength: 1000 })),
    });

    fc.assert(
      fc.property(validOutfitArbitrary, (outfit) => {
        const result = validateOutfit(outfit as OutfitFormData);
        return result.isValid && result.errors.length === 0;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirement 7.1**
   * 
   * Property: Empty or whitespace-only names always fail validation
   * For any outfit with an empty or whitespace-only name, validation should fail
   * with a specific error about the name being required.
   */
  it('should reject outfits with empty or whitespace-only names', () => {
    const emptyNameOutfitArbitrary = fc.record({
      name: fc.constantFrom('', '   ', '\t', '\n', '  \t  '),
      items: fc
        .array(
          fc.record({
            clothingItemId: fc.integer({ min: 1 }),
            position: fc.constantFrom(
              ItemPosition.TOP,
              ItemPosition.BOTTOM,
              ItemPosition.FOOTWEAR,
              ItemPosition.OUTERWEAR,
              ItemPosition.ACCESSORY
            ),
          }),
          { minLength: 1, maxLength: 5 }
        ),
      notes: fc.option(fc.string({ maxLength: 1000 })),
    });

    fc.assert(
      fc.property(emptyNameOutfitArbitrary, (outfit) => {
        const result = validateOutfit(outfit as OutfitFormData);
        return !result.isValid && result.errors.includes('Outfit name is required');
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirement 7.2**
   * 
   * Property: Names exceeding 255 characters always fail validation
   * For any outfit with a name longer than 255 characters, validation should fail
   * with a specific error about the name length.
   */
  it('should reject outfits with names exceeding 255 characters', () => {
    const longNameOutfitArbitrary = fc.record({
      name: fc.string({ minLength: 256, maxLength: 500 }),
      items: fc
        .array(
          fc.record({
            clothingItemId: fc.integer({ min: 1 }),
            position: fc.constantFrom(
              ItemPosition.TOP,
              ItemPosition.BOTTOM,
              ItemPosition.FOOTWEAR,
              ItemPosition.OUTERWEAR,
              ItemPosition.ACCESSORY
            ),
          }),
          { minLength: 1, maxLength: 5 }
        ),
      notes: fc.option(fc.string({ maxLength: 1000 })),
    });

    fc.assert(
      fc.property(longNameOutfitArbitrary, (outfit) => {
        const result = validateOutfit(outfit as OutfitFormData);
        return (
          !result.isValid &&
          result.errors.includes('Outfit name must not exceed 255 characters')
        );
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirement 7.1**
   * 
   * Property: Outfits without items always fail validation
   * For any outfit with an empty items array, validation should fail
   * with a specific error about requiring at least one item.
   */
  it('should reject outfits with no items', () => {
    const noItemsOutfitArbitrary = fc.record({
      name: fc.string({ minLength: 1, maxLength: 255 }).filter((s) => s.trim().length > 0),
      items: fc.constant([]),
      notes: fc.option(fc.string({ maxLength: 1000 })),
    });

    fc.assert(
      fc.property(noItemsOutfitArbitrary, (outfit) => {
        const result = validateOutfit(outfit as OutfitFormData);
        return (
          !result.isValid &&
          result.errors.includes('At least one clothing item is required')
        );
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirement 7.4**
   * 
   * Property: Duplicate positions always fail validation
   * For any outfit with items that have duplicate positions, validation should fail
   * with a specific error about position uniqueness.
   */
  it('should reject outfits with duplicate positions', () => {
    const duplicatePositionOutfitArbitrary = fc
      .record({
        name: fc.string({ minLength: 1, maxLength: 255 }).filter((s) => s.trim().length > 0),
        position: fc.constantFrom(
          ItemPosition.TOP,
          ItemPosition.BOTTOM,
          ItemPosition.FOOTWEAR,
          ItemPosition.OUTERWEAR,
          ItemPosition.ACCESSORY
        ),
        itemIds: fc.array(fc.integer({ min: 1 }), { minLength: 2, maxLength: 5 }),
        notes: fc.option(fc.string({ maxLength: 1000 })),
      })
      .map(({ name, position, itemIds, notes }) => ({
        name,
        items: itemIds.map((id) => ({ clothingItemId: id, position })),
        notes,
      }));

    fc.assert(
      fc.property(duplicatePositionOutfitArbitrary, (outfit) => {
        const result = validateOutfit(outfit as OutfitFormData);
        return (
          !result.isValid && result.errors.includes('Each position can only have one item')
        );
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirement 7.3**
   * 
   * Property: Notes exceeding 1000 characters always fail validation
   * For any outfit with notes longer than 1000 characters, validation should fail
   * with a specific error about the notes length.
   */
  it('should reject outfits with notes exceeding 1000 characters', () => {
    const longNotesOutfitArbitrary = fc.record({
      name: fc.string({ minLength: 1, maxLength: 255 }).filter((s) => s.trim().length > 0),
      items: fc
        .uniqueArray(
          fc.record({
            clothingItemId: fc.integer({ min: 1 }),
            position: fc.constantFrom(
              ItemPosition.TOP,
              ItemPosition.BOTTOM,
              ItemPosition.FOOTWEAR,
              ItemPosition.OUTERWEAR,
              ItemPosition.ACCESSORY
            ),
          }),
          {
            minLength: 1,
            maxLength: 5,
            selector: (item) => item.position,
          }
        ),
      notes: fc.string({ minLength: 1001, maxLength: 2000 }),
    });

    fc.assert(
      fc.property(longNotesOutfitArbitrary, (outfit) => {
        const result = validateOutfit(outfit as OutfitFormData);
        return (
          !result.isValid && result.errors.includes('Notes must not exceed 1000 characters')
        );
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 7.1, 7.2, 7.3, 7.4**
   * 
   * Property: Validation result consistency
   * For any outfit, if isValid is true, then errors array must be empty.
   * If isValid is false, then errors array must be non-empty.
   */
  it('should maintain consistency between isValid and errors array', () => {
    const anyOutfitArbitrary = fc.record({
      name: fc.string({ maxLength: 300 }),
      items: fc.array(
        fc.record({
          clothingItemId: fc.integer({ min: 1 }),
          position: fc.constantFrom(
            ItemPosition.TOP,
            ItemPosition.BOTTOM,
            ItemPosition.FOOTWEAR,
            ItemPosition.OUTERWEAR,
            ItemPosition.ACCESSORY
          ),
        }),
        { maxLength: 10 }
      ),
      notes: fc.option(fc.string({ maxLength: 1500 })),
    });

    fc.assert(
      fc.property(anyOutfitArbitrary, (outfit) => {
        const result = validateOutfit(outfit as OutfitFormData);
        // isValid should be true if and only if errors array is empty
        return result.isValid === (result.errors.length === 0);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 7.1, 7.2, 7.3, 7.4**
   * 
   * Property: Validation is deterministic
   * For any outfit, validating it multiple times should always produce the same result.
   */
  it('should produce consistent results for the same input', () => {
    const anyOutfitArbitrary = fc.record({
      name: fc.string({ maxLength: 300 }),
      items: fc.array(
        fc.record({
          clothingItemId: fc.integer({ min: 1 }),
          position: fc.constantFrom(
            ItemPosition.TOP,
            ItemPosition.BOTTOM,
            ItemPosition.FOOTWEAR,
            ItemPosition.OUTERWEAR,
            ItemPosition.ACCESSORY
          ),
        }),
        { maxLength: 10 }
      ),
      notes: fc.option(fc.string({ maxLength: 1500 })),
    });

    fc.assert(
      fc.property(anyOutfitArbitrary, (outfit) => {
        const result1 = validateOutfit(outfit as OutfitFormData);
        const result2 = validateOutfit(outfit as OutfitFormData);
        
        return (
          result1.isValid === result2.isValid &&
          result1.errors.length === result2.errors.length &&
          result1.errors.every((error, index) => error === result2.errors[index])
        );
      }),
      { numRuns: 100 }
    );
  });
});
