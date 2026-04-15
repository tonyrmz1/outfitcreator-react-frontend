import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { RecommendationCard } from '../features/Recommendations/RecommendationCard';
import { OutfitRecommendation, ClothingCategory } from '../../types';

describe('RecommendationCard', () => {
  const mockRecommendation: OutfitRecommendation = {
    items: [
      {
        id: 1,
        name: 'Blue Jeans',
        brand: "Levi's",
        primaryColor: 'blue',
        category: ClothingCategory.BOTTOM,
        photoUrl: 'https://example.com/jeans.jpg',
        wearCount: 5,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      },
      {
        id: 2,
        name: 'White T-Shirt',
        primaryColor: 'white',
        category: ClothingCategory.TOP,
        photoUrl: 'https://example.com/tshirt.jpg',
        wearCount: 10,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      },
    ],
    colorCompatibilityScore: 88,
    fitCompatibilityScore: 75,
    overallScore: 82,
    seasonalAppropriateness: 'APPROPRIATE',
    itemPositions: {
      '1': 'BOTTOM',
      '2': 'TOP',
    },
    explanation: 'This outfit combines classic blue jeans with a versatile white t-shirt for a timeless casual look.',
  };

  describe('rendering', () => {
    it('renders recommendation with all items', () => {
      render(<RecommendationCard recommendation={mockRecommendation} onSave={vi.fn()} />);

      expect(screen.getByText('Blue Jeans')).toBeInTheDocument();
      expect(screen.getByText("(Levi's)")).toBeInTheDocument();
      expect(screen.getByText('White T-Shirt')).toBeInTheDocument();
    });

    it('displays overall score with correct formatting', () => {
      render(<RecommendationCard recommendation={mockRecommendation} onSave={vi.fn()} />);

      expect(screen.getByText(/82% - Good/)).toBeInTheDocument();
    });

    it('displays color compatibility score', () => {
      render(<RecommendationCard recommendation={mockRecommendation} onSave={vi.fn()} />);

      expect(screen.getByText('Color Compatibility')).toBeInTheDocument();
      expect(screen.getByText('88%')).toBeInTheDocument();
    });

    it('displays fit compatibility score', () => {
      render(<RecommendationCard recommendation={mockRecommendation} onSave={vi.fn()} />);

      expect(screen.getByText('Fit Compatibility')).toBeInTheDocument();
      expect(screen.getByText('75%')).toBeInTheDocument();
    });

    it('displays explanation text', () => {
      render(<RecommendationCard recommendation={mockRecommendation} onSave={vi.fn()} />);

      expect(
        screen.getByText(/This outfit combines classic blue jeans/)
      ).toBeInTheDocument();
    });

    it('renders Save as Outfit button', () => {
      render(<RecommendationCard recommendation={mockRecommendation} onSave={vi.fn()} />);

      expect(screen.getByRole('button', { name: /save this recommendation as an outfit/i })).toBeInTheDocument();
    });
  });

  describe('score color coding', () => {
    it('displays green indicator for excellent score (≥85)', () => {
      const excellentRecommendation = {
        ...mockRecommendation,
        colorCompatibilityScore: 90,
      };

      render(
        <RecommendationCard recommendation={excellentRecommendation} onSave={vi.fn()} />
      );

      const colorScoreBadge = screen.getByText('90%').closest('span');
      expect(colorScoreBadge).toHaveClass('bg-green-100', 'text-green-800');
    });

    it('displays yellow indicator for good score (≥70)', () => {
      const goodRecommendation = {
        ...mockRecommendation,
        fitCompatibilityScore: 75,
      };

      render(<RecommendationCard recommendation={goodRecommendation} onSave={vi.fn()} />);

      const fitScoreBadge = screen.getByText('75%').closest('span');
      expect(fitScoreBadge).toHaveClass('bg-yellow-100', 'text-yellow-800');
    });

    it('displays orange indicator for fair score (≥50)', () => {
      const fairRecommendation = {
        ...mockRecommendation,
        colorCompatibilityScore: 60,
      };

      render(<RecommendationCard recommendation={fairRecommendation} onSave={vi.fn()} />);

      const colorScoreBadge = screen.getByText('60%').closest('span');
      expect(colorScoreBadge).toHaveClass('bg-orange-100', 'text-orange-800');
    });

    it('displays red indicator for poor score (<50)', () => {
      const poorRecommendation = {
        ...mockRecommendation,
        fitCompatibilityScore: 40,
      };

      render(<RecommendationCard recommendation={poorRecommendation} onSave={vi.fn()} />);

      const fitScoreBadge = screen.getByText('40%').closest('span');
      expect(fitScoreBadge).toHaveClass('bg-red-100', 'text-red-800');
    });
  });

  describe('seasonal warning', () => {
    it('displays warning indicator when seasonalAppropriateness is WARNING', () => {
      const warningRecommendation = {
        ...mockRecommendation,
        seasonalAppropriateness: 'WARNING' as const,
      };

      render(<RecommendationCard recommendation={warningRecommendation} onSave={vi.fn()} />);

      expect(screen.getByText('Seasonal Warning')).toBeInTheDocument();
    });

    it('displays warning indicator when seasonalAppropriateness is NOT_APPROPRIATE', () => {
      const inappropriateRecommendation = {
        ...mockRecommendation,
        seasonalAppropriateness: 'NOT_APPROPRIATE' as const,
      };

      render(
        <RecommendationCard recommendation={inappropriateRecommendation} onSave={vi.fn()} />
      );

      expect(screen.getByText('Seasonal Warning')).toBeInTheDocument();
    });

    it('does not display warning when seasonalAppropriateness is APPROPRIATE', () => {
      render(<RecommendationCard recommendation={mockRecommendation} onSave={vi.fn()} />);

      expect(screen.queryByText('Seasonal Warning')).not.toBeInTheDocument();
    });
  });

  describe('save functionality', () => {
    it('calls onSave when Save as Outfit button is clicked', async () => {
      const onSave = vi.fn().mockResolvedValue(undefined);

      render(<RecommendationCard recommendation={mockRecommendation} onSave={onSave} />);

      const saveButton = screen.getByRole('button', { name: /save this recommendation as an outfit/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(onSave).toHaveBeenCalledWith(mockRecommendation);
      });
    });

    it('disables button and shows loading state while saving', async () => {
      const onSave = vi.fn().mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );

      render(<RecommendationCard recommendation={mockRecommendation} onSave={onSave} />);

      const saveButton = screen.getByRole('button', { name: /save this recommendation as an outfit/i });
      fireEvent.click(saveButton);

      expect(saveButton).toBeDisabled();
      expect(screen.getByText('Saving...')).toBeInTheDocument();

      await waitFor(() => {
        expect(saveButton).not.toBeDisabled();
      });
    });

    it('re-enables button after save completes', async () => {
      const onSave = vi.fn().mockResolvedValue(undefined);

      render(<RecommendationCard recommendation={mockRecommendation} onSave={onSave} />);

      const saveButton = screen.getByRole('button', { name: /save this recommendation as an outfit/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(saveButton).not.toBeDisabled();
        expect(screen.getByText('Save as Outfit')).toBeInTheDocument();
      });
    });

    it('re-enables button even if save fails', async () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
      const onSave = vi.fn().mockRejectedValue(new Error('Save failed'));

      render(<RecommendationCard recommendation={mockRecommendation} onSave={onSave} />);

      const saveButton = screen.getByRole('button', { name: /save this recommendation as an outfit/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(saveButton).not.toBeDisabled();
      });

      consoleError.mockRestore();
    });
  });

  describe('photo display', () => {
    it('displays item photos in grid layout', () => {
      render(<RecommendationCard recommendation={mockRecommendation} onSave={vi.fn()} />);

      const images = screen.getAllByRole('img');
      expect(images.length).toBeGreaterThanOrEqual(2);
      expect(images[0]).toHaveAttribute('src', 'https://example.com/jeans.jpg');
      expect(images[1]).toHaveAttribute('src', 'https://example.com/tshirt.jpg');
    });

    it('displays placeholder when item has no photo', () => {
      const noPhotoRecommendation = {
        ...mockRecommendation,
        items: [
          {
            ...mockRecommendation.items[0],
            photoUrl: undefined,
          },
        ],
      };

      render(<RecommendationCard recommendation={noPhotoRecommendation} onSave={vi.fn()} />);

      const image = screen.getAllByRole('img')[0];
      expect(image).toHaveAttribute('src', expect.stringContaining('data:image/svg+xml'));
    });

    it('handles image load errors by showing placeholder', () => {
      render(<RecommendationCard recommendation={mockRecommendation} onSave={vi.fn()} />);

      const images = screen.getAllByRole('img');
      const firstImage = images[0] as HTMLImageElement;

      // Simulate image load error
      fireEvent.error(firstImage);

      expect(firstImage.src).toContain('data:image/svg+xml');
    });
  });

  describe('accessibility', () => {
    it('has proper ARIA labels for scores', () => {
      render(<RecommendationCard recommendation={mockRecommendation} onSave={vi.fn()} />);

      expect(screen.getByLabelText(/overall score: 82% - Good/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/color compatibility: 88%/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/fit compatibility: 75%/i)).toBeInTheDocument();
    });

    it('has proper ARIA label for seasonal warning', () => {
      const warningRecommendation = {
        ...mockRecommendation,
        seasonalAppropriateness: 'WARNING' as const,
      };

      render(<RecommendationCard recommendation={warningRecommendation} onSave={vi.fn()} />);

      expect(screen.getByLabelText('Seasonal appropriateness warning')).toBeInTheDocument();
    });

    it('has proper ARIA label for save button', () => {
      render(<RecommendationCard recommendation={mockRecommendation} onSave={vi.fn()} />);

      expect(
        screen.getByRole('button', { name: /save this recommendation as an outfit/i })
      ).toBeInTheDocument();
    });

    it('uses progressbar role for score bars', () => {
      render(<RecommendationCard recommendation={mockRecommendation} onSave={vi.fn()} />);

      const progressBars = screen.getAllByRole('progressbar');
      expect(progressBars).toHaveLength(2); // Color and fit compatibility bars

      expect(progressBars[0]).toHaveAttribute('aria-valuenow', '88');
      expect(progressBars[0]).toHaveAttribute('aria-valuemin', '0');
      expect(progressBars[0]).toHaveAttribute('aria-valuemax', '100');

      expect(progressBars[1]).toHaveAttribute('aria-valuenow', '75');
    });

    it('has alt text for all images', () => {
      render(<RecommendationCard recommendation={mockRecommendation} onSave={vi.fn()} />);

      const images = screen.getAllByRole('img');
      images.forEach((img) => {
        expect(img).toHaveAttribute('alt');
      });
    });
  });

  describe('item list display', () => {
    it('displays all items in the recommendation', () => {
      render(<RecommendationCard recommendation={mockRecommendation} onSave={vi.fn()} />);

      expect(screen.getByText('Items in this outfit:')).toBeInTheDocument();
      expect(screen.getByText('Blue Jeans')).toBeInTheDocument();
      expect(screen.getByText('White T-Shirt')).toBeInTheDocument();
    });

    it('displays item brand when available', () => {
      render(<RecommendationCard recommendation={mockRecommendation} onSave={vi.fn()} />);

      expect(screen.getByText("(Levi's)")).toBeInTheDocument();
    });

    it('does not display brand when not available', () => {
      render(<RecommendationCard recommendation={mockRecommendation} onSave={vi.fn()} />);

      // White T-Shirt doesn't have a brand, so it should not have parentheses
      const whiteTshirtListItem = screen.getByText('White T-Shirt').closest('li');
      expect(whiteTshirtListItem?.textContent).not.toContain('(');
    });
  });

  describe('responsive layout', () => {
    it('adjusts grid layout based on number of items', () => {
      const singleItemRecommendation = {
        ...mockRecommendation,
        items: [mockRecommendation.items[0]],
      };

      const { container } = render(
        <RecommendationCard recommendation={singleItemRecommendation} onSave={vi.fn()} />
      );

      const grid = container.querySelector('.grid') as HTMLElement;
      expect(grid.style.gridTemplateColumns).toBe('1fr');
    });

    it('uses 2-column grid for 2 items', () => {
      const { container } = render(
        <RecommendationCard recommendation={mockRecommendation} onSave={vi.fn()} />
      );

      const grid = container.querySelector('.grid') as HTMLElement;
      expect(grid.style.gridTemplateColumns).toBe('repeat(2, 1fr)');
    });

    it('uses 3-column grid for 3 items', () => {
      const threeItemRecommendation = {
        ...mockRecommendation,
        items: [
          ...mockRecommendation.items,
          {
            id: 3,
            name: 'Sneakers',
            primaryColor: 'white',
            category: ClothingCategory.FOOTWEAR,
            wearCount: 3,
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01',
          },
        ],
      };

      const { container } = render(
        <RecommendationCard recommendation={threeItemRecommendation} onSave={vi.fn()} />
      );

      const grid = container.querySelector('.grid') as HTMLElement;
      expect(grid.style.gridTemplateColumns).toBe('repeat(3, 1fr)');
    });

    it('uses 2x2 grid for 4 or more items', () => {
      const fourItemRecommendation = {
        ...mockRecommendation,
        items: [
          ...mockRecommendation.items,
          {
            id: 3,
            name: 'Sneakers',
            primaryColor: 'white',
            category: ClothingCategory.FOOTWEAR,
            wearCount: 3,
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01',
          },
          {
            id: 4,
            name: 'Jacket',
            primaryColor: 'black',
            category: ClothingCategory.OUTERWEAR,
            wearCount: 2,
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01',
          },
        ],
      };

      const { container } = render(
        <RecommendationCard recommendation={fourItemRecommendation} onSave={vi.fn()} />
      );

      const grid = container.querySelector('.grid') as HTMLElement;
      expect(grid.style.gridTemplateColumns).toBe('repeat(2, 1fr)');
      expect(grid.style.gridTemplateRows).toBe('repeat(2, 1fr)');
    });
  });
});
