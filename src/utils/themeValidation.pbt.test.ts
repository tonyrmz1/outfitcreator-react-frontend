/**
 * Property-based tests for theme validation utilities
 * **Validates: Requirements 6.3**
 */

import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { validateColorCode, validateTheme } from './themeValidation';
import { Theme } from '../types/theme';

describe('Theme Validation - Property-Based Tests', () => {
  describe('Property 8: Color Palette Validation', () => {
    it('should validate valid hex color codes', () => {
      fc.assert(
        fc.property(fc.hexaString({ minLength: 6, maxLength: 6 }), (hexString) => {
          const color = `#${hexString}`;
          expect(validateColorCode(color)).toBe(true);
        }),
        { numRuns: 100 }
      );
    });

    it('should reject invalid color codes', () => {
      fc.assert(
        fc.property(
          fc.oneof(
            fc.string().filter((s) => !s.startsWith('#')), // Missing #
            fc.string({ minLength: 1, maxLength: 5 }).map((s) => `#${s}`), // Too short
            fc.string({ minLength: 7 }).map((s) => `#${s}`), // Too long
            fc.string().map((s) => `#${s}G${s}`) // Invalid hex characters
          ),
          (color) => {
            // Only test if it's actually invalid
            if (!/^#[0-9A-F]{6}$/i.test(color)) {
              expect(validateColorCode(color)).toBe(false);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should validate themes with all valid hex colors', () => {
      fc.assert(
        fc.property(
          fc.tuple(
            fc.hexaString({ minLength: 6, maxLength: 6 }),
            fc.hexaString({ minLength: 6, maxLength: 6 }),
            fc.hexaString({ minLength: 6, maxLength: 6 }),
            fc.hexaString({ minLength: 6, maxLength: 6 })
          ),
          ([primary, secondary, accent, tertiary]) => {
            const theme: Theme = {
              id: 'test-theme',
              name: 'Test Theme',
              colors: {
                primary: `#${primary}`,
                secondary: `#${secondary}`,
                accent: `#${accent}`,
                tertiary: `#${tertiary}`,
              },
            };

            expect(validateTheme(theme)).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject themes with invalid color codes', () => {
      fc.assert(
        fc.property(
          fc.tuple(
            fc.hexaString({ minLength: 6, maxLength: 6 }),
            fc.hexaString({ minLength: 6, maxLength: 6 }),
            fc.hexaString({ minLength: 6, maxLength: 6 }),
            fc.string({ minLength: 1, maxLength: 5 }) // Invalid color
          ),
          ([primary, secondary, accent, invalidColor]) => {
            const theme: Theme = {
              id: 'test-theme',
              name: 'Test Theme',
              colors: {
                primary: `#${primary}`,
                secondary: `#${secondary}`,
                accent: `#${accent}`,
                tertiary: `#${invalidColor}`, // Invalid
              },
            };

            expect(validateTheme(theme)).toBe(false);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject themes with missing color properties', () => {
      fc.assert(
        fc.property(
          fc.tuple(
            fc.hexaString({ minLength: 6, maxLength: 6 }),
            fc.hexaString({ minLength: 6, maxLength: 6 }),
            fc.hexaString({ minLength: 6, maxLength: 6 })
          ),
          ([primary, secondary, accent]) => {
            const theme = {
              id: 'test-theme',
              name: 'Test Theme',
              colors: {
                primary: `#${primary}`,
                secondary: `#${secondary}`,
                accent: `#${accent}`,
                // Missing tertiary
              },
            } as unknown as Theme;

            expect(validateTheme(theme)).toBe(false);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject themes with extra color properties', () => {
      fc.assert(
        fc.property(
          fc.tuple(
            fc.hexaString({ minLength: 6, maxLength: 6 }),
            fc.hexaString({ minLength: 6, maxLength: 6 }),
            fc.hexaString({ minLength: 6, maxLength: 6 }),
            fc.hexaString({ minLength: 6, maxLength: 6 }),
            fc.hexaString({ minLength: 6, maxLength: 6 })
          ),
          ([primary, secondary, accent, tertiary, extra]) => {
            const theme = {
              id: 'test-theme',
              name: 'Test Theme',
              colors: {
                primary: `#${primary}`,
                secondary: `#${secondary}`,
                accent: `#${accent}`,
                tertiary: `#${tertiary}`,
                extra: `#${extra}`, // Extra property
              },
            } as unknown as Theme;

            expect(validateTheme(theme)).toBe(false);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject themes with missing required fields', () => {
      fc.assert(
        fc.property(
          fc.tuple(
            fc.hexaString({ minLength: 6, maxLength: 6 }),
            fc.hexaString({ minLength: 6, maxLength: 6 }),
            fc.hexaString({ minLength: 6, maxLength: 6 }),
            fc.hexaString({ minLength: 6, maxLength: 6 })
          ),
          ([primary, secondary, accent, tertiary]) => {
            const theme = {
              // Missing id
              name: 'Test Theme',
              colors: {
                primary: `#${primary}`,
                secondary: `#${secondary}`,
                accent: `#${accent}`,
                tertiary: `#${tertiary}`,
              },
            } as unknown as Theme;

            expect(validateTheme(theme)).toBe(false);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
