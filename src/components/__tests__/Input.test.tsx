import { useState, type ChangeEvent } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from '../common/Input';

describe('Input Component', () => {
  describe('Basic Rendering', () => {
    it('renders with label and input field', () => {
      render(<Input label="Email" value="" onChange={() => {}} />);
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: 'Email' })).toBeInTheDocument();
    });

    it('renders with default text type', () => {
      render(<Input label="Username" value="" onChange={() => {}} />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'text');
    });

    it('renders with specified input type', () => {
      render(<Input label="Email" type="email" value="" onChange={() => {}} />);
      const input = screen.getByLabelText('Email');
      expect(input).toHaveAttribute('type', 'email');
    });

    it('renders password input type', () => {
      render(<Input label="Password" type="password" value="" onChange={() => {}} />);
      const input = screen.getByLabelText('Password');
      expect(input).toHaveAttribute('type', 'password');
    });

    it('renders with placeholder text', () => {
      render(
        <Input
          label="Email"
          value=""
          onChange={() => {}}
          placeholder="Enter your email"
        />
      );
      expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
    });

    it('displays the current value', () => {
      render(<Input label="Name" value="John Doe" onChange={() => {}} />);
      expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
    });
  });

  describe('Required State', () => {
    it('displays required indicator when required is true', () => {
      render(<Input label="Email" value="" onChange={() => {}} required />);
      const requiredIndicator = screen.getByText('*');
      expect(requiredIndicator).toBeInTheDocument();
      expect(requiredIndicator).toHaveClass('text-red-500');
    });

    it('does not display required indicator by default', () => {
      render(<Input label="Email" value="" onChange={() => {}} />);
      expect(screen.queryByText('*')).not.toBeInTheDocument();
    });

    it('sets aria-required to true when required', () => {
      render(<Input label="Email" value="" onChange={() => {}} required />);
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-required', 'true');
    });

    it('sets aria-required to false when not required', () => {
      render(<Input label="Email" value="" onChange={() => {}} />);
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-required', 'false');
    });

    it('sets required attribute on input when required', () => {
      render(<Input label="Email" value="" onChange={() => {}} required />);
      expect(screen.getByRole('textbox')).toBeRequired();
    });
  });

  describe('Disabled State', () => {
    it('disables input when disabled prop is true', () => {
      render(<Input label="Email" value="" onChange={() => {}} disabled />);
      expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('applies disabled styling classes', () => {
      render(<Input label="Email" value="" onChange={() => {}} disabled />);
      const input = screen.getByRole('textbox');
      expect(input.className).toContain('disabled:opacity-50');
      expect(input.className).toContain('disabled:cursor-not-allowed');
      expect(input.className).toContain('disabled:bg-gray-50');
    });

    it('does not call onChange when disabled', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      render(<Input label="Email" value="" onChange={handleChange} disabled />);
      
      const input = screen.getByRole('textbox');
      await user.type(input, 'test');
      expect(handleChange).not.toHaveBeenCalled();
    });

    it('is not disabled by default', () => {
      render(<Input label="Email" value="" onChange={() => {}} />);
      expect(screen.getByRole('textbox')).not.toBeDisabled();
    });
  });

  describe('Error State', () => {
    it('displays error message when error prop is provided', () => {
      render(
        <Input
          label="Email"
          value=""
          onChange={() => {}}
          error="Invalid email address"
        />
      );
      expect(screen.getByText('Invalid email address')).toBeInTheDocument();
    });

    it('applies error styling to input', () => {
      render(
        <Input
          label="Email"
          value=""
          onChange={() => {}}
          error="Invalid email"
        />
      );
      const input = screen.getByRole('textbox');
      expect(input.className).toContain('border-red-500');
      expect(input.className).toContain('text-red-900');
    });

    it('sets aria-invalid to true when error exists', () => {
      render(
        <Input
          label="Email"
          value=""
          onChange={() => {}}
          error="Invalid email"
        />
      );
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
    });

    it('sets aria-invalid to false when no error', () => {
      render(<Input label="Email" value="" onChange={() => {}} />);
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'false');
    });

    it('associates error message with input using aria-describedby', () => {
      render(
        <Input
          label="Email"
          value=""
          onChange={() => {}}
          error="Invalid email"
        />
      );
      const input = screen.getByRole('textbox');
      const errorId = input.getAttribute('aria-describedby');
      expect(errorId).toBeTruthy();
      expect(screen.getByText('Invalid email')).toHaveAttribute('id', errorId!);
    });

    it('error message has role alert for screen readers', () => {
      render(
        <Input
          label="Email"
          value=""
          onChange={() => {}}
          error="Invalid email"
        />
      );
      expect(screen.getByRole('alert')).toHaveTextContent('Invalid email');
    });

    it('does not display error message when error is undefined', () => {
      render(<Input label="Email" value="" onChange={() => {}} />);
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('applies normal styling when no error', () => {
      render(<Input label="Email" value="" onChange={() => {}} />);
      const input = screen.getByRole('textbox');
      expect(input.className).toContain('border-gray-300');
      expect(input.className).not.toContain('border-red-500');
    });
  });

  describe('Accessibility Attributes', () => {
    it('associates label with input using htmlFor and id', () => {
      render(<Input label="Email" value="" onChange={() => {}} />);
      const input = screen.getByRole('textbox');
      const label = screen.getByText('Email');
      expect(label).toHaveAttribute('for', input.id);
    });

    it('sets aria-label on input', () => {
      render(<Input label="Email Address" value="" onChange={() => {}} />);
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-label', 'Email Address');
    });

    it('uses custom id when provided', () => {
      render(<Input label="Email" value="" onChange={() => {}} id="custom-email" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('id', 'custom-email');
    });

    it('generates unique id from label when id not provided', () => {
      render(<Input label="Email Address" value="" onChange={() => {}} />);
      expect(screen.getByRole('textbox')).toHaveAttribute('id', 'input-email-address');
    });

    it('uses custom name when provided', () => {
      render(<Input label="Email" value="" onChange={() => {}} name="userEmail" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('name', 'userEmail');
    });

    it('uses generated id as name when name not provided', () => {
      render(<Input label="Email" value="" onChange={() => {}} />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('name', input.id);
    });
  });

  describe('Change Handler', () => {
    it('calls onChange when user types', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      render(<Input label="Email" value="" onChange={handleChange} />);
      
      const input = screen.getByRole('textbox');
      await user.type(input, 'test');
      
      expect(handleChange).toHaveBeenCalled();
      expect(handleChange.mock.calls.length).toBeGreaterThan(0);
    });

    it('calls onChange with updated value when user types', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      function ControlledInput() {
        const [value, setValue] = useState('');
        return (
          <Input
            label="Email"
            value={value}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              handleChange(e);
              setValue(e.target.value);
            }}
          />
        );
      }
      render(<ControlledInput />);

      await user.type(screen.getByRole('textbox'), 'abc');

      expect(handleChange).toHaveBeenCalled();
      const lastCall = handleChange.mock.calls[handleChange.mock.calls.length - 1][0] as ChangeEvent<HTMLInputElement>;
      expect(lastCall.target.value).toBe('abc');
    });

    it('updates displayed value when value prop changes', () => {
      const { rerender } = render(<Input label="Email" value="" onChange={() => {}} />);
      expect(screen.getByRole('textbox')).toHaveValue('');
      
      rerender(<Input label="Email" value="new@example.com" onChange={() => {}} />);
      expect(screen.getByRole('textbox')).toHaveValue('new@example.com');
    });
  });

  describe('Input Types', () => {
    it('supports email input type', () => {
      render(<Input label="Email" type="email" value="" onChange={() => {}} />);
      expect(screen.getByLabelText('Email')).toHaveAttribute('type', 'email');
    });

    it('supports password input type', () => {
      render(<Input label="Password" type="password" value="" onChange={() => {}} />);
      expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'password');
    });

    it('supports number input type', () => {
      render(<Input label="Age" type="number" value="" onChange={() => {}} />);
      expect(screen.getByLabelText('Age')).toHaveAttribute('type', 'number');
    });

    it('supports tel input type', () => {
      render(<Input label="Phone" type="tel" value="" onChange={() => {}} />);
      expect(screen.getByLabelText('Phone')).toHaveAttribute('type', 'tel');
    });

    it('supports url input type', () => {
      render(<Input label="Website" type="url" value="" onChange={() => {}} />);
      expect(screen.getByLabelText('Website')).toHaveAttribute('type', 'url');
    });

    it('supports date input type', () => {
      render(<Input label="Birth Date" type="date" value="" onChange={() => {}} />);
      expect(screen.getByLabelText('Birth Date')).toHaveAttribute('type', 'date');
    });
  });

  describe('Edge Cases', () => {
    it('handles empty string value', () => {
      render(<Input label="Email" value="" onChange={() => {}} />);
      expect(screen.getByRole('textbox')).toHaveValue('');
    });

    it('handles long error messages', () => {
      const longError = 'This is a very long error message that should still be displayed correctly without breaking the layout or causing any issues';
      render(<Input label="Email" value="" onChange={() => {}} error={longError} />);
      expect(screen.getByText(longError)).toBeInTheDocument();
    });

    it('handles special characters in value', () => {
      const specialValue = 'test@example.com!#$%';
      render(<Input label="Email" value={specialValue} onChange={() => {}} />);
      expect(screen.getByRole('textbox')).toHaveValue(specialValue);
    });

    it('handles label with special characters', () => {
      render(<Input label="Email (required)" value="" onChange={() => {}} />);
      expect(screen.getByLabelText('Email (required)')).toBeInTheDocument();
    });

    it('combines required, disabled, and error states', () => {
      render(
        <Input
          label="Email"
          value=""
          onChange={() => {}}
          required
          disabled
          error="Invalid email"
        />
      );
      const input = screen.getByRole('textbox');
      expect(input).toBeRequired();
      expect(input).toBeDisabled();
      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(screen.getByText('Invalid email')).toBeInTheDocument();
    });

    it('handles rapid value changes', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      render(<Input label="Search" value="" onChange={handleChange} />);
      
      const input = screen.getByRole('textbox');
      await user.type(input, 'quick');
      
      expect(handleChange).toHaveBeenCalledTimes(5);
    });

    it('clears error when error prop is removed', () => {
      const { rerender } = render(
        <Input label="Email" value="" onChange={() => {}} error="Invalid" />
      );
      expect(screen.getByText('Invalid')).toBeInTheDocument();
      
      rerender(<Input label="Email" value="" onChange={() => {}} />);
      expect(screen.queryByText('Invalid')).not.toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('applies base styling classes', () => {
      render(<Input label="Email" value="" onChange={() => {}} />);
      const input = screen.getByRole('textbox');
      expect(input.className).toContain('block');
      expect(input.className).toContain('w-full');
      expect(input.className).toContain('px-3');
      expect(input.className).toContain('py-2');
      expect(input.className).toContain('border');
      expect(input.className).toContain('rounded-lg');
    });

    it('applies focus styling classes', () => {
      render(<Input label="Email" value="" onChange={() => {}} />);
      const input = screen.getByRole('textbox');
      expect(input.className).toContain('focus:outline-none');
      expect(input.className).toContain('focus:ring-2');
    });

    it('label has proper styling', () => {
      render(<Input label="Email" value="" onChange={() => {}} />);
      const label = screen.getByText('Email');
      expect(label.className).toContain('text-sm');
      expect(label.className).toContain('font-medium');
      expect(label.className).toContain('text-gray-700');
    });
  });
});
