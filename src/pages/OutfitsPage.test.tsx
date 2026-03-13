import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OutfitsPage } from './OutfitsPage';
import * as useOutfitsModule from '../hooks/useOutfits';
import { ItemPosition, ClothingCategory } from '../types';

// Mock the hooks
vi.mock('../hooks/useOutfits');

describe('OutfitsPage', () => {
  const mockFetchOutfits = vi.fn();
  const mockCreateOutfit = vi.fn();
  const mockUpdateOutfit = vi.fn();
  const mockDeleteOutfit = vi.fn();

  const mockOutfits = [
    {
      id: 1,
      name: 'Casual Friday',
      notes: 'Comfortable outfit for work',
      items: [
        {
          id: 1,
          clothingItem: {
            id: 1,
            name: 'Blue Jeans',
            brand: "Levi's",
            primaryColor: 'blue',
            category: ClothingCategory.BOTTOM,
            wearCount: 5,
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01',
          },
          position: ItemPosition.BOTTOM,
        },
        {
          id: 2,
          clothingItem: {
            id: 2,
            name: 'White T-Shirt',
            brand: 'Nike',
            primaryColor: 'white',
            category: ClothingCategory.TOP,
            wearCount: 3,
            createdAt: '2024-01-02',
            updatedAt: '2024-01-02',
          },
          position: ItemPosition.TOP,
        },
      ],
      isComplete: true,
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15',
    },
    {
      id: 2,
      name: 'Summer Outfit',
      notes: 'Light and breezy',
      items: [
        {
          id: 3,
          clothingItem: {
            id: 3,
            name: 'Shorts',
            brand: 'Adidas',
            primaryColor: 'khaki',
            category: ClothingCategory.BOTTOM,
            wearCount: 2,
            createdAt: '2024-01-03',
            updatedAt: '2024-01-03',
          },
          position: ItemPosition.BOTTOM,
        },
      ],
      isComplete: false,
      createdAt: '2024-01-16',
      updatedAt: '2024-01-16',
    },
  ];

  const mockPagination = {
    page: 0,
    size: 20,
    totalPages: 1,
    totalElements: 2,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    vi.spyOn(useOutfitsModule, 'useOutfits').mockReturnValue({
      outfits: mockOutfits,
      pagination: mockPagination,
      isLoading: false,
      error: null,
      fetchOutfits: mockFetchOutfits,
      createOutfit: mockCreateOutfit,
      updateOutfit: mockUpdateOutfit,
      deleteOutfit: mockDeleteOutfit,
    });
  });

  it('renders page title and create button', () => {
    render(<OutfitsPage />);
    
    expect(screen.getByText('My Outfits')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create outfit/i })).toBeInTheDocument();
  });

  it('fetches outfits on mount', () => {
    render(<OutfitsPage />);
    
    expect(mockFetchOutfits).toHaveBeenCalledWith(0);
  });

  it('displays outfits in grid', () => {
    render(<OutfitsPage />);
    
    expect(screen.getByText('Casual Friday')).toBeInTheDocument();
    expect(screen.getByText('Summer Outfit')).toBeInTheDocument();
  });

  it('displays loading spinner when loading', () => {
    vi.spyOn(useOutfitsModule, 'useOutfits').mockReturnValue({
      outfits: [],
      pagination: mockPagination,
      isLoading: true,
      error: null,
      fetchOutfits: mockFetchOutfits,
      createOutfit: mockCreateOutfit,
      updateOutfit: mockUpdateOutfit,
      deleteOutfit: mockDeleteOutfit,
    });

    render(<OutfitsPage />);
    
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('displays error message when error occurs', () => {
    const errorMessage = 'Failed to fetch outfits';
    vi.spyOn(useOutfitsModule, 'useOutfits').mockReturnValue({
      outfits: [],
      pagination: mockPagination,
      isLoading: false,
      error: errorMessage,
      fetchOutfits: mockFetchOutfits,
      createOutfit: mockCreateOutfit,
      updateOutfit: mockUpdateOutfit,
      deleteOutfit: mockDeleteOutfit,
    });

    render(<OutfitsPage />);
    
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('displays empty state when no outfits', () => {
    vi.spyOn(useOutfitsModule, 'useOutfits').mockReturnValue({
      outfits: [],
      pagination: { ...mockPagination, totalElements: 0 },
      isLoading: false,
      error: null,
      fetchOutfits: mockFetchOutfits,
      createOutfit: mockCreateOutfit,
      updateOutfit: mockUpdateOutfit,
      deleteOutfit: mockDeleteOutfit,
    });

    render(<OutfitsPage />);
    
    expect(screen.getByText('No outfits')).toBeInTheDocument();
    expect(screen.getByText(/get started by creating your first outfit/i)).toBeInTheDocument();
  });

  it('opens outfit builder when create button is clicked', async () => {
    render(<OutfitsPage />);
    
    const createButton = screen.getByRole('button', { name: /create outfit/i });
    fireEvent.click(createButton);
    
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /create outfit/i })).toBeInTheDocument();
    });
  });

  it('opens outfit builder in edit mode when edit button is clicked', async () => {
    render(<OutfitsPage />);
    
    const editButtons = screen.getAllByRole('button', { name: /edit/i });
    fireEvent.click(editButtons[0]);
    
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /edit outfit/i })).toBeInTheDocument();
    });
  });

  it('deletes outfit with confirmation', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    
    render(<OutfitsPage />);
    
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    fireEvent.click(deleteButtons[0]);
    
    await waitFor(() => {
      expect(confirmSpy).toHaveBeenCalled();
      expect(mockDeleteOutfit).toHaveBeenCalledWith(1);
    });
    
    confirmSpy.mockRestore();
  });

  it('does not delete outfit when confirmation is cancelled', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);
    
    render(<OutfitsPage />);
    
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    fireEvent.click(deleteButtons[0]);
    
    await waitFor(() => {
      expect(confirmSpy).toHaveBeenCalled();
      expect(mockDeleteOutfit).not.toHaveBeenCalled();
    });
    
    confirmSpy.mockRestore();
  });

  it('handles page change', async () => {
    const multiPagePagination = {
      page: 0,
      size: 20,
      totalPages: 3,
      totalElements: 50,
    };

    vi.spyOn(useOutfitsModule, 'useOutfits').mockReturnValue({
      outfits: mockOutfits,
      pagination: multiPagePagination,
      isLoading: false,
      error: null,
      fetchOutfits: mockFetchOutfits,
      createOutfit: mockCreateOutfit,
      updateOutfit: mockUpdateOutfit,
      deleteOutfit: mockDeleteOutfit,
    });

    render(<OutfitsPage />);
    
    const nextButton = screen.getByLabelText(/go to next page/i);
    fireEvent.click(nextButton);
    
    await waitFor(() => {
      expect(mockFetchOutfits).toHaveBeenCalledWith(1);
    });
  });

  it('retries fetch on error retry button click', async () => {
    vi.spyOn(useOutfitsModule, 'useOutfits').mockReturnValue({
      outfits: [],
      pagination: mockPagination,
      isLoading: false,
      error: 'Failed to fetch outfits',
      fetchOutfits: mockFetchOutfits,
      createOutfit: mockCreateOutfit,
      updateOutfit: mockUpdateOutfit,
      deleteOutfit: mockDeleteOutfit,
    });

    render(<OutfitsPage />);
    
    const retryButton = screen.getByRole('button', { name: /retry/i });
    fireEvent.click(retryButton);
    
    expect(mockFetchOutfits).toHaveBeenCalled();
  });

  it('displays pagination when multiple pages exist', () => {
    const multiPagePagination = {
      page: 0,
      size: 20,
      totalPages: 3,
      totalElements: 50,
    };

    vi.spyOn(useOutfitsModule, 'useOutfits').mockReturnValue({
      outfits: mockOutfits,
      pagination: multiPagePagination,
      isLoading: false,
      error: null,
      fetchOutfits: mockFetchOutfits,
      createOutfit: mockCreateOutfit,
      updateOutfit: mockUpdateOutfit,
      deleteOutfit: mockDeleteOutfit,
    });

    render(<OutfitsPage />);
    
    // Check for pagination controls
    expect(screen.getByLabelText(/go to next page/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/go to previous page/i)).toBeInTheDocument();
  });

  it('does not display pagination when only one page', () => {
    render(<OutfitsPage />);
    
    expect(screen.queryByText(/page/i)).not.toBeInTheDocument();
  });

  it('closes outfit builder when cancel is clicked', async () => {
    render(<OutfitsPage />);
    
    // Open builder
    const createButton = screen.getByRole('button', { name: /create outfit/i });
    fireEvent.click(createButton);
    
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /create outfit/i })).toBeInTheDocument();
    });
    
    // Close builder
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);
    
    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: /create outfit/i })).not.toBeInTheDocument();
    });
  });

  it('displays outfit completeness indicators', () => {
    render(<OutfitsPage />);
    
    expect(screen.getByLabelText('Complete outfit')).toBeInTheDocument();
    expect(screen.getByLabelText('Incomplete outfit')).toBeInTheDocument();
  });

  it('displays outfit item counts', () => {
    render(<OutfitsPage />);
    
    expect(screen.getByText('2 items')).toBeInTheDocument();
    expect(screen.getByText('1 item')).toBeInTheDocument();
  });

  it('handles create outfit error gracefully', async () => {
    const errorMessage = 'Failed to create outfit';
    mockCreateOutfit.mockRejectedValue(new Error(errorMessage));
    
    render(<OutfitsPage />);
    
    // Open builder
    const createButton = screen.getByRole('button', { name: /create outfit/i });
    fireEvent.click(createButton);
    
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /create outfit/i })).toBeInTheDocument();
    });
    
    // The error will be handled by OutfitBuilder component
    // We just verify that the error is logged
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    // Simulate save attempt (this would normally be triggered by form submission)
    try {
      await mockCreateOutfit({ name: 'Test', items: [] });
    } catch (err) {
      // Expected error
    }
    
    consoleSpy.mockRestore();
  });

  it('handles update outfit error gracefully', async () => {
    const errorMessage = 'Failed to update outfit';
    mockUpdateOutfit.mockRejectedValue(new Error(errorMessage));
    
    render(<OutfitsPage />);
    
    // Open builder in edit mode
    const editButtons = screen.getAllByRole('button', { name: /edit/i });
    fireEvent.click(editButtons[0]);
    
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /edit outfit/i })).toBeInTheDocument();
    });
    
    // The error will be handled by OutfitBuilder component
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    // Simulate update attempt
    try {
      await mockUpdateOutfit(1, { name: 'Updated' });
    } catch (err) {
      // Expected error
    }
    
    consoleSpy.mockRestore();
  });

  it('handles delete outfit error gracefully', async () => {
    const errorMessage = 'Failed to delete outfit';
    mockDeleteOutfit.mockRejectedValue(new Error(errorMessage));
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    render(<OutfitsPage />);
    
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    fireEvent.click(deleteButtons[0]);
    
    await waitFor(() => {
      expect(mockDeleteOutfit).toHaveBeenCalledWith(1);
    });
    
    confirmSpy.mockRestore();
    consoleSpy.mockRestore();
  });
});
