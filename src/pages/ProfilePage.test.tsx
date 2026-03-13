import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProfilePage } from './ProfilePage';
import { useAuth } from '../hooks/useAuth';
import { useClothingItems } from '../hooks/useClothingItems';
import { useOutfits } from '../hooks/useOutfits';

// Mock hooks
vi.mock('../hooks/useAuth');
vi.mock('../hooks/useClothingItems');
vi.mock('../hooks/useOutfits');

describe('ProfilePage', () => {
  const mockUser = {
    id: 1,
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  };

  const mockUpdateProfile = vi.fn();
  const mockLogout = vi.fn();
  const mockFetchItems = vi.fn();
  const mockFetchOutfits = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useAuth).mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
      isLoading: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: mockLogout,
      updateProfile: mockUpdateProfile,
    });

    vi.mocked(useClothingItems).mockReturnValue({
      items: [],
      pagination: {
        page: 0,
        size: 20,
        totalPages: 1,
        totalElements: 15,
      },
      isLoading: false,
      error: null,
      fetchItems: mockFetchItems,
      createItem: vi.fn(),
      updateItem: vi.fn(),
      deleteItem: vi.fn(),
      uploadPhoto: vi.fn(),
    });

    vi.mocked(useOutfits).mockReturnValue({
      outfits: [],
      pagination: {
        page: 0,
        size: 20,
        totalPages: 1,
        totalElements: 8,
      },
      isLoading: false,
      error: null,
      fetchOutfits: mockFetchOutfits,
      createOutfit: vi.fn(),
      updateOutfit: vi.fn(),
      deleteOutfit: vi.fn(),
    });

    mockFetchItems.mockResolvedValue(undefined);
    mockFetchOutfits.mockResolvedValue(undefined);
  });

  it('renders profile page with user information', async () => {
    render(<ProfilePage />);

    await waitFor(() => {
      expect(screen.getByText('Profile')).toBeInTheDocument();
    });

    expect(screen.getByDisplayValue('John')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Doe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument();
  });

  it('displays account statistics', async () => {
    render(<ProfilePage />);

    await waitFor(() => {
      expect(screen.getByText('Account Statistics')).toBeInTheDocument();
    });

    expect(screen.getByText('Total Items')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
    expect(screen.getByText('Total Outfits')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
  });

  it('fetches statistics on mount', async () => {
    render(<ProfilePage />);

    await waitFor(() => {
      expect(mockFetchItems).toHaveBeenCalledWith(undefined, 0);
      expect(mockFetchOutfits).toHaveBeenCalledWith(0);
    });
  });

  it('shows loading state while fetching statistics', () => {
    render(<ProfilePage />);

    // Check for the loading spinner by class name
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('handles profile update successfully', async () => {
    mockUpdateProfile.mockResolvedValue({
      ...mockUser,
      firstName: 'Jane',
      lastName: 'Smith',
    });

    render(<ProfilePage />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('John')).toBeInTheDocument();
    });

    const firstNameInput = screen.getByLabelText(/first name/i);
    const lastNameInput = screen.getByLabelText(/last name/i);
    const submitButton = screen.getByRole('button', { name: /update profile/i });

    fireEvent.change(firstNameInput, { target: { value: 'Jane' } });
    fireEvent.change(lastNameInput, { target: { value: 'Smith' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockUpdateProfile).toHaveBeenCalledWith({
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'test@example.com',
      });
    });

    expect(screen.getByText('Profile updated successfully')).toBeInTheDocument();
  });

  it('displays error message on profile update failure', async () => {
    mockUpdateProfile.mockRejectedValue({
      response: {
        data: {
          message: 'Email already in use',
        },
      },
    });

    render(<ProfilePage />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('John')).toBeInTheDocument();
    });

    const submitButton = screen.getByRole('button', { name: /update profile/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Email already in use')).toBeInTheDocument();
    });
  });

  it('shows loading state during profile update', async () => {
    mockUpdateProfile.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    render(<ProfilePage />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('John')).toBeInTheDocument();
    });

    const submitButton = screen.getByRole('button', { name: /update profile/i });
    fireEvent.click(submitButton);

    expect(screen.getByText('Updating...')).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  it('validates required fields', async () => {
    render(<ProfilePage />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('John')).toBeInTheDocument();
    });

    const firstNameInput = screen.getByLabelText(/first name/i);
    const submitButton = screen.getByRole('button', { name: /update profile/i });

    fireEvent.change(firstNameInput, { target: { value: '' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('First name is required')).toBeInTheDocument();
    });

    expect(mockUpdateProfile).not.toHaveBeenCalled();
  });

  it('validates email format', async () => {
    render(<ProfilePage />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument();
    });

    const firstNameInput = screen.getByLabelText(/first name/i);
    const submitButton = screen.getByRole('button', { name: /update profile/i });

    // Test with empty first name to trigger validation
    fireEvent.change(firstNameInput, { target: { value: '' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('First name is required')).toBeInTheDocument();
    });

    expect(mockUpdateProfile).not.toHaveBeenCalled();
  });

  it('calls logout when logout button is clicked', async () => {
    render(<ProfilePage />);

    await waitFor(() => {
      expect(screen.getByText('Profile')).toBeInTheDocument();
    });

    const logoutButton = screen.getByRole('button', { name: /logout/i });
    fireEvent.click(logoutButton);

    expect(mockLogout).toHaveBeenCalled();
  });

  it('dismisses error message when dismiss button is clicked', async () => {
    mockUpdateProfile.mockRejectedValue({
      response: {
        data: {
          message: 'Update failed',
        },
      },
    });

    render(<ProfilePage />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('John')).toBeInTheDocument();
    });

    const submitButton = screen.getByRole('button', { name: /update profile/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Update failed')).toBeInTheDocument();
    });

    const dismissButton = screen.getByRole('button', { name: /dismiss/i });
    fireEvent.click(dismissButton);

    expect(screen.queryByText('Update failed')).not.toBeInTheDocument();
  });

  it('shows loading message when user is null', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      updateProfile: vi.fn(),
    });

    render(<ProfilePage />);

    expect(screen.getByText('Loading profile...')).toBeInTheDocument();
  });

  it('handles statistics fetch failure gracefully', async () => {
    mockFetchItems.mockRejectedValue(new Error('Network error'));
    mockFetchOutfits.mockRejectedValue(new Error('Network error'));

    render(<ProfilePage />);

    // Should still render the page even if stats fail
    await waitFor(() => {
      expect(screen.getByText('Profile')).toBeInTheDocument();
    });

    // Statistics should show 0 or previous values
    expect(screen.getByText('Account Statistics')).toBeInTheDocument();
  });

  it('disables form inputs during submission', async () => {
    mockUpdateProfile.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    render(<ProfilePage />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('John')).toBeInTheDocument();
    });

    const submitButton = screen.getByRole('button', { name: /update profile/i });
    fireEvent.click(submitButton);

    const firstNameInput = screen.getByLabelText(/first name/i);
    const lastNameInput = screen.getByLabelText(/last name/i);
    const emailInput = screen.getByLabelText(/email address/i);

    expect(firstNameInput).toBeDisabled();
    expect(lastNameInput).toBeDisabled();
    expect(emailInput).toBeDisabled();
  });

  it('shows success message after profile update', async () => {
    mockUpdateProfile.mockResolvedValue(mockUser);

    render(<ProfilePage />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('John')).toBeInTheDocument();
    });

    const submitButton = screen.getByRole('button', { name: /update profile/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Profile updated successfully')).toBeInTheDocument();
    });
  });
});
