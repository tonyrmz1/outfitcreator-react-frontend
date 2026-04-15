import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App';

const mockUseAuth = vi.fn();

vi.mock('./hooks/auth/useAuth', () => ({
  useAuth: () => mockUseAuth(),
}));

vi.mock('./hooks/auth/useAutoLogout', () => ({
  useAutoLogout: vi.fn(),
}));

// Mock page components
vi.mock('./pages/LoginPage', () => ({
  default: () => <div>Login Page</div>,
}));

vi.mock('./pages/RegisterPage', () => ({
  default: () => <div>Register Page</div>,
}));

vi.mock('./pages/ClosetPage', () => ({
  default: () => <div>Closet Page</div>,
}));

vi.mock('./pages/OutfitsPage', () => ({
  default: () => <div>Outfits Page</div>,
}));

vi.mock('./pages/RecommendationsPage', () => ({
  default: () => <div>Recommendations Page</div>,
}));

vi.mock('./pages/ProfilePage', () => ({
  default: () => <div>Profile Page</div>,
}));

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading spinner when auth is loading', () => {
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

  it('redirects to login when not authenticated', async () => {
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
      expect(screen.getByText('Login Page')).toBeInTheDocument();
    });
  });

  it('shows closet page when authenticated and navigating to root', async () => {
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
    await waitFor(() => {
      expect(screen.getByText('Closet Page')).toBeInTheDocument();
    });
  });
});
