import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as fc from 'fast-check';
import { Button, ButtonProps } from './Button';

/**
 * Property-Based Tests for Button Component
 * **Validates: Requirements 14.2**
 */

describe('Button Component - Property-Based Tests', () => {
  describe('Property: Button always renders as a valid button element', () => {
    it('should always render a button element with correct type attribute', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 100 }),
          fc.constantFrom('button', 'submit', 'reset'),
          (children, type) => {
            const { unmount } = render(
              <Button type={type as 'button' | 'submit' | 'reset'}>
                {children}
              </Button>
            );
            
            const button = screen.getByRole('button');
            expect(button).toBeInTheDocument();
            expect(button).toHaveAttribute('type', type);
            expect(button.tagName).toBe('BUTTON');
            
            unmount();
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property: Disabled or loading buttons never trigger onClick', () => {
    it('should never call onClick when disabled or loading', () => {
      fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 1, maxLength: 50 }),
          fc.boolean(),
          fc.boolean(),
          async (children, disabled, loading) => {
            // Only test when at least one of disabled or loading is true
            fc.pre(disabled || loading);
            
            const handleClick = vi.fn();
            const user = userEvent.setup();
            
            const { container, unmount } = render(
              <Button disabled={disabled} loading={loading} onClick={handleClick}>
                {children}
              </Button>
            );
            
            const button = container.querySelector('button');
            await user.click(button!);
            
            expect(handleClick).not.toHaveBeenCalled();
            expect(button).toBeDisabled();
            
            unmount();
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property: Enabled buttons always trigger onClick when clicked', () => {
    it('should always call onClick exactly once when enabled and clicked', () => {
      fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 1, maxLength: 50 }),
          fc.constantFrom('primary', 'secondary', 'danger', 'ghost'),
          fc.constantFrom('sm', 'md', 'lg'),
          async (children, variant, size) => {
            const handleClick = vi.fn();
            const user = userEvent.setup();
            
            const { container, unmount } = render(
              <Button
                variant={variant as ButtonProps['variant']}
                size={size as ButtonProps['size']}
                onClick={handleClick}
              >
                {children}
              </Button>
            );
            
            const button = container.querySelector('button');
            expect(button).not.toBeDisabled();
            
            await user.click(button!);
            
            expect(handleClick).toHaveBeenCalledTimes(1);
            
            unmount();
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property: Loading state always shows spinner and sets aria-busy', () => {
    it('should always display spinner and aria-busy when loading is true', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 50 }),
          fc.constantFrom('primary', 'secondary', 'danger', 'ghost'),
          fc.constantFrom('sm', 'md', 'lg'),
          (children, variant, size) => {
            const { unmount } = render(
              <Button
                loading
                variant={variant as ButtonProps['variant']}
                size={size as ButtonProps['size']}
              >
                {children}
              </Button>
            );
            
            const button = screen.getByRole('button');
            const spinner = button.querySelector('svg');
            
            expect(spinner).toBeInTheDocument();
            expect(spinner).toHaveClass('animate-spin');
            expect(button).toHaveAttribute('aria-busy', 'true');
            expect(button).toBeDisabled();
            
            unmount();
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property: Non-loading state never shows spinner', () => {
    it('should never display spinner when loading is false', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 50 }),
          fc.constantFrom('primary', 'secondary', 'danger', 'ghost'),
          fc.boolean(),
          (children, variant, disabled) => {
            const { unmount } = render(
              <Button
                loading={false}
                variant={variant as ButtonProps['variant']}
                disabled={disabled}
              >
                {children}
              </Button>
            );
            
            const button = screen.getByRole('button');
            const spinner = button.querySelector('svg');
            
            expect(spinner).not.toBeInTheDocument();
            
            unmount();
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property: Variant classes are always applied correctly', () => {
    it('should always apply correct variant-specific classes', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 50 }),
          fc.constantFrom('primary', 'secondary', 'danger', 'ghost'),
          (children, variant) => {
            const { unmount } = render(
              <Button variant={variant as ButtonProps['variant']}>
                {children}
              </Button>
            );
            
            const button = screen.getByRole('button');
            const variantClassMap = {
              primary: 'bg-primary-600',
              secondary: 'bg-gray-200',
              danger: 'bg-red-600',
              ghost: 'bg-transparent',
            };
            
            expect(button.className).toContain(variantClassMap[variant]);
            
            unmount();
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property: Size classes are always applied correctly', () => {
    it('should always apply correct size-specific classes', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 50 }),
          fc.constantFrom('sm', 'md', 'lg'),
          (children, size) => {
            const { unmount } = render(
              <Button size={size as ButtonProps['size']}>
                {children}
              </Button>
            );
            
            const button = screen.getByRole('button');
            const sizeClassMap = {
              sm: ['px-3', 'py-1.5'],
              md: ['px-4', 'py-2'],
              lg: ['px-6', 'py-3'],
            };
            
            sizeClassMap[size].forEach(cls => {
              expect(button.className).toContain(cls);
            });
            
            unmount();
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property: fullWidth always applies w-full class', () => {
    it('should apply w-full class when fullWidth is true', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 50 }),
          fc.constantFrom('primary', 'secondary', 'danger', 'ghost'),
          (children, variant) => {
            const { unmount } = render(
              <Button fullWidth variant={variant as ButtonProps['variant']}>
                {children}
              </Button>
            );
            
            const button = screen.getByRole('button');
            expect(button.className).toContain('w-full');
            
            unmount();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should not apply w-full class when fullWidth is false', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 50 }),
          (children) => {
            const { unmount } = render(
              <Button fullWidth={false}>
                {children}
              </Button>
            );
            
            const button = screen.getByRole('button');
            expect(button.className).not.toContain('w-full');
            
            unmount();
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property: Button always contains its children', () => {
    it('should always render children content', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
          (children) => {
            const { container, unmount } = render(<Button>{children}</Button>);
            
            const button = container.querySelector('button');
            expect(button).toBeInTheDocument();
            expect(button?.textContent).toContain(children);
            
            unmount();
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property: All prop combinations produce valid buttons', () => {
    it('should render valid button with any valid prop combination', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 50 }),
          fc.constantFrom('button', 'submit', 'reset'),
          fc.constantFrom('primary', 'secondary', 'danger', 'ghost'),
          fc.constantFrom('sm', 'md', 'lg'),
          fc.boolean(),
          fc.boolean(),
          fc.boolean(),
          (children, type, variant, size, disabled, loading, fullWidth) => {
            const { unmount } = render(
              <Button
                type={type as ButtonProps['type']}
                variant={variant as ButtonProps['variant']}
                size={size as ButtonProps['size']}
                disabled={disabled}
                loading={loading}
                fullWidth={fullWidth}
              >
                {children}
              </Button>
            );
            
            const button = screen.getByRole('button');
            
            // Button should always exist
            expect(button).toBeInTheDocument();
            
            // Type should match
            expect(button).toHaveAttribute('type', type);
            
            // Should be disabled if disabled or loading
            if (disabled || loading) {
              expect(button).toBeDisabled();
            }
            
            // Should have aria-busy if loading
            if (loading) {
              expect(button).toHaveAttribute('aria-busy', 'true');
            }
            
            // Should have w-full if fullWidth
            if (fullWidth) {
              expect(button.className).toContain('w-full');
            }
            
            unmount();
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
