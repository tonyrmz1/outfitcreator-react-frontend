import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LoadingSpinner } from '../common/LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders with default props', () => {
    render(<LoadingSpinner />);
    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveAttribute('aria-busy', 'true');
    expect(spinner).toHaveAttribute('aria-label', 'Loading');
  });

  it('renders small size variant', () => {
    render(<LoadingSpinner size="sm" />);
    const svg = screen.getByRole('status').querySelector('svg');
    expect(svg).toHaveClass('h-4', 'w-4');
  });

  it('renders medium size variant', () => {
    render(<LoadingSpinner size="md" />);
    const svg = screen.getByRole('status').querySelector('svg');
    expect(svg).toHaveClass('h-8', 'w-8');
  });

  it('renders large size variant', () => {
    render(<LoadingSpinner size="lg" />);
    const svg = screen.getByRole('status').querySelector('svg');
    expect(svg).toHaveClass('h-12', 'w-12');
  });

  it('renders in fullScreen mode', () => {
    render(<LoadingSpinner fullScreen />);
    const container = screen.getByRole('status');
    expect(container).toHaveClass('fixed', 'inset-0', 'z-50');
    expect(container).toHaveAttribute('aria-busy', 'true');
    expect(container).toHaveAttribute('aria-label', 'Loading');
  });

  it('renders inline mode by default', () => {
    render(<LoadingSpinner />);
    const container = screen.getByRole('status');
    expect(container).not.toHaveClass('fixed');
    expect(container).toHaveClass('flex', 'items-center', 'justify-center');
  });

  it('has proper accessibility attributes', () => {
    render(<LoadingSpinner />);
    const container = screen.getByLabelText('Loading');
    expect(container).toBeInTheDocument();
    expect(container).toHaveAttribute('role', 'status');
    expect(container).toHaveAttribute('aria-busy', 'true');
  });

  it('has proper accessibility attributes in fullScreen mode', () => {
    render(<LoadingSpinner fullScreen />);
    const container = screen.getByRole('status');
    expect(container).toHaveAttribute('aria-busy', 'true');
    expect(container).toHaveAttribute('aria-label', 'Loading');
  });

  it('applies animation classes', () => {
    render(<LoadingSpinner />);
    const svg = screen.getByRole('status').querySelector('svg');
    expect(svg).toHaveClass('animate-spin');
  });

  it('applies primary color', () => {
    render(<LoadingSpinner />);
    const svg = screen.getByRole('status').querySelector('svg');
    expect(svg).toHaveClass('text-primary-600');
  });
});
