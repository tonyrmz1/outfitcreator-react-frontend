import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import { Navigation } from '../layout/Navigation';
import type { User } from '../../types';

const mockUser: User = {
  id: 1,
  email: 'test@example.com',
  firstName: 'John',
  lastName: 'Doe',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

const renderNavigation = (user: User | null = mockUser, onLogout = vi.fn()) => {
  return render(
    <BrowserRouter>
      <Navigation user={user} onLogout={onLogout} />
    </BrowserRouter>
  );
};

describe('Navigation', () => {
  it('renders app logo and title', () => {
    renderNavigation();
    expect(screen.getByText('OutfitCreator')).toBeInTheDocument();
  });

  it('renders all navigation links', () => {
    renderNavigation();
    expect(screen.getByText('Closet')).toBeInTheDocument();
    expect(screen.getByText('Outfits')).toBeInTheDocument();
    expect(screen.getByText('Recommendations')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
  });

  it('displays user name when user is provided', () => {
    renderNavigation();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('displays logout button when user is authenticated', () => {
    renderNavigation();
    const logoutButtons = screen.getAllByText('Logout');
    expect(logoutButtons.length).toBeGreaterThan(0);
  });

  it('calls onLogout when logout button is clicked', () => {
    const onLogout = vi.fn();
    renderNavigation(mockUser, onLogout);
    
    const logoutButton = screen.getAllByText('Logout')[0];
    fireEvent.click(logoutButton);
    
    expect(onLogout).toHaveBeenCalledTimes(1);
  });

  it('toggles mobile menu when hamburger button is clicked', () => {
    renderNavigation();
    
    const menuButton = screen.getByLabelText('Toggle navigation menu');
    fireEvent.click(menuButton);
    
    // Mobile menu should show user email
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });

  it('closes mobile menu when a link is clicked', () => {
    renderNavigation();
    
    // Open mobile menu
    const menuButton = screen.getByLabelText('Toggle navigation menu');
    fireEvent.click(menuButton);
    
    // Click a navigation link
    const closetLinks = screen.getAllByText('Closet');
    fireEvent.click(closetLinks[closetLinks.length - 1]); // Click mobile menu link
    
    // Email should no longer be visible (menu closed)
    expect(screen.queryByText('test@example.com')).not.toBeInTheDocument();
  });

  it('does not render user info when user is null', () => {
    renderNavigation(null);
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    expect(screen.queryByText('Logout')).not.toBeInTheDocument();
  });
});
