import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { OutfitBuilder } from './OutfitBuilder';
import { useClothingItems } from '../../hooks/useClothingItems';
import { ClothingCategory, ItemPosition } from '../../types';
import type { ClothingItem, Outfit } from '../../types';

// Mock the useClothingItems hook
vi.mock('../hooks/useClothingItems');

describe('OutfitBuilder', () => {
  const mockFetchItems = vi.fn();
  const mockOnSave = vi.fn();
  const mockOnClose = vi.fn();

  const mockItems: ClothingItem[] = [
    {
      id: 1,
      name: 'Blue Shirt',
      primaryColor: 'blue',
      category: ClothingCategory.TOP,
      wearCount: 0,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
    {
      id: 2,
      name: 'Black Jeans',
      primaryColor: 'black',
      category: ClothingCategory.BOTTOM,
      wearCount: 0,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
    {
      id: 3,
      name: 'White Sneakers',
      primaryColor: 'white',
      category: ClothingCategory.FOOTWEAR,
      wearCount: 0,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useClothingItems).mockReturnValue({
      items: mockItems,
      pagination: {
        page: 0,
        size: 20,
        totalPages: 1,
        totalElements: 3,
      },
      isLoading: false,
      error: null,
      fetchItems: mockFetchItems,
      createItem: vi.fn(),
      updateItem: vi.fn(),
      deleteItem: vi.fn(),
      uploadPhoto: vi.fn(),
    });
  });

  it('renders modal when isOpen is true', () => {
    render(
      <OutfitBuilder
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    expect(screen.getByText('Create Outfit')).toBeInTheDocument();
    expect(screen.getByLabelText('Outfit Name')).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    render(
      <OutfitBuilder
        isOpen={false}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    expect(screen.queryByText('Create Outfit')).not.toBeInTheDocument();
  });

  it('fetches items when modal opens', () => {
    render(
      <OutfitBuilder
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    expect(mockFetchItems).toHaveBeenCalled();
  });

  it('displays available clothing items grouped by category', () => {
    render(
      <OutfitBuilder
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    // Check that category headings appear (there will be multiple instances)
    expect(screen.getAllByText('TOP').length).toBeGreaterThan(0);
    expect(screen.getAllByText('BOTTOM').length).toBeGreaterThan(0);
    expect(screen.getAllByText('FOOTWEAR').length).toBeGreaterThan(0);
    expect(screen.getByText('Blue Shirt')).toBeInTheDocument();
    expect(screen.getByText('Black Jeans')).toBeInTheDocument();
    expect(screen.getByText('White Sneakers')).toBeInTheDocument();
  });

  it('allows selecting items', async () => {
    render(
      <OutfitBuilder
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    const shirtButton = screen.getByLabelText('Select Blue Shirt');
    fireEvent.click(shirtButton);

    await waitFor(() => {
      expect(shirtButton).toHaveAttribute('aria-pressed', 'true');
    });
  });

  it('replaces item when selecting another item for same position', async () => {
    // Add another TOP item
    const itemsWithMultipleTops = [
      ...mockItems,
      {
        id: 4,
        name: 'Red Shirt',
        primaryColor: 'red',
        category: ClothingCategory.TOP,
        wearCount: 0,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      },
    ];

    vi.mocked(useClothingItems).mockReturnValue({
      items: itemsWithMultipleTops,
      pagination: {
        page: 0,
        size: 20,
        totalPages: 1,
        totalElements: 4,
      },
      isLoading: false,
      error: null,
      fetchItems: mockFetchItems,
      createItem: vi.fn(),
      updateItem: vi.fn(),
      deleteItem: vi.fn(),
      uploadPhoto: vi.fn(),
    });

    render(
      <OutfitBuilder
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    // Select first shirt
    const blueShirtButton = screen.getByLabelText('Select Blue Shirt');
    fireEvent.click(blueShirtButton);

    await waitFor(() => {
      expect(blueShirtButton).toHaveAttribute('aria-pressed', 'true');
    });

    // Select second shirt (should replace first)
    const redShirtButton = screen.getByLabelText('Select Red Shirt');
    fireEvent.click(redShirtButton);

    await waitFor(() => {
      expect(redShirtButton).toHaveAttribute('aria-pressed', 'true');
      expect(blueShirtButton).toHaveAttribute('aria-pressed', 'false');
    });
  });

  it('validates outfit before saving - requires name', async () => {
    render(
      <OutfitBuilder
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    // Try to save without name
    const saveButton = screen.getByText('Save Outfit');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText(/outfit name is required/i)).toBeInTheDocument();
    });

    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it('validates outfit before saving - requires at least one item', async () => {
    render(
      <OutfitBuilder
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    // Enter name but don't select items
    const nameInput = screen.getByLabelText('Outfit Name');
    fireEvent.change(nameInput, { target: { value: 'Test Outfit' } });

    const saveButton = screen.getByText('Save Outfit');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText(/at least one clothing item is required/i)).toBeInTheDocument();
    });

    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it('saves outfit with valid data', async () => {
    mockOnSave.mockResolvedValue(undefined);

    render(
      <OutfitBuilder
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    // Enter outfit name
    const nameInput = screen.getByLabelText('Outfit Name');
    fireEvent.change(nameInput, { target: { value: 'Casual Friday' } });

    // Select items
    const shirtButton = screen.getByLabelText('Select Blue Shirt');
    fireEvent.click(shirtButton);

    const jeansButton = screen.getByLabelText('Select Black Jeans');
    fireEvent.click(jeansButton);

    // Save outfit
    const saveButton = screen.getByText('Save Outfit');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith({
        name: 'Casual Friday',
        notes: undefined,
        items: expect.arrayContaining([
          { clothingItemId: 1, position: ItemPosition.TOP },
          { clothingItemId: 2, position: ItemPosition.BOTTOM },
        ]),
      });
    });

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('calls onClose when cancel button is clicked', () => {
    render(
      <OutfitBuilder
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('pre-fills form when editing outfit', () => {
    const editingOutfit: Outfit = {
      id: 1,
      name: 'Existing Outfit',
      notes: 'Some notes',
      items: [
        {
          id: 1,
          clothingItem: mockItems[0],
          position: ItemPosition.TOP,
        },
      ],
      isComplete: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    };

    render(
      <OutfitBuilder
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        editingOutfit={editingOutfit}
      />
    );

    expect(screen.getByText('Edit Outfit')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Existing Outfit')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Some notes')).toBeInTheDocument();
  });

  it('shows loading state when items are loading', () => {
    vi.mocked(useClothingItems).mockReturnValue({
      items: [],
      pagination: {
        page: 0,
        size: 20,
        totalPages: 0,
        totalElements: 0,
      },
      isLoading: true,
      error: null,
      fetchItems: mockFetchItems,
      createItem: vi.fn(),
      updateItem: vi.fn(),
      deleteItem: vi.fn(),
      uploadPhoto: vi.fn(),
    });

    render(
      <OutfitBuilder
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    // Check for loading spinner
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('shows message when no items are available', () => {
    vi.mocked(useClothingItems).mockReturnValue({
      items: [],
      pagination: {
        page: 0,
        size: 20,
        totalPages: 0,
        totalElements: 0,
      },
      isLoading: false,
      error: null,
      fetchItems: mockFetchItems,
      createItem: vi.fn(),
      updateItem: vi.fn(),
      deleteItem: vi.fn(),
      uploadPhoto: vi.fn(),
    });

    render(
      <OutfitBuilder
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    expect(screen.getByText(/no clothing items available/i)).toBeInTheDocument();
  });

  it('allows removing selected items', async () => {
    render(
      <OutfitBuilder
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    // Select an item
    const shirtButton = screen.getByLabelText('Select Blue Shirt');
    fireEvent.click(shirtButton);

    await waitFor(() => {
      expect(shirtButton).toHaveAttribute('aria-pressed', 'true');
    });

    // Remove the item
    const removeButton = screen.getByLabelText('Remove Blue Shirt from TOP');
    fireEvent.click(removeButton);

    await waitFor(() => {
      expect(shirtButton).toHaveAttribute('aria-pressed', 'false');
    });
  });
});
