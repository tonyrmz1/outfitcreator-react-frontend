import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Select, SelectOption } from './Select';

const mockOptions: SelectOption[] = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
];

describe('Select Component', () => {
  describe('Basic Rendering', () => {
    it('renders with label and select field', () => {
      render(<Select label="Category" value="" onChange={() => {}} options={mockOptions} />);
      expect(screen.getByLabelText('Category')).toBeInTheDocument();
      expect(screen.getByRole('combobox', { name: 'Category' })).toBeInTheDocument();
    });

    it('renders all options from array', () => {
      render(<Select label="Category" value="" onChange={() => {}} options={mockOptions} />);
      const select = screen.getByRole('combobox');
      const options = Array.from(select.querySelectorAll('option'));
      
      expect(options).toHaveLength(3);
      expect(options[0]).toHaveTextContent('Option 1');
      expect(options[1]).toHaveTextContent('Option 2');
      expect(options[2]).toHaveTextContent('Option 3');
    });

    it('renders with placeholder option', () => {
      render(
        <Select
          label="Category"
          value=""
          onChange={() => {}}
          options={mockOptions}
          placeholder="Select a category"
        />
      );
      expect(screen.getByText('Select a category')).toBeInTheDocument();
    });

    it('placeholder option is disabled', () => {
      render(
        <Select
          label="Category"
          value=""
          onChange={() => {}}
          options={mockOptions}
          placeholder="Select a category"
        />
      );
      const placeholderOption = screen.getByText('Select a category') as HTMLOptionElement;
      expect(placeholderOption).toBeDisabled();
      expect(placeholderOption).toHaveAttribute('value', '');
    });

    it('displays the current selected value', () => {
      render(
        <Select
          label="Category"
          value="option2"
          onChange={() => {}}
          options={mockOptions}
        />
      );
      expect(screen.getByRole('combobox')).toHaveValue('option2');
    });

    it('renders without placeholder when not provided', () => {
      render(<Select label="Category" value="" onChange={() => {}} options={mockOptions} />);
      const select = screen.getByRole('combobox');
      const options = Array.from(select.querySelectorAll('option'));
      
      expect(options).toHaveLength(3);
      expect(screen.queryByText(/select/i)).not.toBeInTheDocument();
    });
  });

  describe('Required State', () => {
    it('displays required indicator when required is true', () => {
      render(
        <Select
          label="Category"
          value=""
          onChange={() => {}}
          options={mockOptions}
          required
        />
      );
      const requiredIndicator = screen.getByText('*');
      expect(requiredIndicator).toBeInTheDocument();
      expect(requiredIndicator).toHaveClass('text-red-500');
    });

    it('does not display required indicator by default', () => {
      render(<Select label="Category" value="" onChange={() => {}} options={mockOptions} />);
      expect(screen.queryByText('*')).not.toBeInTheDocument();
    });

    it('sets aria-required to true when required', () => {
      render(
        <Select
          label="Category"
          value=""
          onChange={() => {}}
          options={mockOptions}
          required
        />
      );
      expect(screen.getByRole('combobox')).toHaveAttribute('aria-required', 'true');
    });

    it('sets aria-required to false when not required', () => {
      render(<Select label="Category" value="" onChange={() => {}} options={mockOptions} />);
      expect(screen.getByRole('combobox')).toHaveAttribute('aria-required', 'false');
    });

    it('sets required attribute on select when required', () => {
      render(
        <Select
          label="Category"
          value=""
          onChange={() => {}}
          options={mockOptions}
          required
        />
      );
      expect(screen.getByRole('combobox')).toBeRequired();
    });
  });

  describe('Disabled State', () => {
    it('disables select when disabled prop is true', () => {
      render(
        <Select
          label="Category"
          value=""
          onChange={() => {}}
          options={mockOptions}
          disabled
        />
      );
      expect(screen.getByRole('combobox')).toBeDisabled();
    });

    it('applies disabled styling classes', () => {
      render(
        <Select
          label="Category"
          value=""
          onChange={() => {}}
          options={mockOptions}
          disabled
        />
      );
      const select = screen.getByRole('combobox');
      expect(select.className).toContain('disabled:opacity-50');
      expect(select.className).toContain('disabled:cursor-not-allowed');
      expect(select.className).toContain('disabled:bg-gray-50');
    });

    it('does not call onChange when disabled', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      render(
        <Select
          label="Category"
          value=""
          onChange={handleChange}
          options={mockOptions}
          disabled
        />
      );
      
      const select = screen.getByRole('combobox');
      await user.selectOptions(select, 'option1');
      expect(handleChange).not.toHaveBeenCalled();
    });

    it('is not disabled by default', () => {
      render(<Select label="Category" value="" onChange={() => {}} options={mockOptions} />);
      expect(screen.getByRole('combobox')).not.toBeDisabled();
    });
  });

  describe('Error State', () => {
    it('displays error message when error prop is provided', () => {
      render(
        <Select
          label="Category"
          value=""
          onChange={() => {}}
          options={mockOptions}
          error="Please select a category"
        />
      );
      expect(screen.getByText('Please select a category')).toBeInTheDocument();
    });

    it('applies error styling to select', () => {
      render(
        <Select
          label="Category"
          value=""
          onChange={() => {}}
          options={mockOptions}
          error="Invalid selection"
        />
      );
      const select = screen.getByRole('combobox');
      expect(select.className).toContain('border-red-500');
      expect(select.className).toContain('text-red-900');
    });

    it('sets aria-invalid to true when error exists', () => {
      render(
        <Select
          label="Category"
          value=""
          onChange={() => {}}
          options={mockOptions}
          error="Invalid selection"
        />
      );
      expect(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'true');
    });

    it('sets aria-invalid to false when no error', () => {
      render(<Select label="Category" value="" onChange={() => {}} options={mockOptions} />);
      expect(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'false');
    });

    it('associates error message with select using aria-describedby', () => {
      render(
        <Select
          label="Category"
          value=""
          onChange={() => {}}
          options={mockOptions}
          error="Invalid selection"
        />
      );
      const select = screen.getByRole('combobox');
      const errorId = select.getAttribute('aria-describedby');
      expect(errorId).toBeTruthy();
      expect(screen.getByText('Invalid selection')).toHaveAttribute('id', errorId!);
    });

    it('error message has role alert for screen readers', () => {
      render(
        <Select
          label="Category"
          value=""
          onChange={() => {}}
          options={mockOptions}
          error="Invalid selection"
        />
      );
      expect(screen.getByRole('alert')).toHaveTextContent('Invalid selection');
    });

    it('does not display error message when error is undefined', () => {
      render(<Select label="Category" value="" onChange={() => {}} options={mockOptions} />);
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('applies normal styling when no error', () => {
      render(<Select label="Category" value="" onChange={() => {}} options={mockOptions} />);
      const select = screen.getByRole('combobox');
      expect(select.className).toContain('border-gray-300');
      expect(select.className).not.toContain('border-red-500');
    });
  });

  describe('Accessibility Attributes', () => {
    it('associates label with select using htmlFor and id', () => {
      render(<Select label="Category" value="" onChange={() => {}} options={mockOptions} />);
      const select = screen.getByRole('combobox');
      const label = screen.getByText('Category');
      expect(label).toHaveAttribute('for', select.id);
    });

    it('sets aria-label on select', () => {
      render(
        <Select
          label="Clothing Category"
          value=""
          onChange={() => {}}
          options={mockOptions}
        />
      );
      expect(screen.getByRole('combobox')).toHaveAttribute('aria-label', 'Clothing Category');
    });

    it('uses custom id when provided', () => {
      render(
        <Select
          label="Category"
          value=""
          onChange={() => {}}
          options={mockOptions}
          id="custom-category"
        />
      );
      expect(screen.getByRole('combobox')).toHaveAttribute('id', 'custom-category');
    });

    it('generates unique id from label when id not provided', () => {
      render(
        <Select
          label="Clothing Category"
          value=""
          onChange={() => {}}
          options={mockOptions}
        />
      );
      expect(screen.getByRole('combobox')).toHaveAttribute('id', 'select-clothing-category');
    });

    it('uses custom name when provided', () => {
      render(
        <Select
          label="Category"
          value=""
          onChange={() => {}}
          options={mockOptions}
          name="itemCategory"
        />
      );
      expect(screen.getByRole('combobox')).toHaveAttribute('name', 'itemCategory');
    });

    it('uses generated id as name when name not provided', () => {
      render(<Select label="Category" value="" onChange={() => {}} options={mockOptions} />);
      const select = screen.getByRole('combobox');
      expect(select).toHaveAttribute('name', select.id);
    });
  });

  describe('Change Handler', () => {
    it('calls onChange when user selects an option', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      render(
        <Select
          label="Category"
          value=""
          onChange={handleChange}
          options={mockOptions}
        />
      );
      
      const select = screen.getByRole('combobox');
      await user.selectOptions(select, 'option2');
      
      expect(handleChange).toHaveBeenCalledWith('option2');
      expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it('calls onChange with correct value for each selection', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      render(
        <Select
          label="Category"
          value=""
          onChange={handleChange}
          options={mockOptions}
        />
      );
      
      const select = screen.getByRole('combobox');
      await user.selectOptions(select, 'option1');
      expect(handleChange).toHaveBeenLastCalledWith('option1');
      
      await user.selectOptions(select, 'option3');
      expect(handleChange).toHaveBeenLastCalledWith('option3');
    });

    it('updates displayed value when value prop changes', () => {
      const { rerender } = render(
        <Select
          label="Category"
          value="option1"
          onChange={() => {}}
          options={mockOptions}
        />
      );
      expect(screen.getByRole('combobox')).toHaveValue('option1');
      
      rerender(
        <Select
          label="Category"
          value="option2"
          onChange={() => {}}
          options={mockOptions}
        />
      );
      expect(screen.getByRole('combobox')).toHaveValue('option2');
    });
  });

  describe('Options Rendering', () => {
    it('renders options with correct values and labels', () => {
      render(<Select label="Category" value="" onChange={() => {}} options={mockOptions} />);
      const select = screen.getByRole('combobox');
      const options = Array.from(select.querySelectorAll('option')) as HTMLOptionElement[];
      
      expect(options[0]).toHaveValue('option1');
      expect(options[0]).toHaveTextContent('Option 1');
      expect(options[1]).toHaveValue('option2');
      expect(options[1]).toHaveTextContent('Option 2');
      expect(options[2]).toHaveValue('option3');
      expect(options[2]).toHaveTextContent('Option 3');
    });

    it('handles empty options array', () => {
      render(<Select label="Category" value="" onChange={() => {}} options={[]} />);
      const select = screen.getByRole('combobox');
      const options = Array.from(select.querySelectorAll('option'));
      
      expect(options).toHaveLength(0);
    });

    it('handles single option', () => {
      const singleOption = [{ value: 'only', label: 'Only Option' }];
      render(<Select label="Category" value="" onChange={() => {}} options={singleOption} />);
      const select = screen.getByRole('combobox');
      const options = Array.from(select.querySelectorAll('option'));
      
      expect(options).toHaveLength(1);
      expect(options[0]).toHaveTextContent('Only Option');
    });

    it('handles options with special characters in labels', () => {
      const specialOptions = [
        { value: 'opt1', label: 'Option & Special' },
        { value: 'opt2', label: 'Option < > "Quotes"' },
      ];
      render(<Select label="Category" value="" onChange={() => {}} options={specialOptions} />);
      
      expect(screen.getByText('Option & Special')).toBeInTheDocument();
      expect(screen.getByText('Option < > "Quotes"')).toBeInTheDocument();
    });

    it('handles options with same label but different values', () => {
      const duplicateLabelOptions = [
        { value: 'val1', label: 'Same Label' },
        { value: 'val2', label: 'Same Label' },
      ];
      render(
        <Select
          label="Category"
          value=""
          onChange={() => {}}
          options={duplicateLabelOptions}
        />
      );
      const select = screen.getByRole('combobox');
      const options = Array.from(select.querySelectorAll('option')) as HTMLOptionElement[];
      
      expect(options).toHaveLength(2);
      expect(options[0]).toHaveValue('val1');
      expect(options[1]).toHaveValue('val2');
    });
  });

  describe('Edge Cases', () => {
    it('handles empty string value with placeholder', () => {
      render(
        <Select
          label="Category"
          value=""
          onChange={() => {}}
          options={mockOptions}
          placeholder="Select an option"
        />
      );
      expect(screen.getByRole('combobox')).toHaveValue('');
    });

    it('handles long error messages', () => {
      const longError = 'This is a very long error message that should still be displayed correctly without breaking the layout or causing any issues';
      render(
        <Select
          label="Category"
          value=""
          onChange={() => {}}
          options={mockOptions}
          error={longError}
        />
      );
      expect(screen.getByText(longError)).toBeInTheDocument();
    });

    it('handles label with special characters', () => {
      render(
        <Select
          label="Category (required)"
          value=""
          onChange={() => {}}
          options={mockOptions}
        />
      );
      expect(screen.getByLabelText('Category (required)')).toBeInTheDocument();
    });

    it('combines required, disabled, and error states', () => {
      render(
        <Select
          label="Category"
          value=""
          onChange={() => {}}
          options={mockOptions}
          required
          disabled
          error="Invalid selection"
        />
      );
      const select = screen.getByRole('combobox');
      expect(select).toBeRequired();
      expect(select).toBeDisabled();
      expect(select).toHaveAttribute('aria-invalid', 'true');
      expect(screen.getByText('Invalid selection')).toBeInTheDocument();
    });

    it('clears error when error prop is removed', () => {
      const { rerender } = render(
        <Select
          label="Category"
          value=""
          onChange={() => {}}
          options={mockOptions}
          error="Invalid"
        />
      );
      expect(screen.getByText('Invalid')).toBeInTheDocument();
      
      rerender(
        <Select
          label="Category"
          value=""
          onChange={() => {}}
          options={mockOptions}
        />
      );
      expect(screen.queryByText('Invalid')).not.toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('applies base styling classes', () => {
      render(<Select label="Category" value="" onChange={() => {}} options={mockOptions} />);
      const select = screen.getByRole('combobox');
      expect(select.className).toContain('block');
      expect(select.className).toContain('w-full');
      expect(select.className).toContain('px-3');
      expect(select.className).toContain('py-2');
      expect(select.className).toContain('border');
      expect(select.className).toContain('rounded-lg');
    });

    it('applies focus styling classes', () => {
      render(<Select label="Category" value="" onChange={() => {}} options={mockOptions} />);
      const select = screen.getByRole('combobox');
      expect(select.className).toContain('focus:outline-none');
      expect(select.className).toContain('focus:ring-2');
    });

    it('label has proper styling', () => {
      render(<Select label="Category" value="" onChange={() => {}} options={mockOptions} />);
      const label = screen.getByText('Category');
      expect(label.className).toContain('text-sm');
      expect(label.className).toContain('font-medium');
      expect(label.className).toContain('text-gray-700');
    });

    it('applies bg-white class for proper background', () => {
      render(<Select label="Category" value="" onChange={() => {}} options={mockOptions} />);
      const select = screen.getByRole('combobox');
      expect(select.className).toContain('bg-white');
    });
  });
});
