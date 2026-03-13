import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FilterPanel } from './FilterPanel';
import { ClothingCategory, Season, ClothingItemFilters } from '../types';

describe('FilterPanel', () => {
  const mockOnFilterChange = vi.fn();
  const mockOnReset = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  it('renders all filter controls', () => {
    const filters: ClothingItemFilters = {};
    render(
      <FilterPanel
        filters={filters}
        onFilterChange={mockOnFilterChange}
        onReset={mockOnReset}
      />
    );

    expect(screen.getByLabelText(/search/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/season/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/color/i)).toBeInTheDocument();
  });

  it('displays active filter count badge when filters are active', () => {
    const filters: ClothingItemFilters = {
      category: ClothingCategory.TOP,
      season: Season.SUMMER,
    };

    render(
      <FilterPanel
        filters={filters}
        onFilterChange={mockOnFilterChange}
        onReset={mockOnReset}
      />
    );

    const badge = screen.getByLabelText(/2 active filters/i);
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent('2');
  });

  it('does not display badge when no filters are active', () => {
    const filters: ClothingItemFilters = {};

    render(
      <FilterPanel
        filters={filters}
        onFilterChange={mockOnFilterChange}
        onReset={mockOnReset}
      />
    );

    expect(screen.queryByLabelText(/active filter/i)).not.toBeInTheDocument();
  });

  it('displays reset button when filters are active', () => {
    const filters: ClothingItemFilters = {
      category: ClothingCategory.TOP,
    };

    render(
      <FilterPanel
        filters={filters}
        onFilterChange={mockOnFilterChange}
        onReset={mockOnReset}
      />
    );

    expect(screen.getByRole('button', { name: /clear all filters/i })).toBeInTheDocument();
  });

  it('does not display reset button when no filters are active', () => {
    const filters: ClothingItemFilters = {};

    render(
      <FilterPanel
        filters={filters}
        onFilterChange={mockOnFilterChange}
        onReset={mockOnReset}
      />
    );

    expect(screen.queryByRole('button', { name: /clear all filters/i })).not.toBeInTheDocument();
  });

  it('calls onFilterChange when category is selected', () => {
    const filters: ClothingItemFilters = {};

    render(
      <FilterPanel
        filters={filters}
        onFilterChange={mockOnFilterChange}
        onReset={mockOnReset}
      />
    );

    const categorySelect = screen.getByLabelText(/category/i);
    fireEvent.change(categorySelect, { target: { value: ClothingCategory.TOP } });

    expect(mockOnFilterChange).toHaveBeenCalledWith({
      category: ClothingCategory.TOP,
    });
  });

  it('calls onFilterChange when season is selected', () => {
    const filters: ClothingItemFilters = {};

    render(
      <FilterPanel
        filters={filters}
        onFilterChange={mockOnFilterChange}
        onReset={mockOnReset}
      />
    );

    const seasonSelect = screen.getByLabelText(/season/i);
    fireEvent.change(seasonSelect, { target: { value: Season.SUMMER } });

    expect(mockOnFilterChange).toHaveBeenCalledWith({
      season: Season.SUMMER,
    });
  });

  it('calls onFilterChange when color is entered', () => {
    const filters: ClothingItemFilters = {};

    render(
      <FilterPanel
        filters={filters}
        onFilterChange={mockOnFilterChange}
        onReset={mockOnReset}
      />
    );

    const colorInput = screen.getByLabelText(/color/i);
    fireEvent.change(colorInput, { target: { value: 'blue' } });

    expect(mockOnFilterChange).toHaveBeenCalledWith({
      color: 'blue',
    });
  });

  it('debounces search query input by 300ms', async () => {
    vi.useFakeTimers();
    const filters: ClothingItemFilters = {};

    render(
      <FilterPanel
        filters={filters}
        onFilterChange={mockOnFilterChange}
        onReset={mockOnReset}
      />
    );

    // Clear any initial calls from mount
    mockOnFilterChange.mockClear();

    const searchInput = screen.getByLabelText(/search/i);
    
    // Type in search input
    fireEvent.change(searchInput, { target: { value: 'jeans' } });

    // Should not call immediately
    expect(mockOnFilterChange).not.toHaveBeenCalled();

    // Fast-forward time by 300ms and run all pending timers
    await vi.advanceTimersByTimeAsync(300);

    // Should call after debounce delay
    expect(mockOnFilterChange).toHaveBeenCalledWith({
      searchQuery: 'jeans',
    });

    vi.useRealTimers();
  });

  it('calls onReset when reset button is clicked', () => {
    const filters: ClothingItemFilters = {
      category: ClothingCategory.TOP,
      season: Season.SUMMER,
    };

    render(
      <FilterPanel
        filters={filters}
        onFilterChange={mockOnFilterChange}
        onReset={mockOnReset}
      />
    );

    const resetButton = screen.getByRole('button', { name: /clear all filters/i });
    fireEvent.click(resetButton);

    expect(mockOnReset).toHaveBeenCalled();
  });

  it('calls onFilterChange with empty object when reset is clicked and onReset is not provided', () => {
    const filters: ClothingItemFilters = {
      category: ClothingCategory.TOP,
    };

    render(
      <FilterPanel
        filters={filters}
        onFilterChange={mockOnFilterChange}
      />
    );

    const resetButton = screen.getByRole('button', { name: /clear all filters/i });
    fireEvent.click(resetButton);

    expect(mockOnFilterChange).toHaveBeenCalledWith({});
  });

  it('clears search input when reset is clicked', () => {
    const filters: ClothingItemFilters = {
      searchQuery: 'jeans',
    };

    render(
      <FilterPanel
        filters={filters}
        onFilterChange={mockOnFilterChange}
        onReset={mockOnReset}
      />
    );

    const searchInput = screen.getByLabelText(/search/i) as HTMLInputElement;
    expect(searchInput.value).toBe('jeans');

    const resetButton = screen.getByRole('button', { name: /clear all filters/i });
    fireEvent.click(resetButton);

    expect(searchInput.value).toBe('');
  });

  it('removes filter when empty value is selected', () => {
    const filters: ClothingItemFilters = {
      category: ClothingCategory.TOP,
    };

    render(
      <FilterPanel
        filters={filters}
        onFilterChange={mockOnFilterChange}
        onReset={mockOnReset}
      />
    );

    const categorySelect = screen.getByLabelText(/category/i);
    fireEvent.change(categorySelect, { target: { value: '' } });

    expect(mockOnFilterChange).toHaveBeenCalledWith({
      category: undefined,
    });
  });

  it('preserves other filters when changing one filter', () => {
    const filters: ClothingItemFilters = {
      category: ClothingCategory.TOP,
      season: Season.SUMMER,
    };

    render(
      <FilterPanel
        filters={filters}
        onFilterChange={mockOnFilterChange}
        onReset={mockOnReset}
      />
    );

    const colorInput = screen.getByLabelText(/color/i);
    fireEvent.change(colorInput, { target: { value: 'blue' } });

    expect(mockOnFilterChange).toHaveBeenCalledWith({
      category: ClothingCategory.TOP,
      season: Season.SUMMER,
      color: 'blue',
    });
  });

  it('has accessible labels for all inputs', () => {
    const filters: ClothingItemFilters = {};

    render(
      <FilterPanel
        filters={filters}
        onFilterChange={mockOnFilterChange}
        onReset={mockOnReset}
      />
    );

    expect(screen.getByLabelText(/search/i)).toHaveAccessibleName();
    expect(screen.getByLabelText(/category/i)).toHaveAccessibleName();
    expect(screen.getByLabelText(/season/i)).toHaveAccessibleName();
    expect(screen.getByLabelText(/color/i)).toHaveAccessibleName();
  });

  it('displays correct count for single active filter', () => {
    const filters: ClothingItemFilters = {
      category: ClothingCategory.TOP,
    };

    render(
      <FilterPanel
        filters={filters}
        onFilterChange={mockOnFilterChange}
        onReset={mockOnReset}
      />
    );

    const badge = screen.getByLabelText(/1 active filter$/i);
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent('1');
  });

  it('displays correct count for multiple active filters', () => {
    const filters: ClothingItemFilters = {
      category: ClothingCategory.TOP,
      season: Season.SUMMER,
      color: 'blue',
      searchQuery: 'jeans',
    };

    render(
      <FilterPanel
        filters={filters}
        onFilterChange={mockOnFilterChange}
        onReset={mockOnReset}
      />
    );

    const badge = screen.getByLabelText(/4 active filters/i);
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent('4');
  });
});
