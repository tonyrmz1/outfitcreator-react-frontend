# ErrorMessage Component

A reusable error display component that shows error messages with optional retry and dismiss functionality.

## Features

- Displays error messages with appropriate styling and iconography
- Optional retry button for recoverable errors
- Optional dismiss button for dismissible errors
- Accessible with proper ARIA attributes
- Keyboard navigation support
- Consistent error styling across the application

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `message` | `string` | Yes | - | The error message text to display |
| `onRetry` | `() => void` | No | `undefined` | Callback function when retry button is clicked. If provided, a retry button will be displayed |
| `onDismiss` | `() => void` | No | `undefined` | Callback function when dismiss button is clicked. If provided, a dismiss button will be displayed |

## Usage Examples

### Basic Error Message

```tsx
<ErrorMessage message="Something went wrong. Please try again." />
```

### With Retry Button

```tsx
<ErrorMessage 
  message="Failed to load data. Click retry to try again." 
  onRetry={() => fetchData()}
/>
```

### With Dismiss Button

```tsx
<ErrorMessage 
  message="This is a dismissible warning message." 
  onDismiss={() => setError(null)}
/>
```

### With Both Buttons

```tsx
<ErrorMessage 
  message="Network error occurred. You can retry or dismiss this message." 
  onRetry={() => retryRequest()}
  onDismiss={() => clearError()}
/>
```

## Common Use Cases

### Network Errors (Requirements 13.1)

```tsx
<ErrorMessage 
  message="Network connection failed. Please check your internet connection." 
  onRetry={handleRetry}
/>
```

### API Request Failures (Requirements 13.2)

```tsx
<ErrorMessage 
  message="Failed to fetch data from the server." 
  onRetry={refetchData}
/>
```

### Unexpected Errors (Requirements 13.7)

```tsx
<ErrorMessage 
  message="An unexpected error occurred. Please refresh the page." 
  onRetry={() => window.location.reload()}
/>
```

## Accessibility

- Uses `role="alert"` for screen reader announcements
- Includes `aria-live="polite"` for dynamic content updates
- Dismiss button has `aria-label="Dismiss error"` for screen readers
- All icons have `aria-hidden="true"` to prevent redundant announcements
- Fully keyboard accessible with proper focus management

## Styling

The component uses Tailwind CSS classes with a red color scheme:
- Background: `bg-red-50`
- Border: `border-red-200`
- Text: `text-red-800`
- Icon: `text-red-400`

## Requirements Validation

This component satisfies the following requirements:

- **Requirement 13.1**: Display user-friendly error messages for network errors
- **Requirement 13.2**: Display error message with retry option for API failures
- **Requirement 13.7**: Display fallback error page with refresh option for unexpected errors

## Testing

The component includes comprehensive unit tests covering:
- Basic rendering and message display
- Retry button functionality
- Dismiss button functionality
- Combined button scenarios
- Styling verification
- Edge cases (empty messages, long messages, special characters)
- Accessibility features

Run tests with:
```bash
npm test -- ErrorMessage.test.tsx
```

## Related Components

- **Button**: Used for the retry button
- **LoadingSpinner**: Often used alongside ErrorMessage for loading states
