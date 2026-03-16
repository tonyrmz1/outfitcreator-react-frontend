import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Modal } from './Modal';

describe('Modal', () => {
  const mockOnClose = vi.fn();
  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    title: 'Test Modal',
    children: <div>Modal content</div>,
  };

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  afterEach(() => {
    // Clean up body overflow style
    document.body.style.overflow = '';
  });

  it('renders modal when isOpen is true', () => {
    render(<Modal {...defaultProps} />);
    
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('does not render modal when isOpen is false', () => {
    render(<Modal {...defaultProps} isOpen={false} />);
    
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('calls onClose when backdrop is clicked', () => {
    render(<Modal {...defaultProps} />);
    
    const backdrop = screen.getByRole('dialog');
    fireEvent.click(backdrop);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when modal content is clicked', () => {
    render(<Modal {...defaultProps} />);
    
    const content = screen.getByText('Modal content');
    fireEvent.click(content);
    
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('calls onClose when close button is clicked', () => {
    render(<Modal {...defaultProps} />);
    
    const closeButton = screen.getByLabelText('Close modal');
    fireEvent.click(closeButton);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Escape key is pressed', () => {
    render(<Modal {...defaultProps} />);
    
    fireEvent.keyDown(document, { key: 'Escape' });
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when other keys are pressed', () => {
    render(<Modal {...defaultProps} />);
    
    fireEvent.keyDown(document, { key: 'Enter' });
    
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('prevents background scrolling when open', () => {
    render(<Modal {...defaultProps} />);
    
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('restores background scrolling when closed', () => {
    const { rerender } = render(<Modal {...defaultProps} />);
    
    expect(document.body.style.overflow).toBe('hidden');
    
    rerender(<Modal {...defaultProps} isOpen={false} />);
    
    expect(document.body.style.overflow).toBe('');
  });

  it('applies correct size classes', () => {
    const { rerender } = render(<Modal {...defaultProps} size="sm" />);
    let modalContent = screen.getByRole('dialog').querySelector('div > div');
    expect(modalContent).toHaveClass('max-w-sm');

    rerender(<Modal {...defaultProps} size="md" />);
    modalContent = screen.getByRole('dialog').querySelector('div > div');
    expect(modalContent).toHaveClass('max-w-md');

    rerender(<Modal {...defaultProps} size="lg" />);
    modalContent = screen.getByRole('dialog').querySelector('div > div');
    expect(modalContent).toHaveClass('max-w-lg');

    rerender(<Modal {...defaultProps} size="xl" />);
    modalContent = screen.getByRole('dialog').querySelector('div > div');
    expect(modalContent).toHaveClass('max-w-xl');
  });

  it('has proper ARIA attributes', () => {
    render(<Modal {...defaultProps} />);
    
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title');
    
    const title = screen.getByText('Test Modal');
    expect(title).toHaveAttribute('id', 'modal-title');
  });

  it('traps focus within modal', () => {
    render(
      <Modal {...defaultProps}>
        <button>First button</button>
        <button>Second button</button>
        <button>Third button</button>
      </Modal>
    );

    const buttons = screen.getAllByRole('button');
    const firstButton = buttons[0]; // Close button
    const lastButton = buttons[buttons.length - 1]; // Third button

    // Focus last element
    lastButton.focus();
    expect(document.activeElement).toBe(lastButton);

    // Tab from last element should cycle to first
    fireEvent.keyDown(lastButton, { key: 'Tab' });
    
    // Focus first element
    firstButton.focus();
    expect(document.activeElement).toBe(firstButton);

    // Shift+Tab from first element should cycle to last
    fireEvent.keyDown(firstButton, { key: 'Tab', shiftKey: true });
  });

  it('restores focus to trigger element on close', () => {
    const triggerButton = document.createElement('button');
    document.body.appendChild(triggerButton);
    triggerButton.focus();

    const { rerender } = render(<Modal {...defaultProps} />);
    
    // Modal should be focused when open
    expect(document.activeElement).not.toBe(triggerButton);
    
    rerender(<Modal {...defaultProps} isOpen={false} />);
    
    // Focus should be restored to trigger button
    expect(document.activeElement).toBe(triggerButton);
    
    document.body.removeChild(triggerButton);
  });
});
