/**
 * Unit tests for theme validation utilities
 * **Validates: Requirements 6.1, 6.2, 6.3**
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  validateColorCode,
  validateThemeId,
  validateTheme,
  handleCorruptedStorage,
} from './themeValidation';
import { Theme, THEMES } from '../types/theme';

describe('Theme Validation - Unit Tests', () => {
  describe('validateColorCode', () => {
    it('should validate valid hex color codes', () => {
      expect(validateColorCode('#FFFFFF')).toBe(true);
      expect(validateColorCode('#000000')).toBe(true);
      expect(validateColorCode('#F5F1E8')).toBe(true);
      expect(validateColorCode('#8B7355')).toBe(true);
    });

    it('should validate hex codes with lowercase letters', () => {
      expect(validateColorCode('#ffffff')).toBe(true);
      expect(validateColorCode('#f5f1e8')).toBe(true);
      expect(validateColorCode('#AbCdEf')).toBe(true);
    });

    it('should reject invalid hex color codes', () => {
      expect(validateColorCode('FFFFFF')).toBe(false); // Missing #
      expect(validateColorCode('#FFF')).toBe(false); // Too short
      expect(validateColorCode('#FFFFFFF')).toBe(false); // Too long
      expect(validateColorCode('#GGGGGG')).toBe(false); // Invalid hex characters
      expect(validateColorCode('#12345')).toBe(false); // Too short
      expect(validateColorCode('rgb(255, 255, 255)')).toBe(false); // RGB format
    });

    it('should reject non-string inputs', () => {
      expect(validateColorCode(null as unknown as string)).toBe(false);
      expect(validateColorCode(undefined as unknown as string)).toBe(false);
      expect(validateColorCode(123 as unknown as string)).toBe(false);
      expect(validateColorCode({} as unknown as string)).toBe(false);
    });
  });

  describe('validateThemeId', () => {
    it('should validate existing theme IDs', () => {
      expect(validateThemeId('brown-tan')).toBe(true);
      expect(validateThemeId('blue')).toBe(true);
      expect(validateThemeId('green')).toBe(true);
    });

    it('should reject non-existing theme IDs', () => {
      expect(validateThemeId('invalid-theme')).toBe(false);
      expect(validateThemeId('red')).toBe(false);
      expect(validateThemeId('purple')).toBe(false);
    });

    it('should reject non-string inputs', () => {
      expect(validateThemeId(null as unknown as string)).toBe(false);
      expect(validateThemeId(undefined as unknown as string)).toBe(false);
      expect(validateThemeId(123 as unknown as string)).toBe(false);
      expect(validateThemeId({} as unknown as string)).toBe(false);
    });
  });

  describe('validateTheme', () => {
    it('should validate valid themes from THEMES constant', () => {
      expect(validateTheme(THEMES['brown-tan'])).toBe(true);
      expect(validateTheme(THEMES['blue'])).toBe(true);
      expect(validateTheme(THEMES['green'])).toBe(true);
    });

    it('should validate custom valid themes', () => {
      const customTheme: Theme = {
        id: 'custom',
        name: 'Custom Theme',
        colors: {
          primary: '#FFFFFF',
          secondary: '#000000',
          accent: '#FF0000',
          tertiary: '#00FF00',
        },
      };

      expect(validateTheme(customTheme)).toBe(true);
    });

    it('should reject themes with invalid color codes', () => {
      const invalidTheme: Theme = {
        id: 'invalid',
        name: 'Invalid Theme',
        colors: {
          primary: '#FFFFFF',
          secondary: '#000000',
          accent: '#FF0000',
          tertiary: '#GGGGGG', // Invalid hex
        },
      };

      expect(validateTheme(invalidTheme)).toBe(false);
    });

    it('should reject themes with missing color properties', () => {
      const incompleteTheme = {
        id: 'incomplete',
        name: 'Incomplete Theme',
        colors: {
          primary: '#FFFFFF',
          secondary: '#000000',
          accent: '#FF0000',
          // Missing tertiary
        },
      } as unknown as Theme;

      expect(validateTheme(incompleteTheme)).toBe(false);
    });

    it('should reject themes with extra color properties', () => {
      const extraTheme = {
        id: 'extra',
        name: 'Extra Theme',
        colors: {
          primary: '#FFFFFF',
          secondary: '#000000',
          accent: '#FF0000',
          tertiary: '#00FF00',
          quaternary: '#0000FF', // Extra property
        },
      } as unknown as Theme;

      expect(validateTheme(extraTheme)).toBe(false);
    });

    it('should reject themes with missing id', () => {
      const noIdTheme = {
        name: 'No ID Theme',
        colors: {
          primary: '#FFFFFF',
          secondary: '#000000',
          accent: '#FF0000',
          tertiary: '#00FF00',
        },
      } as unknown as Theme;

      expect(validateTheme(noIdTheme)).toBe(false);
    });

    it('should reject themes with missing name', () => {
      const noNameTheme = {
        id: 'no-name',
        colors: {
          primary: '#FFFFFF',
          secondary: '#000000',
          accent: '#FF0000',
          tertiary: '#00FF00',
        },
      } as unknown as Theme;

      expect(validateTheme(noNameTheme)).toBe(false);
    });

    it('should reject themes with missing colors object', () => {
      const noColorsTheme = {
        id: 'no-colors',
        name: 'No Colors Theme',
      } as unknown as Theme;

      expect(validateTheme(noColorsTheme)).toBe(false);
    });

    it('should reject null or undefined themes', () => {
      expect(validateTheme(null as unknown as Theme)).toBe(false);
      expect(validateTheme(undefined as unknown as Theme)).toBe(false);
    });

    it('should reject non-object themes', () => {
      expect(validateTheme('not a theme' as unknown as Theme)).toBe(false);
      expect(validateTheme(123 as unknown as Theme)).toBe(false);
      expect(validateTheme([] as unknown as Theme)).toBe(false);
    });
  });

  describe('handleCorruptedStorage', () => {
    beforeEach(() => {
      vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.spyOn(console, 'log').mockImplementation(() => {});
      localStorage.clear();
    });

    afterEach(() => {
      vi.restoreAllMocks();
      localStorage.clear();
    });

    it('should clear corrupted storage data', () => {
      const STORAGE_KEY = 'app-theme-preference';
      localStorage.setItem(STORAGE_KEY, 'corrupted data');

      handleCorruptedStorage(new Error('Parse error'));

      expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    });

    it('should log error message', () => {
      const error = new Error('Storage corruption detected');
      handleCorruptedStorage(error);

      expect(console.error).toHaveBeenCalledWith(
        'Corrupted theme data detected in storage:',
        error
      );
    });

    it('should log success message after clearing', () => {
      const STORAGE_KEY = 'app-theme-preference';
      localStorage.setItem(STORAGE_KEY, 'corrupted data');

      handleCorruptedStorage(new Error('Parse error'));

      expect(console.log).toHaveBeenCalledWith('Cleared corrupted theme data from storage');
    });

    it('should handle error when clearing storage fails', () => {
      const error = new Error('Storage corruption detected');
      vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
        throw new Error('Storage access denied');
      });

      handleCorruptedStorage(error);

      expect(console.error).toHaveBeenCalledWith(
        'Failed to clear corrupted storage:',
        expect.any(Error)
      );
    });

    it('should handle undefined error parameter', () => {
      const STORAGE_KEY = 'app-theme-preference';
      localStorage.setItem(STORAGE_KEY, 'corrupted data');

      handleCorruptedStorage();

      expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
      expect(console.error).toHaveBeenCalledWith(
        'Corrupted theme data detected in storage:',
        undefined
      );
    });
  });

  describe('Integration: Corrupted Storage Handling', () => {
    beforeEach(() => {
      vi.spyOn(console, 'error').mockImplementation(() => {});
      localStorage.clear();
    });

    afterEach(() => {
      vi.restoreAllMocks();
      localStorage.clear();
    });

    it('should handle corrupted JSON in storage', () => {
      const STORAGE_KEY = 'app-theme-preference';
      localStorage.setItem(STORAGE_KEY, '{invalid json}');

      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          JSON.parse(stored);
        }
      } catch (error) {
        handleCorruptedStorage(error instanceof Error ? error : undefined);
      }

      expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    });

    it('should handle invalid theme selection rejection', () => {
      const invalidThemeId = 'non-existent-theme';
      const isValid = validateThemeId(invalidThemeId);

      expect(isValid).toBe(false);
    });

    it('should validate theme before applying', () => {
      const corruptedTheme: Theme = {
        id: 'corrupted',
        name: 'Corrupted',
        colors: {
          primary: '#FFFFFF',
          secondary: '#000000',
          accent: '#FF0000',
          tertiary: '#INVALID', // Invalid color
        },
      };

      expect(validateTheme(corruptedTheme)).toBe(false);
    });
  });
});
