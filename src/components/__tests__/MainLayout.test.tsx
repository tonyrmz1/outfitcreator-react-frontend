import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import { MainLayout } from './MainLayout';
import { AuthProvider } from '../../contexts';
import type { User } from '../../types';

// Mock the useAuth hook
vi.mock('../hooks/useAuth', () => ({
  useAuth: () => ({
    user: {
      id: 1,
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    isAuthenticated: true,
    isLoading: false,
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    updateProfile: vi.fn(),
  }),
}));

const renderMainLayout = () => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <MainLayout />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('MainLayout', () => {
  it('renders Navigation component', () => {
    renderMainLayout();
    expect(screen.getByText('OutfitCreator')).toBeInTheDocument();
  });

  it('applies responsive container styling', () => {
    const { container } = renderMainLayout();
    const main = container.querySelector('main');
    expect(main).toHaveClass('max-w-7xl', 'mx-auto', 'px-4');
  });
});
