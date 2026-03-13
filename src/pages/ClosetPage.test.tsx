import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ClosetPage } from './ClosetPage';
import * as useClothingItemsModule from '../hooks/useClothingItems';
import { ClothingCategory, Season } from '../types';

// Mock the hooks
vi.mock('../hooks/useClothingItems');

describe('ClosetPage', () => {
  const mockFetchItems = vi.fn();
  const mockCreateItem = vi.fn();
  const mockUpdateItem = vi.fn();
  const mockDeleteItem = vi.fn();
  const mockUploadPhoto = vi.fn();

  const mockItems = [
    {
      id: 1,
      name: 'Blue Jeans',
      brand: "Levi's",
      primaryColor: 'blue',
      category: ClothingCategory.BOTTOM,
      wearCount: 5,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
    {
      id: 2,
      name: 'Red Shirt',
      brand: 'Nike',
      primaryColor: 'red',
      category: ClothingCategory.TOP,
      wearCount: 3,
      createdAt: '2024-01-02',
      updatedAt: '2024-01-02',
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
    
    vi.spyOn(useClothingItemsModule, 'useClothingItems').mockReturnValue({
      items: mockItems,
      pagination: mockPagination,
      isLoading: false,
      error: null,
      fetchItems: mockFetchItems,
      createItem: mockCreateItem,
      updateItem: mockUpdateItem,
      deleteItem: mockDeleteItem,
      uploadPhoto: mockUploadPhoto,
    });
  });

  it('renders page title and add button', () => {
    render(<ClosetPage />);
    
    expect(screen.getByText('My Closet')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add item/i })).toBeInTheDocument();
  });

  it('fetches items on mount', () => {
    render(<ClosetPage />);
    
    expect(mockFetchItems).toHaveBeenCalledWith({}, 0);
  });

  it('displays clothing items in grid', () => {
    render(<ClosetPage />);
    
    expect(screen.getByText('Blue Jeans')).toBeInTheDocument();
    expect(screen.getByText('Red Shirt')).toBeInTheDocument();
  });

  it('displays loading spinner when loading', () => {
    vi.spyOn(useClothingItemsModule, 'useClothingItems').mockReturnValue({
      items: [],
      pagination: mockPagination,
      isLoading: true,
      error: null,
      fetchItems: mockFetchItems,
      createItem: mockCreateItem,
      updateItem: mockUpdateItem,
      deleteItem: mockDeleteItem,
      uploadPhoto: mockUploadPhoto,
    });

    render(<ClosetPage />);
    
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('displays error message when error occurs', () => {
    const errorMessage = 'Failed to fetch items';
    vi.spyOn(useClothingItemsModule, 'useClothingItems').mockReturnValue({
      items: [],
      pagination: mockPagination,
      isLoading: false,
      error: errorMessage,
      fetchItems: mockFetchItems,
      createItem: mockCreateItem,
      updateItem: mockUpdateItem,
      deleteItem: mockDeleteItem,
      uploadPhoto: mockUploadPhoto,
    });

    render(<ClosetPage />);
    
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('displays empty state when no items', () => {
    vi.spyOn(useClothingItemsModule, 'useClothingItems').mockReturnValue({
      items: [],
      pagination: { ...mockPagination, totalElements: 0 },
      isLoading: false,
      error: null,
      fetchItems: mockFetchItems,
      createItem: mockCreateItem,
      updateItem: mockUpdateItem,
      deleteItem: mockDeleteItem,
      uploadPhoto: mockUploadPhoto,
    });

    render(<ClosetPage />);
    
    expect(screen.getByText('No clothing items')).toBeInTheDocument();
    expect(screen.getByText(/get started by adding your first clothing item/i)).toBeInTheDocument();
  });

  it('opens create modal when add button is clicked', async () => {
    render(<ClosetPage />);
    
    const addButton = screen.getByRole('button', { name: /add item/i });
    fireEvent.click(addButton);
    
    await waitFor(() => {
      expect(screen.getByText('Add Clothing Item')).toBeInTheDocument();
    });
  });

  it('opens edit modal when edit button is clicked', async () => {
    render(<ClosetPage />);
    
    const editButtons = screen.getAllByRole('button', { name: /edit/i });
    fireEvent.click(editButtons[0]);
    
    await waitFor(() => {
      expect(screen.getByText('Edit Clothing Item')).toBeInTheDocument();
    });
  });

  it('deletes item with confirmation', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    
    render(<ClosetPage />);
    
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    fireEvent.click(deleteButtons[0]);
    
    await waitFor(() => {
      expect(confirmSpy).toHaveBeenCalled();
      expect(mockDeleteItem).toHaveBeenCalledWith(1);
    });
    
    confirmSpy.mockRestore();
  });

  it('does not delete item when confirmation is cancelled', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);
    
    render(<ClosetPage />);
    
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    fireEvent.click(deleteButtons[0]);
    
    await waitFor(() => {
      expect(confirmSpy).toHaveBeenCalled();
      expect(mockDeleteItem).not.toHaveBeenCalled();
    });
    
    confirmSpy.mockRestore();
  });

  it('applies filters and refetches items', async () => {
    render(<ClosetPage />);
    
    // Get the category select
    const categorySelect = screen.getByLabelText(/category/i);
    fireEvent.change(categorySelect, { target: { value: ClothingCategory.TOP } });
    
    await waitFor(() => {
      expect(mockFetchItems).toHaveBeenCalledWith(
        expect.objectContaining({ category: ClothingCategory.TOP }),
        0
      );
    });
  });

  it('handles page change', async () => {
    const multiPagePagination = {
      page: 0,
      size: 20,
      totalPages: 3,
      totalElements: 50,
    };

    vi.spyOn(useClothingItemsModule, 'useClothingItems').mockReturnValue({
      items: mockItems,
      pagination: multiPagePagination,
      isLoading: false,
      error: null,
      fetchItems: mockFetchItems,
      createItem: mockCreateItem,
      updateItem: mockUpdateItem,
      deleteItem: mockDeleteItem,
      uploadPhoto: mockUploadPhoto,
    });

    render(<ClosetPage />);
    
    const nextButton = screen.getByLabelText(/go to next page/i);
    fireEvent.click(nextButton);
    
    await waitFor(() => {
      expect(mockFetchItems).toHaveBeenCalledWith({}, 1);
    });
  });

  it('retries fetch on error retry button click', async () => {
    vi.spyOn(useClothingItemsModule, 'useClothingItems').mockReturnValue({
      items: [],
      pagination: mockPagination,
      isLoading: false,
      error: 'Failed to fetch items',
      fetchItems: mockFetchItems,
      createItem: mockCreateItem,
      updateItem: mockUpdateItem,
      deleteItem: mockDeleteItem,
      uploadPhoto: mockUploadPhoto,
    });

    render(<ClosetPage />);
    
    const retryButton = screen.getByRole('button', { name: /retry/i });
    fireEvent.click(retryButton);
    
    expect(mockFetchItems).toHaveBeenCalled();
  });

  it('displays pagination when multiple pages exist', () => {
    const multiPagePagination = {
      page: 0,
      size: 20,
      totalPages: 3,
      totalElements: 50,
    };

    vi.spyOn(useClothingItemsModule, 'useClothingItems').mockReturnValue({
      items: mockItems,
      pagination: multiPagePagination,
      isLoading: false,
      error: null,
      fetchItems: mockFetchItems,
      createItem: mockCreateItem,
      updateItem: mockUpdateItem,
      deleteItem: mockDeleteItem,
      uploadPhoto: mockUploadPhoto,
    });

    render(<ClosetPage />);
    
    // Check for pagination controls
    expect(screen.getByLabelText(/go to next page/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/go to previous page/i)).toBeInTheDocument();
  });

  it('does not display pagination when only one page', () => {
    render(<ClosetPage />);
    
    expect(screen.queryByText(/page/i)).not.toBeInTheDocument();
  });
});
