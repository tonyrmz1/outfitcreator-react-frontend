import { render, screen } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import { ProtectedRoute } from './ProtectedRoute';
import { AuthProvider } from '../contexts';

// Mock the useAuth hook
const mockUseAuth = vi.fn();

vi.mock('../hooks/useAuth', () => ({
  useAuth: () => mockUseAuth(),
}));

const renderProtectedRoute = (isAuthenticated: boolean, isLoading: boolean) => {
  mockUseAuth.mockReturnValue({
    user: isAuthenticated ? { id: 1, email: 'test@example.com' } : null,
    isAuthenticated,
    isLoading,
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    updateProfile: vi.fn(),
  });

  return render(
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <div>Protected Content</div>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('ProtectedRoute', () => {
  it('renders children when authenticated and not loading', () => {
    renderProtectedRoute(true, false);
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('displays loading spinner when loading', () => {
    renderProtectedRoute(false, true);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('redirects to login when not authenticated and not loading', () => {
    renderProtectedRoute(false, false);
    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('does not render children when loading', () => {
    renderProtectedRoute(true, true);
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('shows loading spinner when authenticated and loading', () => {
    mockUseAuth.mockReturnValue({
      user: { id: 1, email: 'test@example.com' },
      isAuthenticated: true,
      isLoading: true,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      updateProfile: vi.fn(),
    });

    render(
      <BrowserRouter>
        <AuthProvider>
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        </AuthProvider>
      </BrowserRouter>
    );
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });
});
