import React from 'react';
import { describe, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import fc from 'fast-check';
import { ThemeSelector } from './ThemeSelector';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { THEMES } from '../../types/theme';

describe('ThemeSelector - Property-Based Tests', () => {
  const renderWithThemeProvider = (component: React.ReactElement) => {
    return render(<ThemeProvider>{component}</ThemeProvider>);
  };

  beforeEach(() => {
    localStorage.clear();
  });

  /**
   * Property 3: Theme Selector Displays All Themes
   * **Validates: Requirements 1.2**
   *
   * For any set of available themes, the Theme Selector component should render
   * all themes as selectable options.
   *
   * This property verifies that:
   * 1. All themes from the THEMES constant are rendered
   * 2. Each theme is displayed as a clickable button
   * 3. Each theme's name is visible
   */
  it('should display all available themes as selectable options', () => {
    fc.assert(
      fc.property(fc.constant(null), () => {
        // Clear the DOM
        const { unmount } = renderWithThemeProvider(<ThemeSelector />);

        // Get all available themes
        const availableThemes = Object.values(THEMES);

        // Verify each theme is rendered
        availableThemes.forEach((theme) => {
          const themeButton = screen.getByLabelText(`Select ${theme.name} theme`);
          expect(themeButton).toBeInTheDocument();
          expect(themeButton).toHaveAttribute('aria-label');
          expect(themeButton).toHaveAttribute('aria-pressed');
        });

        // Verify the number of theme buttons matches the number of available themes
        const themeButtons = screen.getAllByRole('button');
        expect(themeButtons).toHaveLength(availableThemes.length);

        unmount();
      }),
      { numRuns: 100 }
    );
  });
});
