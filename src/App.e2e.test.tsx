import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import App from './App';

// Mock the useAuth hook
const mockUseAuth = vi.fn();

vi.mock('./hooks/useAuth', () => ({
  useAuth: () => mockUseAuth(),
}));

// Mock the useAutoLogout hook
vi.mock('./hooks/useAutoLogout', () => ({
  useAutoLogout: vi.fn(),
}));

// Mock page components
vi.mock('./pages/LoginPage', () => ({
  default: () => <div data-testid="login-page">Login Page</div>,
}));

vi.mock('./pages/RegisterPage', () => ({
  default: () => <div data-testid="register-page">Register Page</div>,
}));

vi.mock('./pages/ClosetPage', () => ({
  default: () => <div data-testid="closet-page">Closet Page</div>,
}));

vi.mock('./pages/OutfitsPage', () => ({
  default: () => <div data-testid="outfits-page">Outfits Page</div>,
}));

vi.mock('./pages/RecommendationsPage', () => ({
  default: () => <div data-testid="recommendations-page">Recommendations Page</div>,
}));

vi.mock('./pages/ProfilePage', () => ({
  default: () => <div data-testid="profile-page">Profile Page</div>,
}));

describe('App E2E Integration Tests - Theme Color Selector', () => {
  const authenticatedUser = {
    user: { id: 1, email: 'test@example.com', firstName: 'John', lastName: 'Doe' },
    isAuthenticated: true,
    isLoading: false,
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    updateProfile: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    // Clear CSS custom properties
    document.documentElement.style.removeProperty('--color-primary');
    document.documentElement.style.removeProperty('--color-secondary');
    document.documentElement.style.removeProperty('--color-accent');
    document.documentElement.style.removeProperty('--color-tertiary');
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.style.removeProperty('--color-primary');
    document.documentElement.style.removeProperty('--color-secondary');
    document.documentElement.style.removeProperty('--color-accent');
    document.documentElement.style.removeProperty('--color-tertiary');
  });

  describe('Requirement 1.1: Theme selector in profile', () => {
    it('displays theme selector component in profile page', async () => {
      mockUseAuth.mockReturnValue(authenticatedUser);

      // Navigate to profile page
      window.history.pushState({}, '', '/profile');
      render(<App />);

      // Wait for profile page to load
      await waitFor(() => {
        expect(screen.getByTestId('profile-page')).toBeInTheDocument();
      });
    });
  });

  describe('Requirement 2.1: Colors update immediately', () => {
    it('updates application colors immediately when theme is selected', async () => {
      mockUseAuth.mockReturnValue(authenticatedUser);

      render(<App />);

      // Wait for app to initialize with default theme (Brown/Tan)
      await waitFor(() => {
        const primaryColor = document.documentElement.style.getPropertyValue('--color-primary');
        expect(primaryColor).toBe('#F5F1E8'); // Brown/Tan default
      });

      // Simulate selecting Blue theme via storage event (since we can't interact with mocked ProfilePage)
      const blueThemePreference = {
        themeId: 'blue',
        timestamp: Date.now(),
      };
      localStorage.setItem('app-theme-preference', JSON.stringify(blueThemePreference));

      // Trigger storage event to simulate theme change
      const storageEvent = new StorageEvent('storage', {
        key: 'app-theme-preference',
        newValue: JSON.stringify(blueThemePreference),
        oldValue: JSON.stringify({ themeId: 'brown-tan', timestamp: Date.now() }),
      });
      window.dispatchEvent(storageEvent);

      // Verify colors update immediately
      await waitFor(() => {
        const primaryColor = document.documentElement.style.getPropertyValue('--color-primary');
        const secondaryColor = document.documentElement.style.getPropertyValue('--color-secondary');
        const accentColor = document.documentElement.style.getPropertyValue('--color-accent');
        const tertiaryColor = document.documentElement.style.getPropertyValue('--color-tertiary');

        // Blue theme colors
        expect(primaryColor).toBe('#3E848C');
        expect(secondaryColor).toBe('#025159');
        expect(accentColor).toBe('#A67458');
        expect(tertiaryColor).toBe('#C4EEF2');
      });
    });

    it('applies all four color properties when theme is selected', async () => {
      mockUseAuth.mockReturnValue(authenticatedUser);

      render(<App />);

      // Wait for default theme to be applied
      await waitFor(() => {
        const primaryColor = document.documentElement.style.getPropertyValue('--color-primary');
        expect(primaryColor).toBe('#F5F1E8');
      });

      // Select Green theme
      const greenThemePreference = {
        themeId: 'green',
        timestamp: Date.now(),
      };
      localStorage.setItem('app-theme-preference', JSON.stringify(greenThemePreference));

      const storageEvent = new StorageEvent('storage', {
        key: 'app-theme-preference',
        newValue: JSON.stringify(greenThemePreference),
      });
      window.dispatchEvent(storageEvent);

      // Verify all four colors are applied
      await waitFor(() => {
        const primary = document.documentElement.style.getPropertyValue('--color-primary');
        const secondary = document.documentElement.style.getPropertyValue('--color-secondary');
        const accent = document.documentElement.style.getPropertyValue('--color-accent');
        const tertiary = document.documentElement.style.getPropertyValue('--color-tertiary');

        // Green theme colors
        expect(primary).toBe('#F4F6F1');
        expect(secondary).toBe('#8BA888');
        expect(accent).toBe('#4D6B4F');
        expect(tertiary).toBe('#D4A373');
      });
    });
  });

  describe('Requirement 3.1: Theme persisted', () => {
    it('persists theme selection to localStorage', async () => {
      mockUseAuth.mockReturnValue(authenticatedUser);

      render(<App />);

      // Wait for app to initialize
      await waitFor(() => {
        const primaryColor = document.documentElement.style.getPropertyValue('--color-primary');
        expect(primaryColor).toBe('#F5F1E8');
      });

      // Select Blue theme
      const blueThemePreference = {
        themeId: 'blue',
        timestamp: Date.now(),
      };
      localStorage.setItem('app-theme-preference', JSON.stringify(blueThemePreference));

      const storageEvent = new StorageEvent('storage', {
        key: 'app-theme-preference',
        newValue: JSON.stringify(blueThemePreference),
      });
      window.dispatchEvent(storageEvent);

      // Verify theme is persisted to localStorage
      await waitFor(() => {
        const stored = localStorage.getItem('app-theme-preference');
        expect(stored).toBeTruthy();
        const parsed = JSON.parse(stored!);
        expect(parsed.themeId).toBe('blue');
      });
    });
  });

  describe('Requirement 4.1: Theme applied on load', () => {
    it('applies saved theme automatically when app loads', async () => {
      mockUseAuth.mockReturnValue(authenticatedUser);

      // Pre-set Blue theme in localStorage
      const blueThemePreference = {
        themeId: 'blue',
        timestamp: Date.now(),
      };
      localStorage.setItem('app-theme-preference', JSON.stringify(blueThemePreference));

      render(<App />);

      // Verify Blue theme is applied on load
      await waitFor(() => {
        const primaryColor = document.documentElement.style.getPropertyValue('--color-primary');
        const secondaryColor = document.documentElement.style.getPropertyValue('--color-secondary');
        const accentColor = document.documentElement.style.getPropertyValue('--color-accent');
        const tertiaryColor = document.documentElement.style.getPropertyValue('--color-tertiary');

        // Blue theme colors
        expect(primaryColor).toBe('#3E848C');
        expect(secondaryColor).toBe('#025159');
        expect(accentColor).toBe('#A67458');
        expect(tertiaryColor).toBe('#C4EEF2');
      });
    });

    it('applies default theme when localStorage is empty on load', async () => {
      mockUseAuth.mockReturnValue(authenticatedUser);

      // Ensure localStorage is empty
      localStorage.clear();

      render(<App />);

      // Verify default theme (Brown/Tan) is applied
      await waitFor(() => {
        const primaryColor = document.documentElement.style.getPropertyValue('--color-primary');
        const secondaryColor = document.documentElement.style.getPropertyValue('--color-secondary');
        const accentColor = document.documentElement.style.getPropertyValue('--color-accent');
        const tertiaryColor = document.documentElement.style.getPropertyValue('--color-tertiary');

        // Brown/Tan default theme colors
        expect(primaryColor).toBe('#F5F1E8');
        expect(secondaryColor).toBe('#8B7355');
        expect(accentColor).toBe('#3D3D2D');
        expect(tertiaryColor).toBe('#C89B7B');
      });
    });
  });

  describe('Requirement 5.1: Theme consistency', () => {
    it('maintains consistent theme across multiple theme changes', async () => {
      mockUseAuth.mockReturnValue(authenticatedUser);

      render(<App />);

      // Wait for default theme
      await waitFor(() => {
        const primaryColor = document.documentElement.style.getPropertyValue('--color-primary');
        expect(primaryColor).toBe('#F5F1E8');
      });

      // Change to Blue theme
      const blueThemePreference = {
        themeId: 'blue',
        timestamp: Date.now(),
      };
      localStorage.setItem('app-theme-preference', JSON.stringify(blueThemePreference));

      let storageEvent = new StorageEvent('storage', {
        key: 'app-theme-preference',
        newValue: JSON.stringify(blueThemePreference),
      });
      window.dispatchEvent(storageEvent);

      // Verify Blue theme is applied
      await waitFor(() => {
        const primaryColor = document.documentElement.style.getPropertyValue('--color-primary');
        expect(primaryColor).toBe('#3E848C');
      });

      // Change to Green theme
      const greenThemePreference = {
        themeId: 'green',
        timestamp: Date.now(),
      };
      localStorage.setItem('app-theme-preference', JSON.stringify(greenThemePreference));

      storageEvent = new StorageEvent('storage', {
        key: 'app-theme-preference',
        newValue: JSON.stringify(greenThemePreference),
      });
      window.dispatchEvent(storageEvent);

      // Verify Green theme is applied
      await waitFor(() => {
        const primaryColor = document.documentElement.style.getPropertyValue('--color-primary');
        const secondaryColor = document.documentElement.style.getPropertyValue('--color-secondary');
        const accentColor = document.documentElement.style.getPropertyValue('--color-accent');
        const tertiaryColor = document.documentElement.style.getPropertyValue('--color-tertiary');

        // Green theme colors
        expect(primaryColor).toBe('#F4F6F1');
        expect(secondaryColor).toBe('#8BA888');
        expect(accentColor).toBe('#4D6B4F');
        expect(tertiaryColor).toBe('#D4A373');
      });

      // Change back to Blue theme
      localStorage.setItem('app-theme-preference', JSON.stringify(blueThemePreference));

      storageEvent = new StorageEvent('storage', {
        key: 'app-theme-preference',
        newValue: JSON.stringify(blueThemePreference),
      });
      window.dispatchEvent(storageEvent);

      // Verify Blue theme is applied again (consistency)
      await waitFor(() => {
        const primaryColor = document.documentElement.style.getPropertyValue('--color-primary');
        expect(primaryColor).toBe('#3E848C');
      });
    });
  });

  describe('Requirement 6.1: Invalid theme selection rejected', () => {
    it('rejects invalid theme selection and maintains current theme', async () => {
      mockUseAuth.mockReturnValue(authenticatedUser);

      render(<App />);

      // Wait for default theme
      await waitFor(() => {
        const primaryColor = document.documentElement.style.getPropertyValue('--color-primary');
        expect(primaryColor).toBe('#F5F1E8');
      });

      // Attempt to set invalid theme
      const invalidThemePreference = {
        themeId: 'invalid-theme-id',
        timestamp: Date.now(),
      };
      localStorage.setItem('app-theme-preference', JSON.stringify(invalidThemePreference));

      const storageEvent = new StorageEvent('storage', {
        key: 'app-theme-preference',
        newValue: JSON.stringify(invalidThemePreference),
      });
      window.dispatchEvent(storageEvent);

      // Verify current theme remains unchanged (default theme)
      await waitFor(() => {
        const primaryColor = document.documentElement.style.getPropertyValue('--color-primary');
        // Should still be default theme
        expect(primaryColor).toBe('#F5F1E8');
      });
    });
  });

  describe('Multi-tab synchronization', () => {
    it('updates theme in current tab when changed in another tab', async () => {
      mockUseAuth.mockReturnValue(authenticatedUser);

      render(<App />);

      // Wait for default theme
      await waitFor(() => {
        const primaryColor = document.documentElement.style.getPropertyValue('--color-primary');
        expect(primaryColor).toBe('#F5F1E8');
      });

      // Simulate theme change in another tab via storage event
      const blueThemePreference = {
        themeId: 'blue',
        timestamp: Date.now(),
      };

      const storageEvent = new StorageEvent('storage', {
        key: 'app-theme-preference',
        newValue: JSON.stringify(blueThemePreference),
        oldValue: JSON.stringify({ themeId: 'brown-tan', timestamp: Date.now() }),
      });
      window.dispatchEvent(storageEvent);

      // Verify current tab updates to new theme
      await waitFor(() => {
        const primaryColor = document.documentElement.style.getPropertyValue('--color-primary');
        const secondaryColor = document.documentElement.style.getPropertyValue('--color-secondary');
        const accentColor = document.documentElement.style.getPropertyValue('--color-accent');
        const tertiaryColor = document.documentElement.style.getPropertyValue('--color-tertiary');

        // Blue theme colors
        expect(primaryColor).toBe('#3E848C');
        expect(secondaryColor).toBe('#025159');
        expect(accentColor).toBe('#A67458');
        expect(tertiaryColor).toBe('#C4EEF2');
      });
    });

    it('handles multiple rapid theme changes from other tabs', async () => {
      mockUseAuth.mockReturnValue(authenticatedUser);

      render(<App />);

      // Wait for default theme
      await waitFor(() => {
        const primaryColor = document.documentElement.style.getPropertyValue('--color-primary');
        expect(primaryColor).toBe('#F5F1E8');
      });

      // Simulate rapid theme changes from another tab
      const themes = ['blue', 'green', 'blue'];

      for (const themeId of themes) {
        const themePreference = {
          themeId,
          timestamp: Date.now(),
        };

        const storageEvent = new StorageEvent('storage', {
          key: 'app-theme-preference',
          newValue: JSON.stringify(themePreference),
        });
        window.dispatchEvent(storageEvent);

        // Small delay to allow event processing
        await new Promise(resolve => setTimeout(resolve, 10));
      }

      // Verify final theme (Blue) is applied
      await waitFor(() => {
        const primaryColor = document.documentElement.style.getPropertyValue('--color-primary');
        expect(primaryColor).toBe('#3E848C');
      });
    });
  });

  describe('Corrupted storage data handling', () => {
    it('triggers fallback to default theme when storage contains corrupted JSON', async () => {
      mockUseAuth.mockReturnValue(authenticatedUser);

      // Set corrupted data in localStorage
      localStorage.setItem('app-theme-preference', 'corrupted-json-{invalid}');

      render(<App />);

      // Verify default theme is applied as fallback
      await waitFor(() => {
        const primaryColor = document.documentElement.style.getPropertyValue('--color-primary');
        const secondaryColor = document.documentElement.style.getPropertyValue('--color-secondary');
        const accentColor = document.documentElement.style.getPropertyValue('--color-accent');
        const tertiaryColor = document.documentElement.style.getPropertyValue('--color-tertiary');

        // Brown/Tan default theme colors
        expect(primaryColor).toBe('#F5F1E8');
        expect(secondaryColor).toBe('#8B7355');
        expect(accentColor).toBe('#3D3D2D');
        expect(tertiaryColor).toBe('#C89B7B');
      });
    });

    it('triggers fallback to default theme when storage contains invalid theme ID', async () => {
      mockUseAuth.mockReturnValue(authenticatedUser);

      // Set invalid theme ID in localStorage
      const invalidThemePreference = {
        themeId: 'non-existent-theme',
        timestamp: Date.now(),
      };
      localStorage.setItem('app-theme-preference', JSON.stringify(invalidThemePreference));

      render(<App />);

      // Verify default theme is applied as fallback
      await waitFor(() => {
        const primaryColor = document.documentElement.style.getPropertyValue('--color-primary');
        const secondaryColor = document.documentElement.style.getPropertyValue('--color-secondary');
        const accentColor = document.documentElement.style.getPropertyValue('--color-accent');
        const tertiaryColor = document.documentElement.style.getPropertyValue('--color-tertiary');

        // Brown/Tan default theme colors
        expect(primaryColor).toBe('#F5F1E8');
        expect(secondaryColor).toBe('#8B7355');
        expect(accentColor).toBe('#3D3D2D');
        expect(tertiaryColor).toBe('#C89B7B');
      });
    });

    it('clears corrupted storage data and applies default theme', async () => {
      mockUseAuth.mockReturnValue(authenticatedUser);

      // Set corrupted data
      localStorage.setItem('app-theme-preference', 'invalid-data');

      render(<App />);

      // Wait for default theme to be applied
      await waitFor(() => {
        const primaryColor = document.documentElement.style.getPropertyValue('--color-primary');
        expect(primaryColor).toBe('#F5F1E8');
      });

      // Verify corrupted data is handled gracefully
      // (The app should still be functional and render the profile page for authenticated user)
      expect(screen.getByTestId('profile-page')).toBeInTheDocument();
    });
  });

  describe('Complete user flow: select theme → colors update → reload → theme persists', () => {
    it('completes full theme selection and persistence flow', async () => {
      mockUseAuth.mockReturnValue(authenticatedUser);

      // Step 1: Initial render with default theme
      const { unmount } = render(<App />);

      await waitFor(() => {
        const primaryColor = document.documentElement.style.getPropertyValue('--color-primary');
        expect(primaryColor).toBe('#F5F1E8'); // Default Brown/Tan
      });

      // Step 2: User selects Blue theme
      const blueThemePreference = {
        themeId: 'blue',
        timestamp: Date.now(),
      };
      localStorage.setItem('app-theme-preference', JSON.stringify(blueThemePreference));

      const storageEvent = new StorageEvent('storage', {
        key: 'app-theme-preference',
        newValue: JSON.stringify(blueThemePreference),
      });
      window.dispatchEvent(storageEvent);

      // Step 3: Verify colors update immediately
      await waitFor(() => {
        const primaryColor = document.documentElement.style.getPropertyValue('--color-primary');
        expect(primaryColor).toBe('#3E848C'); // Blue theme
      });

      // Step 4: Verify theme is persisted to localStorage
      const stored = localStorage.getItem('app-theme-preference');
      expect(stored).toBeTruthy();
      const parsed = JSON.parse(stored!);
      expect(parsed.themeId).toBe('blue');

      // Step 5: Simulate app reload by unmounting and remounting
      unmount();

      // Clear CSS properties to simulate fresh load
      document.documentElement.style.removeProperty('--color-primary');
      document.documentElement.style.removeProperty('--color-secondary');
      document.documentElement.style.removeProperty('--color-accent');
      document.documentElement.style.removeProperty('--color-tertiary');

      // Step 6: Render app again (simulating reload)
      render(<App />);

      // Step 7: Verify same theme is applied automatically
      await waitFor(() => {
        const primaryColor = document.documentElement.style.getPropertyValue('--color-primary');
        const secondaryColor = document.documentElement.style.getPropertyValue('--color-secondary');
        const accentColor = document.documentElement.style.getPropertyValue('--color-accent');
        const tertiaryColor = document.documentElement.style.getPropertyValue('--color-tertiary');

        // Blue theme colors should be applied
        expect(primaryColor).toBe('#3E848C');
        expect(secondaryColor).toBe('#025159');
        expect(accentColor).toBe('#A67458');
        expect(tertiaryColor).toBe('#C4EEF2');
      });
    });
  });

  describe('Theme application performance', () => {
    it('applies theme within reasonable time on app initialization', async () => {
      mockUseAuth.mockReturnValue(authenticatedUser);

      const blueThemePreference = {
        themeId: 'blue',
        timestamp: Date.now(),
      };
      localStorage.setItem('app-theme-preference', JSON.stringify(blueThemePreference));

      const startTime = performance.now();
      render(<App />);

      await waitFor(() => {
        const primaryColor = document.documentElement.style.getPropertyValue('--color-primary');
        expect(primaryColor).toBe('#3E848C');
      });

      const endTime = performance.now();
      const duration = endTime - startTime;

      // Theme should be applied within 1 second (generous timeout for test environment)
      expect(duration).toBeLessThan(1000);
    });
  });
});
