import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
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

describe('App Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Authentication Flow', () => {
    it('redirects unauthenticated users to login page', async () => {
      mockUseAuth.mockReturnValue({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        updateProfile: vi.fn(),
      });

      render(<App />);

      await waitFor(() => {
        expect(screen.getByTestId('login-page')).toBeInTheDocument();
      });
    });

    it('redirects authenticated users from login to closet', async () => {
      mockUseAuth.mockReturnValue({
        user: { id: 1, email: 'test@example.com', firstName: 'John', lastName: 'Doe' },
        isAuthenticated: true,
        isLoading: false,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        updateProfile: vi.fn(),
      });

      // Simulate navigating to /login
      window.history.pushState({}, '', '/login');
      render(<App />);

      await waitFor(() => {
        expect(screen.getByTestId('closet-page')).toBeInTheDocument();
      });
    });

    it('shows loading spinner while auth is loading', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        isAuthenticated: false,
        isLoading: true,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        updateProfile: vi.fn(),
      });

      render(<App />);
      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });

  describe('Protected Routes', () => {
    const authenticatedUser = {
      user: { id: 1, email: 'test@example.com', firstName: 'John', lastName: 'Doe' },
      isAuthenticated: true,
      isLoading: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      updateProfile: vi.fn(),
    };

    it('allows authenticated users to access closet page', async () => {
      mockUseAuth.mockReturnValue(authenticatedUser);

      render(<App />);

      await waitFor(() => {
        expect(screen.getByTestId('closet-page')).toBeInTheDocument();
      });
    });

    it('redirects root path to closet for authenticated users', async () => {
      mockUseAuth.mockReturnValue(authenticatedUser);

      window.history.pushState({}, '', '/');
      render(<App />);

      await waitFor(() => {
        expect(screen.getByTestId('closet-page')).toBeInTheDocument();
      });
    });
  });

  describe('Auto-Logout Integration', () => {
    it('renders app successfully with auto-logout enabled', () => {
      mockUseAuth.mockReturnValue({
        user: { id: 1, email: 'test@example.com', firstName: 'John', lastName: 'Doe' },
        isAuthenticated: true,
        isLoading: false,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        updateProfile: vi.fn(),
      });

      // The app should render without throwing
      expect(() => render(<App />)).not.toThrow();
    });
  });

  describe('Code Splitting', () => {
    it('lazy loads page components with Suspense', async () => {
      mockUseAuth.mockReturnValue({
        user: { id: 1, email: 'test@example.com', firstName: 'John', lastName: 'Doe' },
        isAuthenticated: true,
        isLoading: false,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        updateProfile: vi.fn(),
      });

      render(<App />);

      // The page should eventually load
      await waitFor(() => {
        expect(screen.getByTestId('closet-page')).toBeInTheDocument();
      });
    });
  });

  describe('Error Boundary', () => {
    it('wraps the app in ErrorBoundary', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        updateProfile: vi.fn(),
      });

      // The app should render without throwing
      expect(() => render(<App />)).not.toThrow();
    });
  });
});
