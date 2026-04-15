import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LazyImage } from '../common/LazyImage';

describe('LazyImage', () => {
  const mockSrc = 'https://example.com/image.jpg';
  const mockAlt = 'Test image';
  const mockPlaceholder = 'data:image/svg+xml,placeholder';

  beforeEach(() => {
    // Mock IntersectionObserver
    global.IntersectionObserver = vi.fn().mockImplementation((callback) => ({
      observe: vi.fn((element) => {
        // Simulate immediate intersection for testing
        callback([{ isIntersecting: true, target: element }]);
      }),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }));
  });

  it('renders with placeholder initially', () => {
    render(<LazyImage src={mockSrc} alt={mockAlt} placeholderSrc={mockPlaceholder} />);
    
    const img = screen.getByAltText(mockAlt);
    expect(img).toBeInTheDocument();
  });

  it('loads image when intersecting', async () => {
    render(<LazyImage src={mockSrc} alt={mockAlt} />);
    
    const img = screen.getByAltText(mockAlt);
    
    await waitFor(() => {
      expect(img).toHaveAttribute('src', mockSrc);
    });
  });

  it('applies custom className', () => {
    const customClass = 'custom-image-class';
    render(<LazyImage src={mockSrc} alt={mockAlt} className={customClass} />);
    
    const img = screen.getByAltText(mockAlt);
    expect(img).toHaveClass(customClass);
  });

  it('handles image load error', async () => {
    render(<LazyImage src={mockSrc} alt={mockAlt} placeholderSrc={mockPlaceholder} />);
    
    const img = screen.getByAltText(mockAlt) as HTMLImageElement;
    
    // Trigger error event using fireEvent
    fireEvent.error(img);
    
    await waitFor(() => {
      expect(img.src).toContain('placeholder');
    });
  });

  it('transitions opacity on load', async () => {
    render(<LazyImage src={mockSrc} alt={mockAlt} />);
    
    const img = screen.getByAltText(mockAlt) as HTMLImageElement;
    
    // Initially should have opacity-0
    expect(img).toHaveClass('opacity-0');
    
    // Trigger load event using fireEvent
    fireEvent.load(img);
    
    await waitFor(() => {
      expect(img).toHaveClass('opacity-100');
    });
  });

  it('falls back to immediate load when IntersectionObserver is not supported', () => {
    // Remove IntersectionObserver
    const originalIO = global.IntersectionObserver;
    // @ts-ignore
    delete global.IntersectionObserver;
    
    render(<LazyImage src={mockSrc} alt={mockAlt} />);
    
    const img = screen.getByAltText(mockAlt);
    expect(img).toHaveAttribute('src', mockSrc);
    
    // Restore IntersectionObserver
    global.IntersectionObserver = originalIO;
  });
});
