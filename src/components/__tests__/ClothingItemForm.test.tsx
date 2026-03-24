import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ClothingItemForm } from '../features/Closet/ClothingItemForm';
import { ClothingCategory, Season, FitCategory } from '../../types';

describe('ClothingItemForm', () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
    mockOnCancel.mockClear();
  });

  it('renders all form fields', () => {
    render(
      <ClothingItemForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/brand/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/primary color/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/secondary color/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/size/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/season/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/fit/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/purchase date/i)).toBeInTheDocument();
  });

  it('displays photo upload dropzone', () => {
    render(
      <ClothingItemForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText(/drag and drop a photo here/i)).toBeInTheDocument();
  });

  it('shows validation errors for required fields', async () => {
    render(
      <ClothingItemForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    // Clear the name field to trigger validation
    const nameInput = screen.getByLabelText(/name/i);
    fireEvent.change(nameInput, { target: { value: '' } });
    fireEvent.blur(nameInput);

    const submitButton = screen.getByRole('button', { name: /create item/i });
    fireEvent.click(submitButton);

    // Wait for validation to trigger
    await waitFor(() => {
      // The form should not submit when validation fails
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  it('submits form with valid data', async () => {
    mockOnSubmit.mockResolvedValue(undefined);

    render(
      <ClothingItemForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    // Fill in required fields
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'Blue Jeans' },
    });
    fireEvent.change(screen.getByLabelText(/primary color/i), {
      target: { value: 'blue' },
    });

    const submitButton = screen.getByRole('button', { name: /create item/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Blue Jeans',
          primaryColor: 'blue',
          category: ClothingCategory.TOP,
        }),
        undefined
      );
    });
  });

  it('submits form with all fields filled', async () => {
    mockOnSubmit.mockResolvedValue(undefined);

    render(
      <ClothingItemForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    // Fill in all fields
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'Blue Denim Jacket' },
    });
    fireEvent.change(screen.getByLabelText(/brand/i), {
      target: { value: "Levi's" },
    });
    fireEvent.change(screen.getByLabelText(/primary color/i), {
      target: { value: 'blue' },
    });
    fireEvent.change(screen.getByLabelText(/secondary color/i), {
      target: { value: 'white' },
    });
    fireEvent.change(screen.getByLabelText(/category/i), {
      target: { value: ClothingCategory.OUTERWEAR },
    });
    fireEvent.change(screen.getByLabelText(/size/i), {
      target: { value: 'M' },
    });
    fireEvent.change(screen.getByLabelText(/season/i), {
      target: { value: Season.AUTUMN },
    });
    fireEvent.change(screen.getByLabelText(/fit/i), {
      target: { value: FitCategory.REGULAR },
    });
    fireEvent.change(screen.getByLabelText(/purchase date/i), {
      target: { value: '2024-01-15' },
    });

    const submitButton = screen.getByRole('button', { name: /create item/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Blue Denim Jacket',
          brand: "Levi's",
          primaryColor: 'blue',
          secondaryColor: 'white',
          category: ClothingCategory.OUTERWEAR,
          size: 'M',
          season: Season.AUTUMN,
          fitCategory: FitCategory.REGULAR,
          purchaseDate: '2024-01-15',
        }),
        undefined
      );
    });
  });

  it('pre-fills form in edit mode', () => {
    const existingItem = {
      name: 'Red Shirt',
      brand: 'Nike',
      primaryColor: 'red',
      secondaryColor: 'black',
      category: ClothingCategory.TOP,
      size: 'L',
      season: Season.SUMMER,
      fitCategory: FitCategory.LOOSE,
      purchaseDate: '2023-06-10',
      photoUrl: 'https://example.com/photo.jpg',
    };

    render(
      <ClothingItemForm
        item={existingItem}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByLabelText(/name/i)).toHaveValue('Red Shirt');
    expect(screen.getByLabelText(/brand/i)).toHaveValue('Nike');
    expect(screen.getByLabelText(/primary color/i)).toHaveValue('red');
    expect(screen.getByLabelText(/secondary color/i)).toHaveValue('black');
    expect(screen.getByLabelText(/category/i)).toHaveValue(ClothingCategory.TOP);
    expect(screen.getByLabelText(/size/i)).toHaveValue('L');
    expect(screen.getByLabelText(/season/i)).toHaveValue(Season.SUMMER);
    expect(screen.getByLabelText(/fit/i)).toHaveValue(FitCategory.LOOSE);
    expect(screen.getByLabelText(/purchase date/i)).toHaveValue('2023-06-10');
  });

  it('displays existing photo in edit mode', () => {
    const existingItem = {
      name: 'Red Shirt',
      primaryColor: 'red',
      category: ClothingCategory.TOP,
      photoUrl: 'https://example.com/photo.jpg',
    };

    render(
      <ClothingItemForm
        item={existingItem}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const image = screen.getByAltText('Preview');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/photo.jpg');
  });

  it('shows "Update Item" button in edit mode', () => {
    const existingItem = {
      name: 'Red Shirt',
      primaryColor: 'red',
      category: ClothingCategory.TOP,
    };

    render(
      <ClothingItemForm
        item={existingItem}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByRole('button', { name: /update item/i })).toBeInTheDocument();
  });

  it('calls onCancel when cancel button is clicked', () => {
    render(
      <ClothingItemForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('disables form fields when loading', () => {
    render(
      <ClothingItemForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isLoading={true}
      />
    );

    expect(screen.getByLabelText(/name/i)).toBeDisabled();
    expect(screen.getByLabelText(/brand/i)).toBeDisabled();
    expect(screen.getByLabelText(/primary color/i)).toBeDisabled();
    expect(screen.getByRole('button', { name: /create item/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeDisabled();
  });

  it('shows loading state on submit button', () => {
    render(
      <ClothingItemForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isLoading={true}
      />
    );

    const submitButton = screen.getByRole('button', { name: /create item/i });
    expect(submitButton).toHaveAttribute('aria-busy', 'true');
  });

  it('validates name length', async () => {
    render(
      <ClothingItemForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const longName = 'a'.repeat(256);
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: longName },
    });
    fireEvent.change(screen.getByLabelText(/primary color/i), {
      target: { value: 'blue' },
    });

    const submitButton = screen.getByRole('button', { name: /create item/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/string must contain at most 255 character/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('validates brand length', async () => {
    render(
      <ClothingItemForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const longBrand = 'a'.repeat(101);
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'Test Item' },
    });
    fireEvent.change(screen.getByLabelText(/brand/i), {
      target: { value: longBrand },
    });
    fireEvent.change(screen.getByLabelText(/primary color/i), {
      target: { value: 'blue' },
    });

    const submitButton = screen.getByRole('button', { name: /create item/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/string must contain at most 100 character/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('handles photo file selection', async () => {
    render(
      <ClothingItemForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const file = new File(['photo'], 'photo.jpg', { type: 'image/jpeg' });
    const input = screen.getByLabelText(/photo upload/i);

    // Mock URL.createObjectURL
    window.URL.createObjectURL = vi.fn(() => 'blob:mock-url');

    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByAltText('Preview')).toBeInTheDocument();
    });
  });

  it('removes photo when remove button is clicked', async () => {
    const existingItem = {
      name: 'Red Shirt',
      primaryColor: 'red',
      category: ClothingCategory.TOP,
      photoUrl: 'https://example.com/photo.jpg',
    };

    render(
      <ClothingItemForm
        item={existingItem}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const removeButton = screen.getByRole('button', { name: /remove photo/i });
    fireEvent.click(removeButton);

    await waitFor(() => {
      expect(screen.queryByAltText('Preview')).not.toBeInTheDocument();
      expect(screen.getByText(/drag and drop a photo here/i)).toBeInTheDocument();
    });
  });

  it('submits form with photo file', async () => {
    mockOnSubmit.mockResolvedValue(undefined);

    render(
      <ClothingItemForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    // Fill in required fields
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'Blue Jeans' },
    });
    fireEvent.change(screen.getByLabelText(/primary color/i), {
      target: { value: 'blue' },
    });

    // Add photo
    const file = new File(['photo'], 'photo.jpg', { type: 'image/jpeg' });
    const input = screen.getByLabelText(/photo upload/i);
    window.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByAltText('Preview')).toBeInTheDocument();
    });

    const submitButton = screen.getByRole('button', { name: /create item/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Blue Jeans',
          primaryColor: 'blue',
        }),
        file
      );
    });
  });
});
