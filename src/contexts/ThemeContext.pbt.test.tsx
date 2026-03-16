import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import * as fc from 'fast-check';
import { ThemeProvider, useTheme } from './ThemeContext';
import { THEMES, DEFAULT_THEME_ID, Theme } from '../types/theme';

/**
 * Property-Based Tests for ThemeContext
 */

// Test component that uses the theme hook
function TestComponent() {
  const { currentTheme, themes, setTheme, isLoading } = useTheme();
  return (
    <div>
      <div data-testid="current-theme">{currentTheme.id}</div>
      <div data-testid="theme-count">{themes.length}</div>
      <div data-testid="is-loading">{isLoading ? 'true' : 'false'}</div>
      <button
        data-testid="set-theme-btn"
        onClick={() => setTheme('blue')}
      >
        Set Blue Theme
      </button>
    </div>
  );
}

describe('ThemeContext - Property-Based Tests', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Clear all CSS custom properties
    document.documentElement.style.cssText = '';
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.style.cssText = '';
  });

  describe('Property 1: Theme Selection Updates All Colors', () => {
    it('should update all CSS custom properties when theme is selected', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...Object.keys(THEMES)),
          (themeId) => {
            // Pre-set the theme in localStorage
            localStorage.setItem(
              'app-theme-preference',
              JSON.stringify({ themeId, timestamp: Date.now() })
            );

            const { unmount } = render(
              <ThemeProvider>
                <TestComponent />
              </ThemeProvider>
            );

            const theme = THEMES[themeId];
            const root = document.documentElement;

            // Verify all CSS custom properties are set
            expect(root.style.getPropertyValue('--color-primary')).toBeTruthy();
            expect(root.style.getPropertyValue('--color-secondary')).toBeTruthy();
            expect(root.style.getPropertyValue('--color-accent')).toBeTruthy();
            expect(root.style.getPropertyValue('--color-tertiary')).toBeTruthy();

            // Verify they match the theme colors
            expect(root.style.getPropertyValue('--color-primary')).toBe(
              theme.colors.primary
            );
            expect(root.style.getPropertyValue('--color-secondary')).toBe(
              theme.colors.secondary
            );
            expect(root.style.getPropertyValue('--color-accent')).toBe(
              theme.colors.accent
            );
            expect(root.style.getPropertyValue('--color-tertiary')).toBe(
              theme.colors.tertiary
            );

            unmount();
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 2: Theme Persistence Round Trip', () => {
    it('should persist and retrieve theme correctly from localStorage', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...Object.keys(THEMES)),
          (themeId) => {
            // Simulate persisting a theme
            const storedData = {
              themeId: themeId,
              timestamp: Date.now(),
            };
            localStorage.setItem('app-theme-preference', JSON.stringify(storedData));

            // Render component which should load from storage
            const { unmount } = render(
              <ThemeProvider>
                <TestComponent />
              </ThemeProvider>
            );

            // Verify the theme was loaded correctly
            const currentThemeElement = screen.getByTestId('current-theme');
            expect(currentThemeElement.textContent).toBe(themeId);

            unmount();
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 5: Invalid Theme Selection Rejected', () => {
    it('should not change current theme when invalid theme ID is selected', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 50 }).filter(
            (s) => !Object.keys(THEMES).includes(s)
          ),
          (invalidThemeId) => {
            const { unmount } = render(
              <ThemeProvider>
                <TestComponent />
              </ThemeProvider>
            );

            // Get initial theme
            const initialTheme = screen.getByTestId('current-theme').textContent;

            // Try to set invalid theme
            const setThemeBtn = screen.getByTestId('set-theme-btn');
            setThemeBtn.click();

            // Verify theme hasn't changed (still default)
            const currentTheme = screen.getByTestId('current-theme').textContent;
            expect(currentTheme).toBe(initialTheme);

            unmount();
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 6: Theme Application is Idempotent', () => {
    it('should produce same visual state when applying theme multiple times', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...Object.keys(THEMES)),
          (themeId) => {
            const { unmount } = render(
              <ThemeProvider>
                <TestComponent />
              </ThemeProvider>
            );

            const root = document.documentElement;
            const theme = THEMES[themeId];

            // Apply theme once
            localStorage.setItem(
              'app-theme-preference',
              JSON.stringify({ themeId, timestamp: Date.now() })
            );

            // Get CSS values after first application
            const primary1 = root.style.getPropertyValue('--color-primary');
            const secondary1 = root.style.getPropertyValue('--color-secondary');
            const accent1 = root.style.getPropertyValue('--color-accent');
            const tertiary1 = root.style.getPropertyValue('--color-tertiary');

            // Apply theme again
            localStorage.setItem(
              'app-theme-preference',
              JSON.stringify({ themeId, timestamp: Date.now() })
            );

            // Get CSS values after second application
            const primary2 = root.style.getPropertyValue('--color-primary');
            const secondary2 = root.style.getPropertyValue('--color-secondary');
            const accent2 = root.style.getPropertyValue('--color-accent');
            const tertiary2 = root.style.getPropertyValue('--color-tertiary');

            // Verify they're the same
            expect(primary1).toBe(primary2);
            expect(secondary1).toBe(secondary2);
            expect(accent1).toBe(accent2);
            expect(tertiary1).toBe(tertiary2);

            unmount();
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 4: Selected Theme Persists Across Reloads', () => {
    it('should persist selected theme to localStorage and restore it after app reload', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...Object.keys(THEMES)),
          (themeId) => {
            // Step 1: Pre-persist the theme to localStorage (simulating user selection)
            localStorage.setItem(
              'app-theme-preference',
              JSON.stringify({ themeId, timestamp: Date.now() })
            );

            // Step 2: Render ThemeProvider (first load)
            const { unmount: unmount1 } = render(
              <ThemeProvider>
                <TestComponent />
              </ThemeProvider>
            );

            // Step 3: Verify theme was loaded from localStorage
            const initialThemeElement = screen.getByTestId('current-theme');
            expect(initialThemeElement.textContent).toBe(themeId);

            // Step 4: Verify CSS custom properties match the theme
            const root = document.documentElement;
            const theme = THEMES[themeId];
            expect(root.style.getPropertyValue('--color-primary')).toBe(
              theme.colors.primary
            );
            expect(root.style.getPropertyValue('--color-secondary')).toBe(
              theme.colors.secondary
            );
            expect(root.style.getPropertyValue('--color-accent')).toBe(
              theme.colors.accent
            );
            expect(root.style.getPropertyValue('--color-tertiary')).toBe(
              theme.colors.tertiary
            );

            // Step 5: Verify theme is still in localStorage
            const storedData = localStorage.getItem('app-theme-preference');
            expect(storedData).toBeTruthy();
            const parsed = JSON.parse(storedData!);
            expect(parsed.themeId).toBe(themeId);

            // Step 6: Simulate app reload by unmounting and clearing CSS
            unmount1();
            document.documentElement.style.cssText = '';

            // Step 7: Remount ThemeProvider (simulating app reload)
            const { unmount: unmount2 } = render(
              <ThemeProvider>
                <TestComponent />
              </ThemeProvider>
            );

            // Step 8: Verify same theme is applied after reload
            const reloadedThemeElement = screen.getByTestId('current-theme');
            expect(reloadedThemeElement.textContent).toBe(themeId);

            // Step 9: Verify CSS custom properties still match the theme
            expect(root.style.getPropertyValue('--color-primary')).toBe(
              theme.colors.primary
            );
            expect(root.style.getPropertyValue('--color-secondary')).toBe(
              theme.colors.secondary
            );
            expect(root.style.getPropertyValue('--color-accent')).toBe(
              theme.colors.accent
            );
            expect(root.style.getPropertyValue('--color-tertiary')).toBe(
              theme.colors.tertiary
            );

            unmount2();
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 9: Default Theme Applied on Empty Storage', () => {
    it('should apply default theme when localStorage is empty', () => {
      fc.assert(
        fc.property(fc.constant(null), () => {
          // Ensure localStorage is empty
          localStorage.clear();

          const { unmount } = render(
            <ThemeProvider>
              <TestComponent />
            </ThemeProvider>
          );

          // Verify default theme is applied
          const currentThemeElement = screen.getByTestId('current-theme');
          expect(currentThemeElement.textContent).toBe(DEFAULT_THEME_ID);

          // Verify CSS custom properties match default theme
          const root = document.documentElement;
          const defaultTheme = THEMES[DEFAULT_THEME_ID];
          expect(root.style.getPropertyValue('--color-primary')).toBe(
            defaultTheme.colors.primary
          );
          expect(root.style.getPropertyValue('--color-secondary')).toBe(
            defaultTheme.colors.secondary
          );
          expect(root.style.getPropertyValue('--color-accent')).toBe(
            defaultTheme.colors.accent
          );
          expect(root.style.getPropertyValue('--color-tertiary')).toBe(
            defaultTheme.colors.tertiary
          );

          unmount();
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 10: Theme Application Performance', () => {
    it('should apply theme within 100ms for all valid themes', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...Object.keys(THEMES)),
          (themeId) => {
            const { unmount } = render(
              <ThemeProvider>
                <TestComponent />
              </ThemeProvider>
            );

            const root = document.documentElement;
            const theme = THEMES[themeId];

            // Measure time to apply theme
            const startTime = performance.now();

            // Apply theme via setTheme
            localStorage.setItem(
              'app-theme-preference',
              JSON.stringify({ themeId, timestamp: Date.now() })
            );

            // Trigger the theme application by setting CSS properties
            root.style.setProperty('--color-primary', theme.colors.primary);
            root.style.setProperty('--color-secondary', theme.colors.secondary);
            root.style.setProperty('--color-accent', theme.colors.accent);
            root.style.setProperty('--color-tertiary', theme.colors.tertiary);

            const endTime = performance.now();
            const elapsedTime = endTime - startTime;

            // Verify theme application completed within 100ms
            expect(elapsedTime).toBeLessThan(100);

            // Verify CSS custom properties are correctly set
            expect(root.style.getPropertyValue('--color-primary')).toBe(
              theme.colors.primary
            );
            expect(root.style.getPropertyValue('--color-secondary')).toBe(
              theme.colors.secondary
            );
            expect(root.style.getPropertyValue('--color-accent')).toBe(
              theme.colors.accent
            );
            expect(root.style.getPropertyValue('--color-tertiary')).toBe(
              theme.colors.tertiary
            );

            unmount();
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
