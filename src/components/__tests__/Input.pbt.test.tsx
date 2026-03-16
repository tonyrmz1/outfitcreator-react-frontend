import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import fc from 'fast-check';
import { Input } from './Input';

describe('Input Component - Property-Based Tests', () => {
  afterEach(() => {
    cleanup();
  });

  /**
   * **Validates: Requirements 12.1, 12.2, 12.3**
   * 
   * Property: For any valid string value, the input should display that value
   */
  it('displays any valid string value correctly', () => {
    fc.assert(
      fc.property(
        fc.string(),
        (value) => {
          const { container } = render(
            <Input label="Test Value" value={value} onChange={() => {}} />
          );
          
          const input = container.querySelector('input');
          expect(input).toHaveValue(value);
          
          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 12.1, 12.3**
   * 
   * Property: For any error message, the input should display it and set aria-invalid to true
   */
  it('displays any error message and sets aria-invalid correctly', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
        (errorMessage) => {
          const { container } = render(
            <Input label="Test Error" value="" onChange={() => {}} error={errorMessage} />
          );
          
          const input = container.querySelector('input');
          expect(input).toHaveAttribute('aria-invalid', 'true');
          
          const errorElement = container.querySelector('[role="alert"]');
          expect(errorElement).toBeInTheDocument();
          
          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 16.7**
   * 
   * Property: For any label text, the input should be properly associated with its label
   */
  it('properly associates label with input for any label text', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
        (label) => {
          const { container } = render(
            <Input label={label} value="" onChange={() => {}} />
          );
          
          const input = container.querySelector('input');
          expect(input).toHaveAttribute('aria-label', label);
          
          const labelElement = container.querySelector('label');
          expect(labelElement).toBeInTheDocument();
          
          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 12.1, 12.2**
   * 
   * Property: onChange should be called for each character typed by the user
   */
  it('onChange is called for each character typed', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 10 }).filter(s => {
          // Filter out strings with special characters that userEvent interprets as commands
          return !/[{}[\]]/.test(s);
        }),
        async (inputText) => {
          const handleChange = vi.fn();
          const user = userEvent.setup();
          
          const { container } = render(
            <Input label="Test Change" value="" onChange={handleChange} />
          );
          
          const input = container.querySelector('input')!;
          await user.type(input, inputText);
          
          // Should be called once for each character
          expect(handleChange).toHaveBeenCalledTimes(inputText.length);
          
          cleanup();
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * **Validates: Requirements 12.2, 16.7**
   * 
   * Property: Required state should always set aria-required attribute correctly
   */
  it('sets aria-required correctly for any required state', () => {
    fc.assert(
      fc.property(
        fc.boolean(),
        (isRequired) => {
          const { container } = render(
            <Input label="Test Required" value="" onChange={() => {}} required={isRequired} />
          );
          
          const input = container.querySelector('input');
          expect(input).toHaveAttribute('aria-required', String(isRequired));
          
          if (isRequired) {
            expect(input).toBeRequired();
            expect(container.textContent).toContain('*');
          } else {
            expect(input).not.toBeRequired();
          }
          
          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 12.2, 16.7**
   * 
   * Property: Disabled state should prevent onChange from being called
   */
  it('disabled state prevents onChange for any input attempt', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.boolean(),
        fc.string({ minLength: 1, maxLength: 10 }).filter(s => {
          // Filter out strings with special characters that userEvent interprets as commands
          return !/[{}[\]]/.test(s);
        }),
        async (isDisabled, inputText) => {
          const handleChange = vi.fn();
          const user = userEvent.setup();
          
          const { container } = render(
            <Input
              label="Test Disabled"
              value=""
              onChange={handleChange}
              disabled={isDisabled}
            />
          );
          
          const input = container.querySelector('input')!;
          
          if (isDisabled) {
            expect(input).toBeDisabled();
            await user.type(input, inputText);
            expect(handleChange).not.toHaveBeenCalled();
          } else {
            expect(input).not.toBeDisabled();
            await user.type(input, inputText);
            expect(handleChange).toHaveBeenCalled();
          }
          
          cleanup();
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * **Validates: Requirements 16.7**
   * 
   * Property: For any input type, the input element should have the correct type attribute
   */
  it('sets correct type attribute for any valid input type', () => {
    const validTypes = ['text', 'email', 'password', 'number', 'tel', 'url', 'date', 'time'];
    
    fc.assert(
      fc.property(
        fc.constantFrom(...validTypes),
        (inputType) => {
          const { container } = render(
            <Input label="Test Type" type={inputType} value="" onChange={() => {}} />
          );
          
          const input = container.querySelector('input');
          expect(input).toHaveAttribute('type', inputType);
          
          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 12.1, 12.3**
   * 
   * Property: Error state should always be reflected in aria-invalid attribute
   */
  it('aria-invalid matches error state for any error value', () => {
    fc.assert(
      fc.property(
        fc.option(fc.string({ minLength: 1 })),
        (error) => {
          const { container } = render(
            <Input label="Test Aria" value="" onChange={() => {}} error={error || undefined} />
          );
          
          const input = container.querySelector('input');
          const hasError = !!error;
          
          expect(input).toHaveAttribute('aria-invalid', String(hasError));
          
          if (hasError) {
            const alertElement = container.querySelector('[role="alert"]');
            expect(alertElement).toBeInTheDocument();
            const errorId = input!.getAttribute('aria-describedby');
            expect(errorId).toBeTruthy();
          } else {
            const alertElement = container.querySelector('[role="alert"]');
            expect(alertElement).not.toBeInTheDocument();
            expect(input).not.toHaveAttribute('aria-describedby');
          }
          
          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 16.7**
   * 
   * Property: Custom id should always be used when provided, otherwise generate from label
   */
  it('uses custom id when provided, otherwise generates from label', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
        fc.option(fc.string({ minLength: 1 })),
        (label, customId) => {
          const { container } = render(
            <Input
              label={label}
              value=""
              onChange={() => {}}
              id={customId || undefined}
            />
          );
          
          const input = container.querySelector('input');
          
          if (customId) {
            expect(input).toHaveAttribute('id', customId);
          } else {
            const expectedId = `input-${label.toLowerCase().replace(/\s+/g, '-')}`;
            expect(input).toHaveAttribute('id', expectedId);
          }
          
          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 12.1, 12.2, 16.7**
   * 
   * Property: Placeholder text should always be displayed when provided
   */
  it('displays placeholder for any valid placeholder text', () => {
    fc.assert(
      fc.property(
        fc.string(),
        (placeholder) => {
          const { container } = render(
            <Input
              label="Test Placeholder"
              value=""
              onChange={() => {}}
              placeholder={placeholder}
            />
          );
          
          const input = container.querySelector('input');
          expect(input).toHaveAttribute('placeholder', placeholder);
          
          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 12.1, 12.2, 12.3**
   * 
   * Property: Combining all states (required, disabled, error) should work correctly
   */
  it('handles any combination of required, disabled, and error states', () => {
    fc.assert(
      fc.property(
        fc.boolean(),
        fc.boolean(),
        fc.option(fc.string({ minLength: 1 })),
        (isRequired, isDisabled, error) => {
          const { container } = render(
            <Input
              label="Test Combined"
              value=""
              onChange={() => {}}
              required={isRequired}
              disabled={isDisabled}
              error={error || undefined}
            />
          );
          
          const input = container.querySelector('input');
          
          // Check required state
          expect(input).toHaveAttribute('aria-required', String(isRequired));
          if (isRequired) {
            expect(input).toBeRequired();
          }
          
          // Check disabled state
          if (isDisabled) {
            expect(input).toBeDisabled();
          } else {
            expect(input).not.toBeDisabled();
          }
          
          // Check error state
          const hasError = !!error;
          expect(input).toHaveAttribute('aria-invalid', String(hasError));
          if (hasError) {
            const alertElement = container.querySelector('[role="alert"]');
            expect(alertElement).toBeInTheDocument();
          }
          
          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });
});
