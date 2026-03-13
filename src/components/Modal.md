# Modal Component

A reusable, accessible modal dialog component with focus trap, keyboard navigation, and animations.

## Features

- ✅ **Overlay with backdrop** - Prevents interaction with background content
- ✅ **Size variants** - Support for sm, md, lg, xl sizes
- ✅ **Focus trap** - Keeps focus within the modal when open
- ✅ **Keyboard navigation** - Close on Escape key press
- ✅ **Backdrop click** - Close when clicking outside the modal
- ✅ **Scroll prevention** - Prevents background scrolling when open
- ✅ **Animations** - Smooth open/close transitions
- ✅ **Focus restoration** - Restores focus to trigger element on close
- ✅ **Accessibility** - ARIA attributes and keyboard support

## Usage

```tsx
import { useState } from 'react';
import { Modal, Button } from './components';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="My Modal"
        size="md"
      >
        <p>Modal content goes here</p>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="secondary" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setIsOpen(false)}>
            Confirm
          </Button>
        </div>
      </Modal>
    </>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | required | Controls whether the modal is visible |
| `onClose` | `() => void` | required | Callback function when modal should close |
| `title` | `string` | required | Title displayed in the modal header |
| `children` | `React.ReactNode` | required | Content to display in the modal body |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Size variant of the modal |

## Size Variants

- **sm** - Small modal (max-width: 24rem / 384px)
- **md** - Medium modal (max-width: 28rem / 448px)
- **lg** - Large modal (max-width: 32rem / 512px)
- **xl** - Extra large modal (max-width: 36rem / 576px)

## Accessibility

The Modal component follows WCAG 2.1 AA accessibility guidelines:

- **ARIA attributes**: Uses `role="dialog"`, `aria-modal="true"`, and `aria-labelledby`
- **Focus trap**: Keeps keyboard focus within the modal
- **Keyboard navigation**: 
  - Press `Escape` to close the modal
  - Press `Tab` to navigate between focusable elements
  - Press `Shift+Tab` to navigate backwards
- **Focus restoration**: Returns focus to the element that opened the modal
- **Screen reader support**: Proper labeling and semantic HTML

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Escape` | Close the modal |
| `Tab` | Move focus to next focusable element (trapped within modal) |
| `Shift+Tab` | Move focus to previous focusable element (trapped within modal) |

## Examples

### Basic Modal

```tsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Basic Modal"
>
  <p>This is a basic modal with default settings.</p>
</Modal>
```

### Form Modal

```tsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Create Item"
  size="lg"
>
  <form onSubmit={handleSubmit}>
    <Input label="Name" value={name} onChange={setName} />
    <Input label="Description" value={description} onChange={setDescription} />
    <div className="flex justify-end gap-2 mt-4">
      <Button variant="secondary" onClick={() => setIsOpen(false)}>
        Cancel
      </Button>
      <Button type="submit">
        Save
      </Button>
    </div>
  </form>
</Modal>
```

### Confirmation Modal

```tsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirm Delete"
  size="sm"
>
  <p className="text-gray-700 mb-4">
    Are you sure you want to delete this item? This action cannot be undone.
  </p>
  <div className="flex justify-end gap-2">
    <Button variant="secondary" onClick={() => setIsOpen(false)}>
      Cancel
    </Button>
    <Button variant="danger" onClick={handleDelete}>
      Delete
    </Button>
  </div>
</Modal>
```

## Implementation Details

### Focus Trap

The modal implements a focus trap that:
1. Finds all focusable elements within the modal
2. Traps Tab key navigation within these elements
3. Cycles focus from last to first element when tabbing forward
4. Cycles focus from first to last element when tabbing backward

### Scroll Prevention

When the modal opens:
- Sets `document.body.style.overflow = 'hidden'`
- Prevents scrolling of background content

When the modal closes:
- Restores `document.body.style.overflow = ''`
- Re-enables scrolling

### Focus Restoration

The modal stores a reference to the element that had focus when it opened and restores focus to that element when it closes.

### Animations

The modal uses CSS animations defined in `index.css`:
- **fadeIn**: Fades in the backdrop overlay (0.2s)
- **slideIn**: Slides in the modal content from top (0.3s)

## Testing

The Modal component includes comprehensive unit tests covering:
- Rendering and visibility
- Backdrop click handling
- Close button functionality
- Escape key handling
- Scroll prevention
- Size variants
- ARIA attributes
- Focus trap
- Focus restoration

Run tests with:
```bash
npm test -- Modal.test.tsx
```

## Requirements Satisfied

This component satisfies the following requirements:

- **16.2**: Focus trap when modal is open
- **16.3**: Close on Escape key press
- **20.1**: Modal overlay prevents background interaction
- **20.2**: Close on backdrop click
- **20.3**: Close on Escape key
- **20.4**: Prevent background scrolling when open
- **20.5**: Restore focus to trigger element on close
- **20.6**: Animate open/close transitions
