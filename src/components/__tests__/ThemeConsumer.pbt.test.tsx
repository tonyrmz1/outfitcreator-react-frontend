import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import * as fc from 'fast-check';
import { ThemeProvider, useTheme } from '../../contexts/ThemeContext';
import { THEMES } from '../../types/theme';

/**
 * Property-Based Tests for Theme Consumer Components
 * **Validates: Requirements 5.2**
 */

// Test component that uses theme colors via Tailwind classes
function ThemedComponent() {
  const { currentTheme } = useTheme();
  return (
    <div
      data-testid="themed-component"
      className="bg-primary text-secondary border-2 border-accent"
      data-theme-id={currentTheme.id}
    >
      <span data-testid="tertiary-element" className="bg-tertiary">
        Tertiary Color
      </span>
    </div>
  );
}

describe('Theme Consumer Components - Property-Based Tests', () => {
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

  describe('Property 7: New Components Receive Current Theme', () => {
    it('should apply current theme colors to newly rendered components', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...Object.keys(THEMES)),
          (themeId) => {
            // Pre-set the theme in localStorage
            localStorage.setItem(
              'app-theme-preference',
              JSON.stringify({ themeId, timestamp: Date.now() })
            );

            // Render provider and initial component
            const { rerender, unmount } = render(
              <ThemeProvider>
                <div data-testid="placeholder" />
              </ThemeProvider>
            );

            const theme = THEMES[themeId];
            const root = document.documentElement;

            // Verify theme is applied to DOM
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

            // Now render a new component after theme is applied
            rerender(
              <ThemeProvider>
                <ThemedComponent />
              </ThemeProvider>
            );

            // Verify the new component receives the theme colors
            const themedComponent = screen.getByTestId('themed-component');
            expect(themedComponent).toBeInTheDocument();

            // Verify component has the correct theme ID
            expect(themedComponent.getAttribute('data-theme-id')).toBe(themeId);

            // Verify component has Tailwind classes applied
            expect(themedComponent.className).toContain('bg-primary');
            expect(themedComponent.className).toContain('text-secondary');
            expect(themedComponent.className).toContain('border-accent');

            // Verify tertiary color element also receives theme
            const tertiaryElement = screen.getByTestId('tertiary-element');
            expect(tertiaryElement).toBeInTheDocument();
            expect(tertiaryElement.className).toContain('bg-tertiary');

            unmount();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should apply theme colors to multiple newly rendered components', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...Object.keys(THEMES)),
          (themeId) => {
            // Pre-set the theme in localStorage
            localStorage.setItem(
              'app-theme-preference',
              JSON.stringify({ themeId, timestamp: Date.now() })
            );

            const theme = THEMES[themeId];

            // Render provider with multiple new components
            const { unmount } = render(
              <ThemeProvider>
                <div>
                  <ThemedComponent />
                  <ThemedComponent />
                  <ThemedComponent />
                </div>
              </ThemeProvider>
            );

            // Verify all components receive the theme
            const themedComponents = screen.getAllByTestId('themed-component');
            expect(themedComponents).toHaveLength(3);

            themedComponents.forEach((component) => {
              // Verify each component has the correct theme ID
              expect(component.getAttribute('data-theme-id')).toBe(themeId);

              // Verify each component has Tailwind classes
              expect(component.className).toContain('bg-primary');
              expect(component.className).toContain('text-secondary');
              expect(component.className).toContain('border-accent');
            });

            // Verify all tertiary elements exist
            const tertiaryElements = screen.getAllByTestId('tertiary-element');
            expect(tertiaryElements).toHaveLength(3);

            unmount();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should apply theme colors to components rendered after theme change', () => {
      fc.assert(
        fc.property(
          fc.tuple(
            fc.constantFrom(...Object.keys(THEMES)),
            fc.constantFrom(...Object.keys(THEMES))
          ).filter(([theme1, theme2]) => theme1 !== theme2),
          ([themeId1, themeId2]) => {
            // Start with first theme
            localStorage.setItem(
              'app-theme-preference',
              JSON.stringify({ themeId: themeId1, timestamp: Date.now() })
            );

            const { rerender, unmount } = render(
              <ThemeProvider>
                <ThemedComponent />
              </ThemeProvider>
            );

            const theme1 = THEMES[themeId1];
            const root = document.documentElement;

            // Verify first theme is applied
            expect(root.style.getPropertyValue('--color-primary')).toBe(
              theme1.colors.primary
            );

            // Verify component has first theme
            let themedComponent = screen.getByTestId('themed-component');
            expect(themedComponent.getAttribute('data-theme-id')).toBe(themeId1);

            // Change to second theme
            localStorage.setItem(
              'app-theme-preference',
              JSON.stringify({ themeId: themeId2, timestamp: Date.now() })
            );

            // Trigger storage event to simulate theme change
            const storageEvent = new StorageEvent('storage', {
              key: 'app-theme-preference',
              newValue: JSON.stringify({ themeId: themeId2, timestamp: Date.now() }),
            });
            window.dispatchEvent(storageEvent);

            // Re-render to pick up new theme
            rerender(
              <ThemeProvider>
                <ThemedComponent />
              </ThemeProvider>
            );

            // Verify new component receives the updated theme
            themedComponent = screen.getByTestId('themed-component');
            expect(themedComponent).toBeInTheDocument();

            // Verify the component has the new theme
            expect(themedComponent.getAttribute('data-theme-id')).toBe(themeId2);

            unmount();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should ensure CSS custom properties are available to all new components', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...Object.keys(THEMES)),
          (themeId) => {
            // Pre-set the theme in localStorage
            localStorage.setItem(
              'app-theme-preference',
              JSON.stringify({ themeId, timestamp: Date.now() })
            );

            const theme = THEMES[themeId];

            const { unmount } = render(
              <ThemeProvider>
                <ThemedComponent />
              </ThemeProvider>
            );

            const root = document.documentElement;

            // Verify all CSS custom properties are set on root
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

            // Verify component can access theme via context
            const themedComponent = screen.getByTestId('themed-component');
            expect(themedComponent).toBeInTheDocument();

            // Verify component has Tailwind classes that reference CSS custom properties
            expect(themedComponent.className).toContain('bg-primary');
            expect(themedComponent.className).toContain('text-secondary');
            expect(themedComponent.className).toContain('border-accent');

            unmount();
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
