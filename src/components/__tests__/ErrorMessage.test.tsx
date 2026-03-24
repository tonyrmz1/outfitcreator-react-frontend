import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ErrorMessage } from '../common/ErrorMessage';

describe('ErrorMessage Component', () => {
  describe('Basic Rendering', () => {
    it('renders with error message text', () => {
      render(<ErrorMessage message="Something went wrong" />);
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });

    it('renders with alert role', () => {
      render(<ErrorMessage message="Error occurred" />);
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('has aria-live polite attribute', () => {
      render(<ErrorMessage message="Error occurred" />);
      expect(screen.getByRole('alert')).toHaveAttribute('aria-live', 'polite');
    });

    it('displays error icon', () => {
      const { container } = render(<ErrorMessage message="Error occurred" />);
      const icon = container.querySelector('svg');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveClass('text-red-400');
    });
  });

  describe('Retry Button', () => {
    it('displays retry button when onRetry is provided', () => {
      const handleRetry = vi.fn();
      render(<ErrorMessage message="Network error" onRetry={handleRetry} />);
      expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
    });

    it('does not display retry button when onRetry is not provided', () => {
      render(<ErrorMessage message="Network error" />);
      expect(screen.queryByRole('button', { name: 'Retry' })).not.toBeInTheDocument();
    });

    it('calls onRetry when retry button is clicked', async () => {
      const handleRetry = vi.fn();
      const user = userEvent.setup();
      render(<ErrorMessage message="Network error" onRetry={handleRetry} />);
      
      await user.click(screen.getByRole('button', { name: 'Retry' }));
      expect(handleRetry).toHaveBeenCalledTimes(1);
    });

    it('retry button has correct styling', () => {
      const handleRetry = vi.fn();
      render(<ErrorMessage message="Network error" onRetry={handleRetry} />);
      const button = screen.getByRole('button', { name: 'Retry' });
      expect(button.className).toContain('bg-gray-200');
    });
  });

  describe('Dismiss Button', () => {
    it('displays dismiss button when onDismiss is provided', () => {
      const handleDismiss = vi.fn();
      render(<ErrorMessage message="Warning message" onDismiss={handleDismiss} />);
      expect(screen.getByRole('button', { name: 'Dismiss error' })).toBeInTheDocument();
    });

    it('does not display dismiss button when onDismiss is not provided', () => {
      render(<ErrorMessage message="Warning message" />);
      expect(screen.queryByRole('button', { name: 'Dismiss error' })).not.toBeInTheDocument();
    });

    it('calls onDismiss when dismiss button is clicked', async () => {
      const handleDismiss = vi.fn();
      const user = userEvent.setup();
      render(<ErrorMessage message="Warning message" onDismiss={handleDismiss} />);
      
      await user.click(screen.getByRole('button', { name: 'Dismiss error' }));
      expect(handleDismiss).toHaveBeenCalledTimes(1);
    });

    it('dismiss button has correct aria-label', () => {
      const handleDismiss = vi.fn();
      render(<ErrorMessage message="Warning message" onDismiss={handleDismiss} />);
      expect(screen.getByRole('button', { name: 'Dismiss error' })).toHaveAttribute('aria-label', 'Dismiss error');
    });
  });

  describe('Combined Buttons', () => {
    it('displays both retry and dismiss buttons when both handlers are provided', () => {
      const handleRetry = vi.fn();
      const handleDismiss = vi.fn();
      render(
        <ErrorMessage 
          message="API request failed" 
          onRetry={handleRetry} 
          onDismiss={handleDismiss} 
        />
      );
      
      expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Dismiss error' })).toBeInTheDocument();
    });

    it('calls correct handler when each button is clicked', async () => {
      const handleRetry = vi.fn();
      const handleDismiss = vi.fn();
      const user = userEvent.setup();
      render(
        <ErrorMessage 
          message="API request failed" 
          onRetry={handleRetry} 
          onDismiss={handleDismiss} 
        />
      );
      
      await user.click(screen.getByRole('button', { name: 'Retry' }));
      expect(handleRetry).toHaveBeenCalledTimes(1);
      expect(handleDismiss).not.toHaveBeenCalled();

      await user.click(screen.getByRole('button', { name: 'Dismiss error' }));
      expect(handleDismiss).toHaveBeenCalledTimes(1);
      expect(handleRetry).toHaveBeenCalledTimes(1);
    });
  });

  describe('Styling', () => {
    it('applies error styling classes', () => {
      const { container } = render(<ErrorMessage message="Error" />);
      const errorDiv = container.firstChild as HTMLElement;
      expect(errorDiv.className).toContain('bg-red-50');
      expect(errorDiv.className).toContain('border-red-200');
      expect(errorDiv.className).toContain('rounded-lg');
    });

    it('applies correct text color', () => {
      render(<ErrorMessage message="Error text" />);
      const text = screen.getByText('Error text');
      expect(text.className).toContain('text-red-800');
    });
  });

  describe('Edge Cases', () => {
    it('handles empty message string', () => {
      render(<ErrorMessage message="" />);
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('handles long error messages', () => {
      const longMessage = 'This is a very long error message that should still be displayed correctly without breaking the layout or causing any visual issues in the component.';
      render(<ErrorMessage message={longMessage} />);
      expect(screen.getByText(longMessage)).toBeInTheDocument();
    });

    it('handles special characters in message', () => {
      const specialMessage = 'Error: <script>alert("test")</script> & "quotes"';
      render(<ErrorMessage message={specialMessage} />);
      expect(screen.getByText(specialMessage)).toBeInTheDocument();
    });

    it('renders correctly with only message prop', () => {
      render(<ErrorMessage message="Simple error" />);
      expect(screen.getByText('Simple error')).toBeInTheDocument();
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(<ErrorMessage message="Accessible error" />);
      const alert = screen.getByRole('alert');
      expect(alert).toHaveAttribute('aria-live', 'polite');
    });

    it('dismiss button is keyboard accessible', async () => {
      const handleDismiss = vi.fn();
      const user = userEvent.setup();
      render(<ErrorMessage message="Error" onDismiss={handleDismiss} />);
      
      const dismissButton = screen.getByRole('button', { name: 'Dismiss error' });
      dismissButton.focus();
      expect(dismissButton).toHaveFocus();
      
      await user.keyboard('{Enter}');
      expect(handleDismiss).toHaveBeenCalledTimes(1);
    });

    it('retry button is keyboard accessible', async () => {
      const handleRetry = vi.fn();
      const user = userEvent.setup();
      render(<ErrorMessage message="Error" onRetry={handleRetry} />);
      
      const retryButton = screen.getByRole('button', { name: 'Retry' });
      retryButton.focus();
      expect(retryButton).toHaveFocus();
      
      await user.keyboard('{Enter}');
      expect(handleRetry).toHaveBeenCalledTimes(1);
    });

    it('icons have aria-hidden attribute', () => {
      const { container } = render(<ErrorMessage message="Error" />);
      const icons = container.querySelectorAll('svg');
      icons.forEach(icon => {
        expect(icon).toHaveAttribute('aria-hidden', 'true');
      });
    });
  });
});
