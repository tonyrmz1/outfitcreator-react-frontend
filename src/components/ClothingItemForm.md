# ClothingItemForm Component

A comprehensive form component for creating and editing clothing items in the OutfitCreator application.

## Features

- **Form Management**: Uses react-hook-form for efficient form state management
- **Validation**: Integrates Zod schema validation with field-level error display
- **Photo Upload**: Supports drag-and-drop photo upload with react-dropzone
- **Photo Preview**: Displays photo preview before submission
- **Edit Mode**: Pre-fills form fields when editing existing items
- **Loading State**: Shows loading indicators during form submission
- **Accessibility**: WCAG 2.1 AA compliant with proper ARIA labels and keyboard navigation

## Props

```typescript
interface ClothingItemFormProps {
  item?: ClothingItemFormData & { photoUrl?: string };
  onSubmit: (data: ClothingItemFormData, photo?: File) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}
```

### `item` (optional)
Pre-filled data for edit mode. When provided, the form will display "Update Item" instead of "Create Item".

### `onSubmit` (required)
Callback function called when the form is submitted with valid data. Receives the form data and optional photo file.

### `onCancel` (required)
Callback function called when the cancel button is clicked.

### `isLoading` (optional)
When true, disables all form fields and shows loading state on the submit button.

## Form Fields

### Required Fields
- **Name**: Text input (max 255 characters)
- **Primary Color**: Text input
- **Category**: Dropdown (TOP, BOTTOM, FOOTWEAR, OUTERWEAR, ACCESSORIES)

### Optional Fields
- **Brand**: Text input (max 100 characters)
- **Secondary Color**: Text input
- **Size**: Text input
- **Season**: Dropdown (SPRING, SUMMER, AUTUMN, WINTER, ALL_SEASON)
- **Fit**: Dropdown (TIGHT, REGULAR, LOOSE, OVERSIZED)
- **Purchase Date**: Date input
- **Photo**: File upload (JPEG, PNG, GIF, max 5MB)

## Photo Upload

The photo upload field supports:
- Drag and drop
- Click to select file
- File type validation (JPEG, PNG, GIF)
- File size validation (max 5MB)
- Preview before submission
- Remove photo option

## Validation

The form uses Zod schema validation with the following rules:
- Name: Required, max 255 characters
- Brand: Optional, max 100 characters
- Primary Color: Required
- Category: Required, must be valid enum value
- Photo: Optional, must be JPEG/PNG/GIF, max 5MB

Validation errors are displayed below each field in real-time.

## Usage Examples

### Create Mode

```tsx
import { ClothingItemForm } from './components';

function CreateItemModal() {
  const [isOpen, setIsOpen] = useState(false);
  const { createItem } = useClothingItems();

  const handleSubmit = async (data, photo) => {
    await createItem(data, photo);
    setIsOpen(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Add Clothing Item">
      <ClothingItemForm
        onSubmit={handleSubmit}
        onCancel={() => setIsOpen(false)}
      />
    </Modal>
  );
}
```

### Edit Mode

```tsx
import { ClothingItemForm } from './components';

function EditItemModal({ item }) {
  const [isOpen, setIsOpen] = useState(false);
  const { updateItem } = useClothingItems();

  const handleSubmit = async (data, photo) => {
    await updateItem(item.id, data);
    if (photo) {
      await uploadPhoto(item.id, photo);
    }
    setIsOpen(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Edit Clothing Item">
      <ClothingItemForm
        item={item}
        onSubmit={handleSubmit}
        onCancel={() => setIsOpen(false)}
      />
    </Modal>
  );
}
```

### With Loading State

```tsx
function CreateItemModal() {
  const [isLoading, setIsLoading] = useState(false);
  const { createItem } = useClothingItems();

  const handleSubmit = async (data, photo) => {
    setIsLoading(true);
    try {
      await createItem(data, photo);
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to create item:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ClothingItemForm
      onSubmit={handleSubmit}
      onCancel={() => setIsOpen(false)}
      isLoading={isLoading}
    />
  );
}
```

## Accessibility

The component follows WCAG 2.1 AA guidelines:
- All form fields have associated labels
- Required fields are marked with asterisk and aria-required
- Error messages are linked to fields with aria-describedby
- Invalid fields are marked with aria-invalid
- Photo upload has proper aria-label
- All interactive elements are keyboard accessible
- Focus management is handled properly

## Styling

The component uses Tailwind CSS for styling and follows the application's design system:
- Consistent spacing and layout
- Proper color contrast for accessibility
- Responsive design
- Visual feedback for interactions (hover, focus, disabled states)
- Error states with red color coding

## Testing

The component has comprehensive test coverage including:
- Rendering all form fields
- Form validation
- Photo upload and preview
- Edit mode with pre-filled data
- Loading states
- Form submission
- Cancel functionality

See `ClothingItemForm.test.tsx` for detailed test cases.
