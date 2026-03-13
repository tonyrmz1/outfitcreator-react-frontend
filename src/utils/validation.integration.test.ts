import { describe, it, expect } from 'vitest';
import { validateOutfit } from './index';
import { ItemPosition } from '../types';

describe('validateOutfit - Integration Test', () => {
  it('should be importable from utils index', () => {
    expect(validateOutfit).toBeDefined();
    expect(typeof validateOutfit).toBe('function');
  });

  it('should work when imported from utils index', () => {
    const outfit = {
      name: 'Test Outfit',
      items: [{ clothingItemId: 1, position: ItemPosition.TOP }],
    };

    const result = validateOutfit(outfit);

    expect(result).toBeDefined();
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
});
