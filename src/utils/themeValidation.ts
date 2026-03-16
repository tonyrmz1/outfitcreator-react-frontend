/**
 * Theme validation utilities for the theme color selector feature
 * Provides functions to validate theme structure, color codes, and theme IDs
 */

import { Theme, THEMES } from '../types/theme';

/**
 * Validates a single color code is in valid hex format (#RRGGBB)
 * @param color - The color string to validate
 * @returns true if color is valid hex format, false otherwise
 */
export function validateColorCode(color: string): boolean {
  if (typeof color !== 'string') {
    return false;
  }
  return /^#[0-9A-F]{6}$/i.test(color);
}

/**
 * Validates a theme ID exists in the available themes
 * @param themeId - The theme ID to validate
 * @returns true if theme ID exists, false otherwise
 */
export function validateThemeId(themeId: string): boolean {
  if (typeof themeId !== 'string') {
    return false;
  }
  return themeId in THEMES;
}

/**
 * Validates a complete theme structure and all color codes
 * Checks:
 * - Theme has required properties (id, name, colors)
 * - Colors object has exactly 4 properties (primary, secondary, accent, tertiary)
 * - All color values are valid hex codes (#RRGGBB format)
 * @param theme - The theme object to validate
 * @returns true if theme is valid, false otherwise
 */
export function validateTheme(theme: Theme): boolean {
  // Check theme exists and has required properties
  if (!theme || typeof theme !== 'object') {
    return false;
  }

  if (!theme.id || !theme.name || !theme.colors) {
    return false;
  }

  // Check colors object exists and has exactly 4 properties
  const colorKeys = Object.keys(theme.colors);
  if (colorKeys.length !== 4) {
    return false;
  }

  // Check all required color properties exist
  const requiredColors = ['primary', 'secondary', 'accent', 'tertiary'];
  if (!requiredColors.every((key) => key in theme.colors)) {
    return false;
  }

  // Validate all color values are valid hex codes
  const colors = Object.values(theme.colors);
  return colors.every((color) => validateColorCode(color));
}

/**
 * Handles corrupted localStorage data by clearing it and logging error
 * @param error - The error that occurred when reading/parsing storage
 */
export function handleCorruptedStorage(error?: Error): void {
  const STORAGE_KEY = 'app-theme-preference';
  console.error('Corrupted theme data detected in storage:', error);
  try {
    localStorage.removeItem(STORAGE_KEY);
    console.log('Cleared corrupted theme data from storage');
  } catch (clearError) {
    console.error('Failed to clear corrupted storage:', clearError);
  }
}
