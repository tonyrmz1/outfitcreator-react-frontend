import React, { createContext, ReactNode, useEffect, useState } from 'react';
import { Theme, THEMES, DEFAULT_THEME_ID } from '../types/theme';
import { validateTheme, handleCorruptedStorage } from '../utils/themeValidation';

const STORAGE_KEY = 'app-theme-preference';

export interface ThemeContextType {
  currentTheme: Theme;
  themes: Theme[];
  setTheme: (themeId: string) => boolean;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * ThemeProvider component that manages theme state and persistence
 * Initializes theme from localStorage or uses default theme
 * Applies theme via CSS custom properties
 * Listens for storage changes for multi-tab synchronization
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  const themesArray = Object.values(THEMES);
  const [currentTheme, setCurrentTheme] = useState<Theme>(THEMES[DEFAULT_THEME_ID]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize theme from localStorage on mount
  useEffect(() => {
    const loadTheme = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          const themeId = parsed.themeId;

          // Validate theme exists
          if (themeId && THEMES[themeId]) {
            setCurrentTheme(THEMES[themeId]);
            applyThemeToDOM(THEMES[themeId]);
          } else {
            // Invalid theme in storage, use default
            setCurrentTheme(THEMES[DEFAULT_THEME_ID]);
            applyThemeToDOM(THEMES[DEFAULT_THEME_ID]);
          }
        } else {
          // No theme in storage, use default
          setCurrentTheme(THEMES[DEFAULT_THEME_ID]);
          applyThemeToDOM(THEMES[DEFAULT_THEME_ID]);
        }
      } catch (error) {
        // Corrupted storage data, use default
        handleCorruptedStorage(error instanceof Error ? error : undefined);
        setCurrentTheme(THEMES[DEFAULT_THEME_ID]);
        applyThemeToDOM(THEMES[DEFAULT_THEME_ID]);
      } finally {
        setIsLoading(false);
      }
    };

    loadTheme();
  }, []);

  // Listen for storage changes (multi-tab synchronization)
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY && event.newValue) {
        try {
          const parsed = JSON.parse(event.newValue);
          const themeId = parsed.themeId;

          if (themeId && THEMES[themeId]) {
            setCurrentTheme(THEMES[themeId]);
            applyThemeToDOM(THEMES[themeId]);
          }
        } catch (error) {
          console.error('Failed to sync theme from storage event:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  /**
   * Apply theme by setting CSS custom properties on document root
   */
  const applyThemeToDOM = (theme: Theme) => {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', theme.colors.primary);
    root.style.setProperty('--color-secondary', theme.colors.secondary);
    root.style.setProperty('--color-accent', theme.colors.accent);
    root.style.setProperty('--color-tertiary', theme.colors.tertiary);
  };

  /**
   * Set theme with validation
   * Returns true if theme was successfully set, false otherwise
   */
  const setTheme = (themeId: string): boolean => {
    // Validate theme exists
    if (!THEMES[themeId]) {
      console.warn(`Invalid theme ID: ${themeId}`);
      return false;
    }

    const theme = THEMES[themeId];

    // Validate theme structure and colors
    if (!validateThemeLocal(theme)) {
      console.error(`Invalid theme structure: ${themeId}`);
      return false;
    }

    // Update state
    setCurrentTheme(theme);

    // Apply to DOM
    applyThemeToDOM(theme);

    // Persist to localStorage
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          themeId: themeId,
          timestamp: Date.now(),
        })
      );
    } catch (error) {
      console.error('Failed to persist theme to storage:', error);
      return false;
    }

    return true;
  };

  /**
   * Validate theme structure and color codes
   */
  const validateThemeLocal = (theme: Theme): boolean => {
    return validateTheme(theme);
  };

  const value: ThemeContextType = {
    currentTheme,
    themes: themesArray,
    setTheme,
    isLoading,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextType {
  const context = React.useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
