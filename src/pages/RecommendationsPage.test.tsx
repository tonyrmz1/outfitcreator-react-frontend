import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { RecommendationsPage } from './RecommendationsPage';
import { useRecommendations } from '../hooks/useRecommendations';
import { Season, type OutfitRecommendation } from '../types';

// Mock the useRecommendations hook
vi.mock('../hooks/useRecommendations');

describe('RecommendationsPage', () => {
  const mockFetchRecommendations = vi.fn();
  const mockSaveRecommendation = vi.fn();

  const mockRecommendation: OutfitRecommendation = {
    items: [
      {
        id: 1,
        name: 'Blue Shirt',
        brand: 'Brand A',
        primaryColor: 'blue',
        category: 'TOP' as any,
        wearCount: 0,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      },
      {
        id: 2,
        name: 'Black Jeans',
        brand: 'Brand B',
        primaryColor: 'black',
        category: 'BOTTOM' as any,
        wearCount: 0,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      },
    ],
    colorCompatibilityScore: 85,
    fitCompatibilityScore: 90,
    overallScore: 87.5,
    seasonalAppropriateness: 'APPROPRIATE',
    itemPositions: {
      '1': 'TOP',
      '2': 'BOTTOM',
    },
    explanation: 'This outfit has great color harmony and fit compatibility.',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default mock implementation
    vi.mocked(useRecommendations).mockReturnValue({
      recommendations: [],
      isLoading: false,
      error: null,
      fetchRecommendations: mockFetchRecommendations,
      saveRecommendation: mockSaveRecommendation,
    });
  });

  describe('Rendering', () => {
    it('renders page header and description', () => {
      render(<RecommendationsPage />);

      expect(screen.getByText('Outfit Recommendations')).toBeInTheDocument();
      expect(
        screen.getByText('Discover AI-powered outfit suggestions based on your wardrobe')
      ).toBeInTheDocument();
    });

    it('renders filter controls', () => {
      render(<RecommendationsPage />);

      expect(screen.getByLabelText('Season')).toBeInTheDocument();
      expect(screen.getByLabelText('Color Preference')).toBeInTheDocument();
      expect(screen.getByLabelText('Number of Recommendations')).toBeInTheDocument();
    });

    it('renders all season options in select', () => {
      render(<RecommendationsPage />);

      const seasonSelect = screen.getByLabelText('Season') as HTMLSelectElement;
      const options = Array.from(seasonSelect.options).map((opt) => opt.value);

      expect(options).toContain('');
      expect(options).toContain(Season.SPRING);
      expect(options).toContain(Season.SUMMER);
      expect(options).toContain(Season.AUTUMN);
      expect(options).toContain(Season.WINTER);
    });
  });

  describe('Data Fetching', () => {
    it('fetches recommendations on mount with default filters', () => {
      render(<RecommendationsPage />);

      expect(mockFetchRecommendations).toHaveBeenCalledWith({
        limit: 10,
      });
    });

    it('displays loading spinner while fetching', () => {
      vi.mocked(useRecommendations).mockReturnValue({
        recommendations: [],
        isLoading: true,
        error: null,
        fetchRecommendations: mockFetchRecommendations,
        saveRecommendation: mockSaveRecommendation,
      });

      render(<RecommendationsPage />);

      expect(screen.getByRole('status')).toBeInTheDocument();
      expect(screen.getByLabelText('Loading')).toBeInTheDocument();
    });

    it('displays recommendations when loaded', () => {
      vi.mocked(useRecommendations).mockReturnValue({
        recommendations: [mockRecommendation],
        isLoading: false,
        error: null,
        fetchRecommendations: mockFetchRecommendations,
        saveRecommendation: mockSaveRecommendation,
      });

      render(<RecommendationsPage />);

      expect(screen.getByText('Blue Shirt')).toBeInTheDocument();
      expect(screen.getByText('Black Jeans')).toBeInTheDocument();
    });

    it('displays empty state when no recommendations', () => {
      render(<RecommendationsPage />);

      expect(screen.getByText('No recommendations')).toBeInTheDocument();
      expect(
        screen.getByText('Try adjusting your filters or add more items to your closet.')
      ).toBeInTheDocument();
    });
  });

  describe('Filter Changes', () => {
    it('refetches recommendations when season filter changes', async () => {
      render(<RecommendationsPage />);

      const seasonSelect = screen.getByLabelText('Season');
      fireEvent.change(seasonSelect, { target: { value: Season.SUMMER } });

      await waitFor(() => {
        expect(mockFetchRecommendations).toHaveBeenCalledWith({
          limit: 10,
          season: Season.SUMMER,
        });
      });
    });

    it('refetches recommendations when color preference changes', async () => {
      render(<RecommendationsPage />);

      const colorInput = screen.getByLabelText('Color Preference');
      fireEvent.change(colorInput, { target: { value: 'blue' } });

      await waitFor(() => {
        expect(mockFetchRecommendations).toHaveBeenCalledWith({
          limit: 10,
          colorPreference: 'blue',
        });
      });
    });

    it('refetches recommendations when limit changes', async () => {
      render(<RecommendationsPage />);

      const limitInput = screen.getByLabelText('Number of Recommendations');
      fireEvent.change(limitInput, { target: { value: '20' } });

      await waitFor(() => {
        expect(mockFetchRecommendations).toHaveBeenCalledWith({
          limit: 20,
        });
      });
    });

    it('clears season filter when empty value selected', async () => {
      render(<RecommendationsPage />);

      const seasonSelect = screen.getByLabelText('Season');
      
      // First set a season
      fireEvent.change(seasonSelect, { target: { value: Season.SUMMER } });
      
      await waitFor(() => {
        expect(mockFetchRecommendations).toHaveBeenCalledWith({
          limit: 10,
          season: Season.SUMMER,
        });
      });

      // Then clear it
      fireEvent.change(seasonSelect, { target: { value: '' } });

      await waitFor(() => {
        expect(mockFetchRecommendations).toHaveBeenCalledWith({
          limit: 10,
        });
      });
    });

    it('clears color preference when empty value entered', async () => {
      render(<RecommendationsPage />);

      const colorInput = screen.getByLabelText('Color Preference');
      
      // First set a color
      fireEvent.change(colorInput, { target: { value: 'blue' } });
      
      await waitFor(() => {
        expect(mockFetchRecommendations).toHaveBeenCalledWith({
          limit: 10,
          colorPreference: 'blue',
        });
      });

      // Then clear it
      fireEvent.change(colorInput, { target: { value: '' } });

      await waitFor(() => {
        expect(mockFetchRecommendations).toHaveBeenCalledWith({
          limit: 10,
        });
      });
    });

    it('ignores invalid limit values', async () => {
      render(<RecommendationsPage />);

      const limitInput = screen.getByLabelText('Number of Recommendations');
      
      // Try to set invalid values
      fireEvent.change(limitInput, { target: { value: 'abc' } });
      fireEvent.change(limitInput, { target: { value: '0' } });
      fireEvent.change(limitInput, { target: { value: '-5' } });

      // Should still have the default limit
      await waitFor(() => {
        expect(mockFetchRecommendations).toHaveBeenLastCalledWith({
          limit: 10,
        });
      });
    });
  });

  describe('Save Recommendation', () => {
    beforeEach(() => {
      vi.mocked(useRecommendations).mockReturnValue({
        recommendations: [mockRecommendation],
        isLoading: false,
        error: null,
        fetchRecommendations: mockFetchRecommendations,
        saveRecommendation: mockSaveRecommendation,
      });

      // Mock window.prompt
      vi.spyOn(window, 'prompt').mockReturnValue('Summer Outfit');
    });

    it('prompts for outfit name when save button clicked', async () => {
      render(<RecommendationsPage />);

      const saveButton = screen.getByLabelText('Save this recommendation as an outfit');
      fireEvent.click(saveButton);

      expect(window.prompt).toHaveBeenCalledWith('Enter a name for this outfit:');
    });

    it('saves recommendation with provided name', async () => {
      mockSaveRecommendation.mockResolvedValue({
        id: 1,
        name: 'Summer Outfit',
        notes: mockRecommendation.explanation,
        items: [],
        isComplete: true,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      });

      render(<RecommendationsPage />);

      const saveButton = screen.getByLabelText('Save this recommendation as an outfit');
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(mockSaveRecommendation).toHaveBeenCalledWith(
          mockRecommendation,
          'Summer Outfit'
        );
      });
    });

    it('displays success message after saving', async () => {
      mockSaveRecommendation.mockResolvedValue({
        id: 1,
        name: 'Summer Outfit',
        notes: mockRecommendation.explanation,
        items: [],
        isComplete: true,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      });

      render(<RecommendationsPage />);

      const saveButton = screen.getByLabelText('Save this recommendation as an outfit');
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(screen.getByText('Outfit "Summer Outfit" saved successfully!')).toBeInTheDocument();
      });
    });

    it('does not save if user cancels prompt', async () => {
      vi.spyOn(window, 'prompt').mockReturnValue(null);

      render(<RecommendationsPage />);

      const saveButton = screen.getByLabelText('Save this recommendation as an outfit');
      fireEvent.click(saveButton);

      expect(mockSaveRecommendation).not.toHaveBeenCalled();
    });

    it('does not save if user enters empty name', async () => {
      vi.spyOn(window, 'prompt').mockReturnValue('   ');

      render(<RecommendationsPage />);

      const saveButton = screen.getByLabelText('Save this recommendation as an outfit');
      fireEvent.click(saveButton);

      expect(mockSaveRecommendation).not.toHaveBeenCalled();
    });

    it('trims whitespace from outfit name', async () => {
      vi.spyOn(window, 'prompt').mockReturnValue('  Summer Outfit  ');
      mockSaveRecommendation.mockResolvedValue({
        id: 1,
        name: 'Summer Outfit',
        notes: mockRecommendation.explanation,
        items: [],
        isComplete: true,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      });

      render(<RecommendationsPage />);

      const saveButton = screen.getByLabelText('Save this recommendation as an outfit');
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(mockSaveRecommendation).toHaveBeenCalledWith(
          mockRecommendation,
          'Summer Outfit'
        );
      });
    });

    it('dismisses success message when close button clicked', async () => {
      mockSaveRecommendation.mockResolvedValue({
        id: 1,
        name: 'Summer Outfit',
        notes: mockRecommendation.explanation,
        items: [],
        isComplete: true,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      });

      render(<RecommendationsPage />);

      const saveButton = screen.getByLabelText('Save this recommendation as an outfit');
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(screen.getByText('Outfit "Summer Outfit" saved successfully!')).toBeInTheDocument();
      });

      const dismissButton = screen.getByLabelText('Dismiss success message');
      fireEvent.click(dismissButton);

      expect(screen.queryByText('Outfit "Summer Outfit" saved successfully!')).not.toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('displays error message when fetch fails', () => {
      vi.mocked(useRecommendations).mockReturnValue({
        recommendations: [],
        isLoading: false,
        error: 'Failed to fetch recommendations',
        fetchRecommendations: mockFetchRecommendations,
        saveRecommendation: mockSaveRecommendation,
      });

      render(<RecommendationsPage />);

      expect(screen.getByText('Failed to fetch recommendations')).toBeInTheDocument();
    });

    it('provides retry button on error', () => {
      vi.mocked(useRecommendations).mockReturnValue({
        recommendations: [],
        isLoading: false,
        error: 'Failed to fetch recommendations',
        fetchRecommendations: mockFetchRecommendations,
        saveRecommendation: mockSaveRecommendation,
      });

      render(<RecommendationsPage />);

      const retryButton = screen.getByRole('button', { name: /retry/i });
      expect(retryButton).toBeInTheDocument();
    });

    it('retries fetch when retry button clicked', () => {
      vi.mocked(useRecommendations).mockReturnValue({
        recommendations: [],
        isLoading: false,
        error: 'Failed to fetch recommendations',
        fetchRecommendations: mockFetchRecommendations,
        saveRecommendation: mockSaveRecommendation,
      });

      render(<RecommendationsPage />);

      const retryButton = screen.getByRole('button', { name: /retry/i });
      fireEvent.click(retryButton);

      expect(mockFetchRecommendations).toHaveBeenCalledWith({
        limit: 10,
      });
    });

    it('handles save error gracefully', async () => {
      vi.mocked(useRecommendations).mockReturnValue({
        recommendations: [mockRecommendation],
        isLoading: false,
        error: null,
        fetchRecommendations: mockFetchRecommendations,
        saveRecommendation: mockSaveRecommendation,
      });

      vi.spyOn(window, 'prompt').mockReturnValue('Summer Outfit');
      mockSaveRecommendation.mockRejectedValue(new Error('Save failed'));
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      render(<RecommendationsPage />);

      const saveButton = screen.getByLabelText('Save this recommendation as an outfit');
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Failed to save recommendation:',
          expect.any(Error)
        );
      });

      consoleErrorSpy.mockRestore();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels for filter controls', () => {
      render(<RecommendationsPage />);

      expect(screen.getByLabelText('Season')).toBeInTheDocument();
      expect(screen.getByLabelText('Color Preference')).toBeInTheDocument();
      expect(screen.getByLabelText('Number of Recommendations')).toBeInTheDocument();
    });

    it('has proper ARIA live region for success message', async () => {
      vi.mocked(useRecommendations).mockReturnValue({
        recommendations: [mockRecommendation],
        isLoading: false,
        error: null,
        fetchRecommendations: mockFetchRecommendations,
        saveRecommendation: mockSaveRecommendation,
      });

      vi.spyOn(window, 'prompt').mockReturnValue('Summer Outfit');
      mockSaveRecommendation.mockResolvedValue({
        id: 1,
        name: 'Summer Outfit',
        notes: mockRecommendation.explanation,
        items: [],
        isComplete: true,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      });

      render(<RecommendationsPage />);

      const saveButton = screen.getByLabelText('Save this recommendation as an outfit');
      fireEvent.click(saveButton);

      await waitFor(() => {
        const successAlert = screen.getByRole('alert');
        expect(successAlert).toHaveAttribute('aria-live', 'polite');
      });
    });

    it('has proper ARIA label for loading spinner', () => {
      vi.mocked(useRecommendations).mockReturnValue({
        recommendations: [],
        isLoading: true,
        error: null,
        fetchRecommendations: mockFetchRecommendations,
        saveRecommendation: mockSaveRecommendation,
      });

      render(<RecommendationsPage />);

      expect(screen.getByLabelText('Loading')).toBeInTheDocument();
    });
  });
});
