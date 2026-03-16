import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { ThemeProvider, useTheme } from './ThemeContext';
import { THEMES, DEFAULT_THEME_ID } from '../types/theme';

/**
 * Unit Tests for ThemeContext - Multi-tab Synchronization
 * Validates: Requirements 2.2
 */

// Test component that uses the theme hook
function TestComponent() {
  const { currentTheme, themes, setTheme, isLoading } = useTheme();
  return (
    <div>
      <div data-testid="current-theme">{currentTheme.id}</div>
      <div data-testid="theme-count">{themes.length}</div>
      <div data-testid="is-loading">{isLoading ? 'true' : 'false'}</div>
      <div data-testid="primary-color">
        {document.documentElement.style.getPropertyValue('--color-primary')}
      </div>
      <div data-testid="secondary-color">
        {document.documentElement.style.getPropertyValue('--color-secondary')}
      </div>
      <div data-testid="accent-color">
        {document.documentElement.style.getPropertyValue('--color-accent')}
      </div>
      <div data-testid="tertiary-color">
        {document.documentElement.style.getPropertyValue('--color-tertiary')}
      </div>
    </div>
  );
}

describe('ThemeContext - Multi-tab Synchronization', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Clear all CSS custom properties
    document.documentElement.style.cssText = '';
    // Clear all event listeners
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.style.cssText = '';
  });

  describe('10.1 Storage Event Listener Registration', () => {
    it('should register storage event listener on mount', () => {
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener');

      const { unmount } = render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      // Verify storage event listener was registered
      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'storage',
        expect.any(Function)
      );

      addEventListenerSpy.mockRestore();
      unmount();
    });

    it('should remove storage event listener on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

      const { unmount } = render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      unmount();

      // Verify storage event listener was removed
      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'storage',
        expect.any(Function)
      );

      removeEventListenerSpy.mockRestore();
    });
  });

  describe('10.1 Theme Updates on Storage Change', () => {
    it('should update theme when storage event is triggered with new theme', async () => {
      const { unmount } = render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      // Verify initial theme is default
      let currentThemeElement = screen.getByTestId('current-theme');
      expect(currentThemeElement.textContent).toBe(DEFAULT_THEME_ID);

      // Simulate storage change from another tab
      const newThemeId = 'blue';
      const storageEvent = new StorageEvent('storage', {
        key: 'app-theme-preference',
        newValue: JSON.stringify({
          themeId: newThemeId,
          timestamp: Date.now(),
        }),
        oldValue: null,
        storageArea: localStorage,
      });

      window.dispatchEvent(storageEvent);

      // Wait for state update
      await waitFor(() => {
        currentThemeElement = screen.getByTestId('current-theme');
        expect(currentThemeElement.textContent).toBe(newThemeId);
      });

      unmount();
    });

    it('should update CSS custom properties when storage event is triggered', async () => {
      const { unmount } = render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      const newThemeId = 'green';
      const newTheme = THEMES[newThemeId];

      // Simulate storage change from another tab
      const storageEvent = new StorageEvent('storage', {
        key: 'app-theme-preference',
        newValue: JSON.stringify({
          themeId: newThemeId,
          timestamp: Date.now(),
        }),
        oldValue: null,
        storageArea: localStorage,
      });

      window.dispatchEvent(storageEvent);

      // Wait for CSS properties to update
      await waitFor(() => {
        const root = document.documentElement;
        expect(root.style.getPropertyValue('--color-primary')).toBe(
          newTheme.colors.primary
        );
        expect(root.style.getPropertyValue('--color-secondary')).toBe(
          newTheme.colors.secondary
        );
        expect(root.style.getPropertyValue('--color-accent')).toBe(
          newTheme.colors.accent
        );
        expect(root.style.getPropertyValue('--color-tertiary')).toBe(
          newTheme.colors.tertiary
        );
      });

      unmount();
    });

    it('should trigger re-render when storage event is triggered', async () => {
      const { unmount } = render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      const newThemeId = 'blue';

      // Simulate storage change from another tab
      const storageEvent = new StorageEvent('storage', {
        key: 'app-theme-preference',
        newValue: JSON.stringify({
          themeId: newThemeId,
          timestamp: Date.now(),
        }),
        oldValue: null,
        storageArea: localStorage,
      });

      window.dispatchEvent(storageEvent);

      // Verify component re-rendered with new theme
      await waitFor(() => {
        const currentThemeElement = screen.getByTestId('current-theme');
        expect(currentThemeElement.textContent).toBe(newThemeId);
      });

      unmount();
    });

    it('should ignore storage events for other keys', async () => {
      const { unmount } = render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      // Get initial theme
      let currentThemeElement = screen.getByTestId('current-theme');
      const initialTheme = currentThemeElement.textContent;

      // Simulate storage change for a different key
      const storageEvent = new StorageEvent('storage', {
        key: 'some-other-key',
        newValue: 'some-value',
        oldValue: null,
        storageArea: localStorage,
      });

      window.dispatchEvent(storageEvent);

      // Wait a bit to ensure no update happens
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Verify theme hasn't changed
      currentThemeElement = screen.getByTestId('current-theme');
      expect(currentThemeElement.textContent).toBe(initialTheme);

      unmount();
    });

    it('should handle invalid theme ID in storage event gracefully', async () => {
      const { unmount } = render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      // Get initial theme
      let currentThemeElement = screen.getByTestId('current-theme');
      const initialTheme = currentThemeElement.textContent;

      // Simulate storage change with invalid theme ID
      const storageEvent = new StorageEvent('storage', {
        key: 'app-theme-preference',
        newValue: JSON.stringify({
          themeId: 'invalid-theme-id',
          timestamp: Date.now(),
        }),
        oldValue: null,
        storageArea: localStorage,
      });

      window.dispatchEvent(storageEvent);

      // Wait a bit
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Verify theme hasn't changed (invalid theme is ignored)
      currentThemeElement = screen.getByTestId('current-theme');
      expect(currentThemeElement.textContent).toBe(initialTheme);

      unmount();
    });

    it('should handle malformed JSON in storage event gracefully', async () => {
      const { unmount } = render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      // Get initial theme
      let currentThemeElement = screen.getByTestId('current-theme');
      const initialTheme = currentThemeElement.textContent;

      // Simulate storage change with malformed JSON
      const storageEvent = new StorageEvent('storage', {
        key: 'app-theme-preference',
        newValue: 'not-valid-json{',
        oldValue: null,
        storageArea: localStorage,
      });

      window.dispatchEvent(storageEvent);

      // Wait a bit
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Verify theme hasn't changed
      currentThemeElement = screen.getByTestId('current-theme');
      expect(currentThemeElement.textContent).toBe(initialTheme);

      unmount();
    });

    it('should handle null newValue in storage event', async () => {
      const { unmount } = render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      // Get initial theme
      let currentThemeElement = screen.getByTestId('current-theme');
      const initialTheme = currentThemeElement.textContent;

      // Simulate storage clear event (newValue is null)
      const storageEvent = new StorageEvent('storage', {
        key: 'app-theme-preference',
        newValue: null,
        oldValue: JSON.stringify({
          themeId: 'blue',
          timestamp: Date.now(),
        }),
        storageArea: localStorage,
      });

      window.dispatchEvent(storageEvent);

      // Wait a bit
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Verify theme hasn't changed (null newValue is ignored)
      currentThemeElement = screen.getByTestId('current-theme');
      expect(currentThemeElement.textContent).toBe(initialTheme);

      unmount();
    });
  });

  describe('Multi-tab Synchronization Edge Cases', () => {
    it('should handle rapid storage events from multiple tabs', async () => {
      const { unmount } = render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      const themeIds = ['blue', 'green', 'brown-tan'];

      // Simulate rapid storage changes
      for (const themeId of themeIds) {
        const storageEvent = new StorageEvent('storage', {
          key: 'app-theme-preference',
          newValue: JSON.stringify({
            themeId: themeId,
            timestamp: Date.now(),
          }),
          oldValue: null,
          storageArea: localStorage,
        });

        window.dispatchEvent(storageEvent);
      }

      // Wait for final update
      await waitFor(() => {
        const currentThemeElement = screen.getByTestId('current-theme');
        expect(currentThemeElement.textContent).toBe('brown-tan');
      });

      unmount();
    });

    it('should apply correct CSS properties after storage event', async () => {
      const { unmount } = render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      const newThemeId = 'blue';
      const newTheme = THEMES[newThemeId];

      // Simulate storage change
      const storageEvent = new StorageEvent('storage', {
        key: 'app-theme-preference',
        newValue: JSON.stringify({
          themeId: newThemeId,
          timestamp: Date.now(),
        }),
        oldValue: null,
        storageArea: localStorage,
      });

      window.dispatchEvent(storageEvent);

      // Verify all CSS properties are correctly applied
      await waitFor(() => {
        const root = document.documentElement;
        expect(root.style.getPropertyValue('--color-primary')).toBe(
          newTheme.colors.primary
        );
        expect(root.style.getPropertyValue('--color-secondary')).toBe(
          newTheme.colors.secondary
        );
        expect(root.style.getPropertyValue('--color-accent')).toBe(
          newTheme.colors.accent
        );
        expect(root.style.getPropertyValue('--color-tertiary')).toBe(
          newTheme.colors.tertiary
        );
      });

      unmount();
    });
  });
});
