# Pagination Component

A reusable pagination component that displays page navigation controls and item count information.

## Features

- Displays current page and total pages (1-indexed for user display)
- Shows page navigation buttons (first, previous, next, last)
- Automatically disables buttons at boundaries (first/last page)
- Displays total items count and current range
- Fully accessible with ARIA labels
- Keyboard navigable
- Responsive design with Tailwind CSS

## Usage

```tsx
import { Pagination } from './components';

function MyList() {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = 10;
  const pageSize = 20;
  const totalItems = 200;

  return (
    <div>
      {/* Your list content */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        pageSize={pageSize}
        totalItems={totalItems}
      />
    </div>
  );
}
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `currentPage` | `number` | Yes | Current page index (0-based) |
| `totalPages` | `number` | Yes | Total number of pages |
| `onPageChange` | `(page: number) => void` | Yes | Callback when page changes |
| `pageSize` | `number` | Yes | Number of items per page |
| `totalItems` | `number` | Yes | Total number of items |

## Behavior

- **First Page**: First and Previous buttons are disabled
- **Last Page**: Next and Last buttons are disabled
- **Middle Pages**: All buttons are enabled
- **Empty Results**: Shows "0 to 0 of 0 items"
- **Partial Last Page**: Correctly calculates end item (e.g., "81 to 95 of 95 items")

## Accessibility

- All buttons have descriptive `aria-label` attributes
- Buttons are keyboard accessible
- Disabled state is properly communicated to screen readers
- Focus styles are visible for keyboard navigation

## Requirements Satisfied

- **5.3**: Display pagination controls when items exceed page size
- **5.4**: Limit each page to configurable page size (default 20)
- **5.5**: Fetch and display items for selected page
