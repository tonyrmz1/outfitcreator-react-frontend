import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { OutfitCard } from './OutfitCard';
import { Outfit, ClothingCategory, ItemPosition } from '../types';

describe('OutfitCard', () => {
  const mockOutfit: Outfit = {
    id: 1,
    name: 'Summer Casual',
    notes: 'Perfect for a sunny day at the beach',
    items: [
      {
        id: 1,
        clothingItem: {
          id: 1,
          name: 'Blue T-Shirt',
          brand: 'Nike',
          primaryColor: 'blue',
          category: ClothingCategory.TOP,
          photoUrl: 'https://example.com/tshirt.jpg',
          wearCount: 5,
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
        },
        position: ItemPosition.TOP,
      },
      {
        id: 2,
        clothingItem: {
          id: 2,
          name: 'Khaki Shorts',
          brand: 'Gap',
          primaryColor: 'khaki',
          category: ClothingCategory.BOTTOM,
          photoUrl: 'https://example.com/shorts.jpg',
          wearCount: 3,
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
        },
        position: ItemPosition.BOTTOM,
      },
    ],
    isComplete: true,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  };

  const incompleteOutfit: Outfit = {
    ...mockOutfit,
    id: 2,
    name: 'Incomplete Outfit',
    isComplete: false,
    items: [mockOutfit.items[0]],
  };

  describe('Rendering', () => {
    it('renders outfit name correctly', () => {
      render(<OutfitCard outfit={mockOutfit} />);
      expect(screen.getByText('Summer Casual')).toBeInTheDocument();
    });

    it('renders creation date in readable format', () => {
      render(<OutfitCard outfit={mockOutfit} />);
      expect(screen.getByText(/Created Jan 15, 2024/)).toBeInTheDocument();
    });

    it('renders notes when provided', () => {
      render(<OutfitCard outfit={mockOutfit} />);
      expect(screen.getByText(/Perfect for a sunny day at the beach/)).toBeInTheDocument();
    });

    it('does not render notes section when notes are not provided', () => {
      const outfitWithoutNotes = { ...mockOutfit, notes: undefined };
      render(<OutfitCard outfit={outfitWithoutNotes} />);
      expect(screen.queryByText(/Perfect for a sunny day/)).not.toBeInTheDocument();
    });

    it('renders item count correctly for multiple items', () => {
      render(<OutfitCard outfit={mockOutfit} />);
      expect(screen.getByText('2 items')).toBeInTheDocument();
    });

    it('renders item count correctly for single item', () => {
      render(<OutfitCard outfit={incompleteOutfit} />);
      expect(screen.getByText('1 item')).toBeInTheDocument();
    });

    it('truncates long notes to 100 characters', () => {
      const longNotes = 'A'.repeat(150);
      const outfitWithLongNotes = { ...mockOutfit, notes: longNotes };
      render(<OutfitCard outfit={outfitWithLongNotes} />);
      
      const notesElement = screen.getByText(/A+\.\.\./);
      expect(notesElement.textContent?.length).toBeLessThanOrEqual(103); // 100 chars + '...'
    });
  });

  describe('Completeness Indicator', () => {
    it('displays complete indicator for complete outfits', () => {
      render(<OutfitCard outfit={mockOutfit} />);
      expect(screen.getByText('Complete')).toBeInTheDocument();
      expect(screen.getByLabelText('Complete outfit')).toBeInTheDocument();
    });

    it('displays incomplete indicator for incomplete outfits', () => {
      render(<OutfitCard outfit={incompleteOutfit} />);
      expect(screen.getByText('Incomplete')).toBeInTheDocument();
      expect(screen.getByLabelText('Incomplete outfit')).toBeInTheDocument();
    });

    it('applies correct styling for complete outfits', () => {
      render(<OutfitCard outfit={mockOutfit} />);
      const indicator = screen.getByLabelText('Complete outfit');
      expect(indicator).toHaveClass('bg-green-100', 'text-green-800');
    });

    it('applies correct styling for incomplete outfits', () => {
      render(<OutfitCard outfit={incompleteOutfit} />);
      const indicator = screen.getByLabelText('Incomplete outfit');
      expect(indicator).toHaveClass('bg-yellow-100', 'text-yellow-800');
    });
  });

  describe('Item Photos Grid', () => {
    it('displays item photos in a grid', () => {
      render(<OutfitCard outfit={mockOutfit} />);
      const images = screen.getAllByRole('img');
      // Filter out SVG icons, only count actual item photos
      const itemPhotos = images.filter(img => 
        img.getAttribute('alt') !== '' && 
        !img.getAttribute('aria-hidden')
      );
      expect(itemPhotos.length).toBeGreaterThanOrEqual(2);
    });

    it('displays placeholder when outfit has no items', () => {
      const emptyOutfit = { ...mockOutfit, items: [] };
      render(<OutfitCard outfit={emptyOutfit} />);
      expect(screen.getByAltText('No items')).toBeInTheDocument();
    });

    it('displays up to 4 items in the grid', () => {
      const outfitWithManyItems: Outfit = {
        ...mockOutfit,
        items: [
          ...mockOutfit.items,
          {
            id: 3,
            clothingItem: {
              id: 3,
              name: 'Sneakers',
              primaryColor: 'white',
              category: ClothingCategory.FOOTWEAR,
              wearCount: 10,
              createdAt: '2024-01-01',
              updatedAt: '2024-01-01',
            },
            position: ItemPosition.FOOTWEAR,
          },
          {
            id: 4,
            clothingItem: {
              id: 4,
              name: 'Jacket',
              primaryColor: 'black',
              category: ClothingCategory.OUTERWEAR,
              wearCount: 2,
              createdAt: '2024-01-01',
              updatedAt: '2024-01-01',
            },
            position: ItemPosition.OUTERWEAR,
          },
          {
            id: 5,
            clothingItem: {
              id: 5,
              name: 'Hat',
              primaryColor: 'red',
              category: ClothingCategory.ACCESSORIES,
              wearCount: 1,
              createdAt: '2024-01-01',
              updatedAt: '2024-01-01',
            },
            position: ItemPosition.ACCESSORY,
          },
        ],
      };
      
      render(<OutfitCard outfit={outfitWithManyItems} />);
      const images = screen.getAllByRole('img');
      const itemPhotos = images.filter(img => 
        img.getAttribute('alt') !== '' && 
        !img.getAttribute('aria-hidden') &&
        img.getAttribute('alt') !== 'No items'
      );
      expect(itemPhotos.length).toBeLessThanOrEqual(4);
    });

    it('handles image load errors with fallback', () => {
      render(<OutfitCard outfit={mockOutfit} />);
      const images = screen.getAllByRole('img');
      const itemPhoto = images.find(img => img.getAttribute('alt') === 'Blue T-Shirt');
      
      if (itemPhoto) {
        fireEvent.error(itemPhoto);
        expect(itemPhoto).toHaveAttribute('src', expect.stringContaining('data:image/svg+xml'));
      }
    });
  });

  describe('Action Buttons', () => {
    it('renders edit button when onEdit is provided', () => {
      const onEdit = vi.fn();
      render(<OutfitCard outfit={mockOutfit} onEdit={onEdit} />);
      expect(screen.getByRole('button', { name: /Edit Summer Casual/i })).toBeInTheDocument();
    });

    it('renders delete button when onDelete is provided', () => {
      const onDelete = vi.fn();
      render(<OutfitCard outfit={mockOutfit} onDelete={onDelete} />);
      expect(screen.getByRole('button', { name: /Delete Summer Casual/i })).toBeInTheDocument();
    });

    it('does not render action buttons when handlers are not provided', () => {
      render(<OutfitCard outfit={mockOutfit} />);
      expect(screen.queryByRole('button', { name: /Edit/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /Delete/i })).not.toBeInTheDocument();
    });

    it('calls onEdit with outfit when edit button is clicked', () => {
      const onEdit = vi.fn();
      render(<OutfitCard outfit={mockOutfit} onEdit={onEdit} />);
      
      const editButton = screen.getByRole('button', { name: /Edit Summer Casual/i });
      fireEvent.click(editButton);
      
      expect(onEdit).toHaveBeenCalledWith(mockOutfit);
      expect(onEdit).toHaveBeenCalledTimes(1);
    });

    it('calls onDelete with outfit ID when delete button is clicked', () => {
      const onDelete = vi.fn();
      render(<OutfitCard outfit={mockOutfit} onDelete={onDelete} />);
      
      const deleteButton = screen.getByRole('button', { name: /Delete Summer Casual/i });
      fireEvent.click(deleteButton);
      
      expect(onDelete).toHaveBeenCalledWith(1);
      expect(onDelete).toHaveBeenCalledTimes(1);
    });

    it('stops event propagation when edit button is clicked', () => {
      const onEdit = vi.fn();
      const onClick = vi.fn();
      render(<OutfitCard outfit={mockOutfit} onEdit={onEdit} onClick={onClick} />);
      
      const editButton = screen.getByRole('button', { name: /Edit Summer Casual/i });
      fireEvent.click(editButton);
      
      expect(onEdit).toHaveBeenCalled();
      expect(onClick).not.toHaveBeenCalled();
    });

    it('stops event propagation when delete button is clicked', () => {
      const onDelete = vi.fn();
      const onClick = vi.fn();
      render(<OutfitCard outfit={mockOutfit} onDelete={onDelete} onClick={onClick} />);
      
      const deleteButton = screen.getByRole('button', { name: /Delete Summer Casual/i });
      fireEvent.click(deleteButton);
      
      expect(onDelete).toHaveBeenCalled();
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe('Click Interaction', () => {
    it('calls onClick when card is clicked', () => {
      const onClick = vi.fn();
      render(<OutfitCard outfit={mockOutfit} onClick={onClick} />);
      
      const card = screen.getByRole('button');
      fireEvent.click(card);
      
      expect(onClick).toHaveBeenCalledWith(mockOutfit);
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('does not make card clickable when onClick is not provided', () => {
      render(<OutfitCard outfit={mockOutfit} />);
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('applies hover styles when onClick is provided', () => {
      const onClick = vi.fn();
      const { container } = render(<OutfitCard outfit={mockOutfit} onClick={onClick} />);
      
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('cursor-pointer', 'hover:shadow-lg');
    });

    it('does not apply hover styles when onClick is not provided', () => {
      const { container } = render(<OutfitCard outfit={mockOutfit} />);
      
      const card = container.firstChild as HTMLElement;
      expect(card).not.toHaveClass('cursor-pointer');
    });
  });

  describe('Keyboard Accessibility', () => {
    it('supports Enter key for card interaction', () => {
      const onClick = vi.fn();
      render(<OutfitCard outfit={mockOutfit} onClick={onClick} />);
      
      const card = screen.getByRole('button');
      fireEvent.keyDown(card, { key: 'Enter' });
      
      expect(onClick).toHaveBeenCalledWith(mockOutfit);
    });

    it('supports Space key for card interaction', () => {
      const onClick = vi.fn();
      render(<OutfitCard outfit={mockOutfit} onClick={onClick} />);
      
      const card = screen.getByRole('button');
      fireEvent.keyDown(card, { key: ' ' });
      
      expect(onClick).toHaveBeenCalledWith(mockOutfit);
    });

    it('has proper tabIndex when clickable', () => {
      const onClick = vi.fn();
      render(<OutfitCard outfit={mockOutfit} onClick={onClick} />);
      
      const card = screen.getByRole('button');
      expect(card).toHaveAttribute('tabIndex', '0');
    });

    it('does not have tabIndex when not clickable', () => {
      const { container } = render(<OutfitCard outfit={mockOutfit} />);
      
      const card = container.firstChild as HTMLElement;
      expect(card).not.toHaveAttribute('tabIndex');
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels for action buttons', () => {
      const onEdit = vi.fn();
      const onDelete = vi.fn();
      render(<OutfitCard outfit={mockOutfit} onEdit={onEdit} onDelete={onDelete} />);
      
      expect(screen.getByLabelText('Edit Summer Casual')).toBeInTheDocument();
      expect(screen.getByLabelText('Delete Summer Casual')).toBeInTheDocument();
    });

    it('has proper ARIA label for completeness indicator', () => {
      render(<OutfitCard outfit={mockOutfit} />);
      expect(screen.getByLabelText('Complete outfit')).toBeInTheDocument();
    });

    it('provides alt text for item photos', () => {
      render(<OutfitCard outfit={mockOutfit} />);
      expect(screen.getByAltText('Blue T-Shirt')).toBeInTheDocument();
      expect(screen.getByAltText('Khaki Shorts')).toBeInTheDocument();
    });

    it('has proper role when clickable', () => {
      const onClick = vi.fn();
      render(<OutfitCard outfit={mockOutfit} onClick={onClick} />);
      
      const card = screen.getByRole('button');
      expect(card).toBeInTheDocument();
    });
  });
});
