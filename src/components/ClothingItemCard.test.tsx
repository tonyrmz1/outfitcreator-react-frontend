import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ClothingItemCard } from './ClothingItemCard';
import { ClothingItem, ClothingCategory } from '../types';

describe('ClothingItemCard', () => {
  const mockItem: ClothingItem = {
    id: 1,
    name: 'Blue Jeans',
    brand: "Levi's",
    primaryColor: '#0000FF',
    secondaryColor: '#FFFFFF',
    category: ClothingCategory.BOTTOM,
    wearCount: 5,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  };

  describe('Rendering', () => {
    it('renders item name correctly', () => {
      render(<ClothingItemCard item={mockItem} />);
      expect(screen.getByText('Blue Jeans')).toBeInTheDocument();
    });

    it('renders item brand when provided', () => {
      render(<ClothingItemCard item={mockItem} />);
      expect(screen.getByText("Levi's")).toBeInTheDocument();
    });

    it('does not render brand when not provided', () => {
      const itemWithoutBrand = { ...mockItem, brand: undefined };
      render(<ClothingItemCard item={itemWithoutBrand} />);
      expect(screen.queryByText("Levi's")).not.toBeInTheDocument();
    });

    it('renders category', () => {
      render(<ClothingItemCard item={mockItem} />);
      expect(screen.getByText('BOTTOM')).toBeInTheDocument();
    });

    it('renders primary color indicator', () => {
      render(<ClothingItemCard item={mockItem} />);
      const colorIndicators = screen.getAllByLabelText(/Primary color/i);
      expect(colorIndicators).toHaveLength(1);
    });

    it('renders secondary color indicator when provided', () => {
      render(<ClothingItemCard item={mockItem} />);
      const secondaryColor = screen.getByLabelText(/Secondary color/i);
      expect(secondaryColor).toBeInTheDocument();
    });

    it('does not render secondary color indicator when not provided', () => {
      const itemWithoutSecondary = { ...mockItem, secondaryColor: undefined };
      render(<ClothingItemCard item={itemWithoutSecondary} />);
      expect(screen.queryByLabelText(/Secondary color/i)).not.toBeInTheDocument();
    });

    it('displays photo when photoUrl is provided', () => {
      const itemWithPhoto = { ...mockItem, photoUrl: 'https://example.com/photo.jpg' };
      render(<ClothingItemCard item={itemWithPhoto} />);
      const img = screen.getByAltText('Blue Jeans') as HTMLImageElement;
      expect(img.src).toBe('https://example.com/photo.jpg');
    });

    it('displays placeholder when photoUrl is not provided', () => {
      render(<ClothingItemCard item={mockItem} />);
      const img = screen.getByAltText('Blue Jeans') as HTMLImageElement;
      expect(img.src).toContain('data:image/svg+xml');
    });
  });

  describe('Action Buttons', () => {
    it('renders edit button when onEdit is provided', () => {
      const onEdit = vi.fn();
      render(<ClothingItemCard item={mockItem} onEdit={onEdit} />);
      expect(screen.getByRole('button', { name: /Edit/i })).toBeInTheDocument();
    });

    it('renders delete button when onDelete is provided', () => {
      const onDelete = vi.fn();
      render(<ClothingItemCard item={mockItem} onDelete={onDelete} />);
      expect(screen.getByRole('button', { name: /Delete/i })).toBeInTheDocument();
    });

    it('does not render action buttons when handlers are not provided', () => {
      render(<ClothingItemCard item={mockItem} />);
      expect(screen.queryByRole('button', { name: /Edit/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /Delete/i })).not.toBeInTheDocument();
    });

    it('calls onEdit with item when edit button is clicked', () => {
      const onEdit = vi.fn();
      render(<ClothingItemCard item={mockItem} onEdit={onEdit} />);
      
      const editButton = screen.getByRole('button', { name: /Edit/i });
      fireEvent.click(editButton);
      
      expect(onEdit).toHaveBeenCalledWith(mockItem);
      expect(onEdit).toHaveBeenCalledTimes(1);
    });

    it('calls onDelete with item id when delete button is clicked', () => {
      const onDelete = vi.fn();
      render(<ClothingItemCard item={mockItem} onDelete={onDelete} />);
      
      const deleteButton = screen.getByRole('button', { name: /Delete/i });
      fireEvent.click(deleteButton);
      
      expect(onDelete).toHaveBeenCalledWith(1);
      expect(onDelete).toHaveBeenCalledTimes(1);
    });
  });

  describe('Selectable Mode', () => {
    it('does not have button role when not selectable', () => {
      render(<ClothingItemCard item={mockItem} />);
      const card = screen.getByText('Blue Jeans').closest('div')?.parentElement;
      expect(card).not.toHaveAttribute('role', 'button');
    });

    it('has button role when selectable', () => {
      const onClick = vi.fn();
      render(<ClothingItemCard item={mockItem} selectable onClick={onClick} />);
      const card = screen.getByRole('button', { pressed: false });
      expect(card).toBeInTheDocument();
    });

    it('calls onClick with item when card is clicked in selectable mode', () => {
      const onClick = vi.fn();
      render(<ClothingItemCard item={mockItem} selectable onClick={onClick} />);
      
      const card = screen.getByRole('button', { pressed: false });
      fireEvent.click(card);
      
      expect(onClick).toHaveBeenCalledWith(mockItem);
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when card is clicked in non-selectable mode', () => {
      const onClick = vi.fn();
      render(<ClothingItemCard item={mockItem} onClick={onClick} />);
      
      const card = screen.getByText('Blue Jeans').closest('div')?.parentElement;
      if (card) {
        fireEvent.click(card);
      }
      
      expect(onClick).not.toHaveBeenCalled();
    });

    it('shows selected state visually when selected', () => {
      const onClick = vi.fn();
      render(<ClothingItemCard item={mockItem} selectable selected onClick={onClick} />);
      
      const card = screen.getByRole('button', { pressed: true });
      expect(card).toHaveClass('ring-4', 'ring-primary-500');
    });

    it('displays checkmark icon when selected', () => {
      const onClick = vi.fn();
      render(<ClothingItemCard item={mockItem} selectable selected onClick={onClick} />);
      
      const checkmark = screen.getByRole('button', { pressed: true }).querySelector('svg');
      expect(checkmark).toBeInTheDocument();
    });

    it('does not display checkmark icon when not selected', () => {
      const onClick = vi.fn();
      render(<ClothingItemCard item={mockItem} selectable onClick={onClick} />);
      
      const card = screen.getByRole('button', { pressed: false });
      const checkmark = card.querySelector('svg');
      expect(checkmark).not.toBeInTheDocument();
    });

    it('handles keyboard Enter key in selectable mode', () => {
      const onClick = vi.fn();
      render(<ClothingItemCard item={mockItem} selectable onClick={onClick} />);
      
      const card = screen.getByRole('button', { pressed: false });
      fireEvent.keyDown(card, { key: 'Enter' });
      
      expect(onClick).toHaveBeenCalledWith(mockItem);
    });

    it('handles keyboard Space key in selectable mode', () => {
      const onClick = vi.fn();
      render(<ClothingItemCard item={mockItem} selectable onClick={onClick} />);
      
      const card = screen.getByRole('button', { pressed: false });
      fireEvent.keyDown(card, { key: ' ' });
      
      expect(onClick).toHaveBeenCalledWith(mockItem);
    });
  });

  describe('Event Propagation', () => {
    it('stops propagation when edit button is clicked', () => {
      const onEdit = vi.fn();
      const onClick = vi.fn();
      render(
        <ClothingItemCard
          item={mockItem}
          selectable
          onClick={onClick}
          onEdit={onEdit}
        />
      );
      
      const editButton = screen.getByLabelText('Edit Blue Jeans');
      fireEvent.click(editButton);
      
      expect(onEdit).toHaveBeenCalledWith(mockItem);
      expect(onClick).not.toHaveBeenCalled();
    });

    it('stops propagation when delete button is clicked', () => {
      const onDelete = vi.fn();
      const onClick = vi.fn();
      render(
        <ClothingItemCard
          item={mockItem}
          selectable
          onClick={onClick}
          onDelete={onDelete}
        />
      );
      
      const deleteButton = screen.getByLabelText('Delete Blue Jeans');
      fireEvent.click(deleteButton);
      
      expect(onDelete).toHaveBeenCalledWith(1);
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe('Image Error Handling', () => {
    it('displays placeholder when image fails to load', () => {
      const itemWithBrokenPhoto = { ...mockItem, photoUrl: 'https://example.com/broken.jpg' };
      render(<ClothingItemCard item={itemWithBrokenPhoto} />);
      
      const img = screen.getByAltText('Blue Jeans') as HTMLImageElement;
      fireEvent.error(img);
      
      expect(img.src).toContain('data:image/svg+xml');
    });
  });

  describe('Accessibility', () => {
    it('has proper aria-label for edit button', () => {
      const onEdit = vi.fn();
      render(<ClothingItemCard item={mockItem} onEdit={onEdit} />);
      
      const editButton = screen.getByRole('button', { name: /Edit/i });
      expect(editButton).toHaveAttribute('aria-label', 'Edit Blue Jeans');
    });

    it('has proper aria-label for delete button', () => {
      const onDelete = vi.fn();
      render(<ClothingItemCard item={mockItem} onDelete={onDelete} />);
      
      const deleteButton = screen.getByRole('button', { name: /Delete/i });
      expect(deleteButton).toHaveAttribute('aria-label', 'Delete Blue Jeans');
    });

    it('has proper aria-pressed attribute in selectable mode', () => {
      const onClick = vi.fn();
      render(<ClothingItemCard item={mockItem} selectable onClick={onClick} />);
      
      const card = screen.getByRole('button', { pressed: false });
      expect(card).toHaveAttribute('aria-pressed', 'false');
    });

    it('updates aria-pressed when selected', () => {
      const onClick = vi.fn();
      render(<ClothingItemCard item={mockItem} selectable selected onClick={onClick} />);
      
      const card = screen.getByRole('button', { pressed: true });
      expect(card).toHaveAttribute('aria-pressed', 'true');
    });

    it('has proper alt text for image', () => {
      render(<ClothingItemCard item={mockItem} />);
      
      const img = screen.getByAltText('Blue Jeans');
      expect(img).toBeInTheDocument();
    });

    it('has proper title and aria-label for color indicators', () => {
      render(<ClothingItemCard item={mockItem} />);
      
      const primaryColor = screen.getByLabelText('Primary color: #0000FF');
      expect(primaryColor).toHaveAttribute('title', 'Primary color: #0000FF');
      
      const secondaryColor = screen.getByLabelText('Secondary color: #FFFFFF');
      expect(secondaryColor).toHaveAttribute('title', 'Secondary color: #FFFFFF');
    });
  });
});
