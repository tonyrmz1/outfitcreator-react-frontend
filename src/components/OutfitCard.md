# OutfitCard Component

## Overview

The `OutfitCard` component displays a saved outfit with its items, metadata, and action buttons. It's designed to be used in grid layouts on the OutfitsPage to show a collection of user-created outfits.

## Features

- **Outfit Information**: Displays outfit name, notes (truncated if too long), and creation date
- **Item Photos Grid**: Shows a responsive grid of item photos (up to 4 items visible)
- **Completeness Indicator**: Visual badge showing whether the outfit is complete or incomplete
- **Action Buttons**: Optional edit and delete buttons
- **Click Interaction**: Optional onClick handler for viewing outfit details
- **Accessibility**: Full keyboard navigation and ARIA labels
- **Responsive Design**: Adapts to different screen sizes using Tailwind CSS

## Props

```typescript
interface OutfitCardProps {
  outfit: Outfit;                          // The outfit to display
  onEdit?: (outfit: Outfit) => void;       // Optional edit handler
  onDelete?: (outfitId: number) => void;   // Optional delete handler
  onClick?: (outfit: Outfit) => void;      // Optional click handler for viewing details
}
```

## Usage

### Basic Usage

```tsx
import { OutfitCard } from './components';

function OutfitsPage() {
  const outfits = useOutfits();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {outfits.map(outfit => (
        <OutfitCard key={outfit.id} outfit={outfit} />
      ))}
    </div>
  );
}
```

### With Action Buttons

```tsx
<OutfitCard
  outfit={outfit}
  onEdit={(outfit) => openEditModal(outfit)}
  onDelete={(id) => handleDelete(id)}
/>
```

### With Click Handler

```tsx
<OutfitCard
  outfit={outfit}
  onClick={(outfit) => navigate(`/outfits/${outfit.id}`)}
/>
```

### With All Features

```tsx
<OutfitCard
  outfit={outfit}
  onEdit={handleEdit}
  onDelete={handleDelete}
  onClick={handleView}
/>
```

## Visual Elements

### Completeness Indicator

The component displays a badge in the top-right corner of the photo grid:

- **Complete**: Green badge with checkmark icon
- **Incomplete**: Yellow badge with warning icon

An outfit is considered complete if it has at least a top and bottom item (as defined by the backend).

### Item Photos Grid

The component displays item photos in a responsive grid:

- **1 item**: Single full-width photo
- **2 items**: 2-column grid
- **3 items**: 3-column grid
- **4+ items**: 2x2 grid (shows first 4 items)

If an outfit has no items, a placeholder image is displayed.

### Notes Truncation

Notes longer than 100 characters are automatically truncated with an ellipsis (...). The full notes are available in the `title` attribute for tooltip display.

### Date Formatting

Creation dates are formatted in a human-readable format (e.g., "Jan 15, 2024").

## Accessibility

The component follows WCAG 2.1 AA guidelines:

- **Keyboard Navigation**: Full support for Tab, Enter, and Space keys
- **ARIA Labels**: Descriptive labels for all interactive elements
- **Focus Management**: Proper focus indicators and tabIndex
- **Screen Reader Support**: Semantic HTML and alt text for images
- **Color Contrast**: Sufficient contrast ratios for all text

### Keyboard Shortcuts

When the card is clickable (onClick provided):
- **Tab**: Focus the card
- **Enter** or **Space**: Trigger the onClick handler

Action buttons are individually focusable and can be activated with Enter or Space.

## Styling

The component uses Tailwind CSS for styling with the following key classes:

- **Card Container**: `bg-white rounded-lg shadow-md`
- **Hover Effect**: `hover:shadow-lg` (when clickable)
- **Complete Badge**: `bg-green-100 text-green-800`
- **Incomplete Badge**: `bg-yellow-100 text-yellow-800`

## Requirements Validation

This component satisfies the following requirements:

- **Requirement 7.8**: Display outfit name, notes, creation date, and item photos
- **Requirement 23.1**: Indicate whether an outfit is complete or incomplete
- **Requirement 23.2**: Consider an outfit complete if it has at least a top and bottom
- **Requirement 23.3**: Display a visual indicator for incomplete outfits

## Examples

### Complete Outfit

```tsx
const outfit: Outfit = {
  id: 1,
  name: 'Summer Casual',
  notes: 'Perfect for a sunny day',
  items: [
    { id: 1, clothingItem: tshirt, position: ItemPosition.TOP },
    { id: 2, clothingItem: shorts, position: ItemPosition.BOTTOM },
    { id: 3, clothingItem: sneakers, position: ItemPosition.FOOTWEAR },
  ],
  isComplete: true,
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2024-01-15T10:30:00Z',
};

<OutfitCard outfit={outfit} />
```

### Incomplete Outfit

```tsx
const outfit: Outfit = {
  id: 2,
  name: 'Work in Progress',
  notes: 'Still need to add shoes',
  items: [
    { id: 1, clothingItem: blazer, position: ItemPosition.OUTERWEAR },
  ],
  isComplete: false,
  createdAt: '2024-02-01T14:20:00Z',
  updatedAt: '2024-02-01T14:20:00Z',
};

<OutfitCard outfit={outfit} />
```

## Testing

The component includes comprehensive unit tests covering:

- Rendering of all outfit information
- Completeness indicator display and styling
- Item photos grid layout
- Action button functionality
- Click interaction and event propagation
- Keyboard accessibility
- ARIA labels and semantic HTML

Run tests with:

```bash
npm test -- OutfitCard.test.tsx
```

## Related Components

- **ClothingItemCard**: Similar card component for individual clothing items
- **OutfitBuilder**: Modal for creating and editing outfits
- **OutfitsPage**: Page that displays a grid of OutfitCard components
