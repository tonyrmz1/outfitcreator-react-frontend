import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeSelector } from '../features/Theme/ThemeSelector';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { THEMES } from '../../types/theme';

describe('ThemeSelector', () => {
  const renderWithThemeProvider = (component: React.ReactElement) => {
    return render(<ThemeProvider>{component}</ThemeProvider>);
  };

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('should render all available themes', () => {
    renderWithThemeProvider(<ThemeSelector />);

    // Check that all theme names are rendered
    Object.values(THEMES).forEach((theme) => {
      expect(screen.getByText(theme.name)).toBeInTheDocument();
    });
  });

  it('should display color previews for each theme', () => {
    renderWithThemeProvider(<ThemeSelector />);

    // Check that color swatches are rendered for each theme
    Object.values(THEMES).forEach((theme) => {
      const primarySwatch = screen.getByTitle(`Primary: ${theme.colors.primary}`);
      const secondarySwatch = screen.getByTitle(
        `Secondary: ${theme.colors.secondary}`
      );
      const accentSwatch = screen.getByTitle(`Accent: ${theme.colors.accent}`);
      const tertiarySwatch = screen.getByTitle(
        `Tertiary: ${theme.colors.tertiary}`
      );

      expect(primarySwatch).toBeInTheDocument();
      expect(secondarySwatch).toBeInTheDocument();
      expect(accentSwatch).toBeInTheDocument();
      expect(tertiarySwatch).toBeInTheDocument();

      // Verify colors are applied correctly
      expect(primarySwatch).toHaveStyle(
        `background-color: ${theme.colors.primary}`
      );
      expect(secondarySwatch).toHaveStyle(
        `background-color: ${theme.colors.secondary}`
      );
      expect(accentSwatch).toHaveStyle(`background-color: ${theme.colors.accent}`);
      expect(tertiarySwatch).toHaveStyle(
        `background-color: ${theme.colors.tertiary}`
      );
    });
  });

  it('should highlight the currently selected theme', () => {
    renderWithThemeProvider(<ThemeSelector />);

    // The default theme should be highlighted
    const defaultThemeName = THEMES['brown-tan'].name;
    const defaultThemeButton = screen.getByLabelText(
      `Select ${defaultThemeName} theme`
    );

    // Check that the button has the selected styling
    expect(defaultThemeButton).toHaveClass('border-secondary');
    expect(defaultThemeButton).toHaveClass('bg-tertiary');
    expect(defaultThemeButton).toHaveClass('shadow-lg');

    // Check aria-pressed attribute
    expect(defaultThemeButton).toHaveAttribute('aria-pressed', 'true');
  });

  it('should call setTheme when a theme option is clicked', () => {
    renderWithThemeProvider(<ThemeSelector />);

    // Click on the blue theme
    const blueThemeButton = screen.getByLabelText('Select Blue theme');
    fireEvent.click(blueThemeButton);

    // After clicking, the blue theme should be highlighted
    expect(blueThemeButton).toHaveAttribute('aria-pressed', 'true');
  });

  it('should update selection when switching between themes', async () => {
    renderWithThemeProvider(<ThemeSelector />);

    const brownTanButton = screen.getByLabelText('Select Brown/Tan theme');
    const blueButton = screen.getByLabelText('Select Blue theme');
    const greenButton = screen.getByLabelText('Select Green theme');

    // Wait for initial render and theme to be set
    await waitFor(() => {
      expect(brownTanButton).toHaveClass('bg-tertiary');
    });

    // Initially brown-tan should be selected (has the selected styling)
    expect(brownTanButton).toHaveClass('bg-tertiary');
    expect(blueButton).not.toHaveClass('bg-tertiary');
    expect(greenButton).not.toHaveClass('bg-tertiary');

    // Click blue theme
    fireEvent.click(blueButton);
    await waitFor(() => {
      expect(blueButton).toHaveClass('bg-tertiary');
    });
    expect(brownTanButton).not.toHaveClass('bg-tertiary');
    expect(greenButton).not.toHaveClass('bg-tertiary');

    // Click green theme
    fireEvent.click(greenButton);
    await waitFor(() => {
      expect(greenButton).toHaveClass('bg-tertiary');
    });
    expect(brownTanButton).not.toHaveClass('bg-tertiary');
    expect(blueButton).not.toHaveClass('bg-tertiary');
  });

  it('should accept custom className prop', () => {
    const { container } = renderWithThemeProvider(
      <ThemeSelector className="custom-class" />
    );

    const wrapper = container.querySelector('.custom-class');
    expect(wrapper).toBeInTheDocument();
  });

  it('should have proper accessibility attributes', () => {
    renderWithThemeProvider(<ThemeSelector />);

    Object.values(THEMES).forEach((theme) => {
      const button = screen.getByLabelText(`Select ${theme.name} theme`);
      expect(button).toHaveAttribute('aria-label');
      expect(button).toHaveAttribute('aria-pressed');
    });
  });
});
