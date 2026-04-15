import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { ReactNode } from 'react';
import { useTheme } from '../theme/useTheme';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { THEMES, DEFAULT_THEME_ID } from '../../types/theme';

const STORAGE_KEY = 'app-theme-preference';

describe('useTheme', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Clear CSS custom properties
    document.documentElement.style.cssText = '';
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.style.cssText = '';
  });

  describe('hook returns correct theme context', () => {
    it('should return current theme from context', async () => {
      const wrapper = ({ children }: { children: ReactNode }) => (
        <ThemeProvider>{children}</ThemeProvider>
      );

      const { result } = renderHook(() => useTheme(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.currentTheme).toBeDefined();
      expect(result.current.currentTheme.id).toBe(DEFAULT_THEME_ID);
      expect(result.current.currentTheme.colors).toBeDefined();
      expect(result.current.currentTheme.colors.primary).toBeDefined();
      expect(result.current.currentTheme.colors.secondary).toBeDefined();
      expect(result.current.currentTheme.colors.accent).toBeDefined();
      expect(result.current.currentTheme.colors.tertiary).toBeDefined();
    });

    it('should return all available themes', async () => {
      const wrapper = ({ children }: { children: ReactNode }) => (
        <ThemeProvider>{children}</ThemeProvider>
      );

      const { result } = renderHook(() => useTheme(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.themes).toBeDefined();
      expect(result.current.themes.length).toBe(3);
      expect(result.current.themes.map((t) => t.id)).toContain('brown-tan');
      expect(result.current.themes.map((t) => t.id)).toContain('blue');
      expect(result.current.themes.map((t) => t.id)).toContain('green');
    });

    it('should return setTheme function', async () => {
      const wrapper = ({ children }: { children: ReactNode }) => (
        <ThemeProvider>{children}</ThemeProvider>
      );

      const { result } = renderHook(() => useTheme(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.setTheme).toBeDefined();
      expect(typeof result.current.setTheme).toBe('function');
    });

    it('should return isLoading flag', async () => {
      const wrapper = ({ children }: { children: ReactNode }) => (
        <ThemeProvider>{children}</ThemeProvider>
      );

      const { result } = renderHook(() => useTheme(), { wrapper });

      // Wait for loading to complete
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isLoading).toBe(false);
    });

    it('should load theme from localStorage if available', async () => {
      const blueTheme = THEMES['blue'];
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          themeId: 'blue',
          timestamp: Date.now(),
        })
      );

      const wrapper = ({ children }: { children: ReactNode }) => (
        <ThemeProvider>{children}</ThemeProvider>
      );

      const { result } = renderHook(() => useTheme(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.currentTheme.id).toBe('blue');
      expect(result.current.currentTheme.colors).toEqual(blueTheme.colors);
    });

    it('should apply default theme when localStorage is empty', async () => {
      const wrapper = ({ children }: { children: ReactNode }) => (
        <ThemeProvider>{children}</ThemeProvider>
      );

      const { result } = renderHook(() => useTheme(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.currentTheme.id).toBe(DEFAULT_THEME_ID);
    });
  });

  describe('hook throws error outside provider', () => {
    it('should throw error when used outside ThemeProvider', () => {
      // Suppress console.error for this test
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        renderHook(() => useTheme());
      }).toThrow('useTheme must be used within a ThemeProvider');

      consoleErrorSpy.mockRestore();
    });
  });

  describe('setTheme function', () => {
    it('should update current theme when valid theme is selected', async () => {
      const wrapper = ({ children }: { children: ReactNode }) => (
        <ThemeProvider>{children}</ThemeProvider>
      );

      const { result } = renderHook(() => useTheme(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const initialTheme = result.current.currentTheme.id;
      expect(initialTheme).toBe(DEFAULT_THEME_ID);

      // Change to blue theme
      let success = false;
      await act(async () => {
        success = result.current.setTheme('blue');
      });

      expect(success).toBe(true);
      expect(result.current.currentTheme.id).toBe('blue');
      expect(result.current.currentTheme.colors).toEqual(THEMES['blue'].colors);
    });

    it('should persist theme to localStorage when changed', async () => {
      const wrapper = ({ children }: { children: ReactNode }) => (
        <ThemeProvider>{children}</ThemeProvider>
      );

      const { result } = renderHook(() => useTheme(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        result.current.setTheme('green');
      });

      const stored = localStorage.getItem(STORAGE_KEY);
      expect(stored).toBeDefined();
      const parsed = JSON.parse(stored!);
      expect(parsed.themeId).toBe('green');
    });

    it('should reject invalid theme ID', async () => {
      const wrapper = ({ children }: { children: ReactNode }) => (
        <ThemeProvider>{children}</ThemeProvider>
      );

      const { result } = renderHook(() => useTheme(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const initialTheme = result.current.currentTheme.id;

      // Try to set invalid theme
      let success = false;
      await act(async () => {
        success = result.current.setTheme('invalid-theme');
      });

      expect(success).toBe(false);
      expect(result.current.currentTheme.id).toBe(initialTheme);
    });

    it('should apply CSS custom properties when theme is changed', async () => {
      const wrapper = ({ children }: { children: ReactNode }) => (
        <ThemeProvider>{children}</ThemeProvider>
      );

      const { result } = renderHook(() => useTheme(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        result.current.setTheme('blue');
      });

      const root = document.documentElement;
      const primaryColor = root.style.getPropertyValue('--color-primary');
      const secondaryColor = root.style.getPropertyValue('--color-secondary');
      const accentColor = root.style.getPropertyValue('--color-accent');
      const tertiaryColor = root.style.getPropertyValue('--color-tertiary');

      expect(primaryColor).toBe(THEMES['blue'].colors.primary);
      expect(secondaryColor).toBe(THEMES['blue'].colors.secondary);
      expect(accentColor).toBe(THEMES['blue'].colors.accent);
      expect(tertiaryColor).toBe(THEMES['blue'].colors.tertiary);
    });
  });
});
