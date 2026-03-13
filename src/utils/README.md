# Utility Functions

This directory contains utility functions and helpers used throughout the application.

## Files

### `validation.ts`
Contains Zod validation schemas for forms and data validation:
- `loginSchema` - Login form validation
- `registerSchema` - Registration form validation with password strength requirements
- `clothingItemSchema` - Clothing item form validation
- `outfitSchema` - Outfit form validation
- `photoSchema` - Photo upload validation (file type and size)

### `filters.ts`
Contains filtering utilities for clothing items:

#### `applyFilters(items, filters)`
Applies multiple filters to a list of clothing items. All filters work in combination - an item must match ALL active filters to be included in the result.

**Parameters:**
- `items: ClothingItem[]` - Array of clothing items to filter
- `filters: ClothingItemFilters` - Filter criteria object

**Filter Types:**
- `category` - Filter by clothing category (TOP, BOTTOM, FOOTWEAR, etc.)
- `season` - Filter by season (items marked as ALL_SEASON match any season)
- `color` - Filter by color (matches primary or secondary color, case-insensitive)
- `searchQuery` - Text search in name and brand fields (case-insensitive, partial matches)

**Returns:** `ClothingItem[]` - Filtered array of items

**Example:**
```typescript
import { applyFilters } from './utils';

const filtered = applyFilters(items, {
  category: ClothingCategory.TOP,
  season: Season.SPRING,
  color: 'blue',
  searchQuery: 'shirt'
});
```

**Requirements:** 6.1, 6.2, 6.3, 6.4, 6.5

### `scores.ts`
Contains score display utility functions for outfit recommendations:

#### `getScoreColor(score)`
Returns a color indicator based on score thresholds for visual feedback.

**Parameters:**
- `score: number` - Compatibility score between 0 and 100

**Returns:** `string` - Color indicator:
- `'green'` - Excellent compatibility (≥85)
- `'yellow'` - Good compatibility (≥70)
- `'orange'` - Fair compatibility (≥50)
- `'red'` - Poor compatibility (<50)

**Example:**
```typescript
import { getScoreColor } from './utils';

const color = getScoreColor(87); // returns 'green'
```

#### `formatScore(score)`
Formats a numeric score as a percentage string with no decimal places.

**Parameters:**
- `score: number` - Numeric score value

**Returns:** `string` - Formatted percentage (e.g., "85%")

**Example:**
```typescript
import { formatScore } from './utils';

const formatted = formatScore(85.7); // returns "86%"
```

#### `getScoreLabel(score)`
Returns a descriptive text label based on score thresholds.

**Parameters:**
- `score: number` - Compatibility score between 0 and 100

**Returns:** `string` - Descriptive label:
- `'Excellent'` - ≥85
- `'Good'` - ≥70
- `'Fair'` - ≥50
- `'Poor'` - <50

**Example:**
```typescript
import { getScoreLabel } from './utils';

const label = getScoreLabel(87); // returns 'Excellent'
```

**Complete Usage Example:**
```typescript
import { getScoreColor, formatScore, getScoreLabel } from './utils';

function ScoreDisplay({ score }: { score: number }) {
  const color = getScoreColor(score);
  const formatted = formatScore(score);
  const label = getScoreLabel(score);
  
  return (
    <div className={`score-${color}`}>
      <span>{formatted}</span>
      <span>{label}</span>
    </div>
  );
}
```

**Requirements:** 9.2, 9.3, 24.1, 24.2, 24.3, 24.4, 24.5, 24.6

## Usage

Import utilities from the main index:
```typescript
import { applyFilters, loginSchema, clothingItemSchema } from './utils';
```
