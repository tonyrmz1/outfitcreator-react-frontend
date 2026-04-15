import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Pagination } from '../common/Pagination';

describe('Pagination', () => {
  const defaultProps = {
    currentPage: 0,
    totalPages: 5,
    onPageChange: vi.fn(),
    pageSize: 20,
    totalItems: 100,
  };

  it('renders pagination information correctly', () => {
    render(<Pagination {...defaultProps} />);

    expect(screen.getByText((content, element) => {
      return element?.tagName === 'DIV' && element?.textContent === 'Showing 1 to 20 of 100 items';
    })).toBeInTheDocument();
    
    expect(screen.getByText((content, element) => {
      return element?.tagName === 'SPAN' && element?.textContent === 'Page 1 of 5';
    })).toBeInTheDocument();
  });

  it('disables first and previous buttons on first page', () => {
    render(<Pagination {...defaultProps} currentPage={0} />);

    const firstButton = screen.getByLabelText('Go to first page');
    const previousButton = screen.getByLabelText('Go to previous page');

    expect(firstButton).toBeDisabled();
    expect(previousButton).toBeDisabled();
  });

  it('disables next and last buttons on last page', () => {
    render(<Pagination {...defaultProps} currentPage={4} totalPages={5} />);

    const nextButton = screen.getByLabelText('Go to next page');
    const lastButton = screen.getByLabelText('Go to last page');

    expect(nextButton).toBeDisabled();
    expect(lastButton).toBeDisabled();
  });

  it('enables all buttons on middle page', () => {
    render(<Pagination {...defaultProps} currentPage={2} />);

    const firstButton = screen.getByLabelText('Go to first page');
    const previousButton = screen.getByLabelText('Go to previous page');
    const nextButton = screen.getByLabelText('Go to next page');
    const lastButton = screen.getByLabelText('Go to last page');

    expect(firstButton).not.toBeDisabled();
    expect(previousButton).not.toBeDisabled();
    expect(nextButton).not.toBeDisabled();
    expect(lastButton).not.toBeDisabled();
  });

  it('calls onPageChange with correct page when first button is clicked', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();

    render(<Pagination {...defaultProps} currentPage={2} onPageChange={onPageChange} />);

    const firstButton = screen.getByLabelText('Go to first page');
    await user.click(firstButton);

    expect(onPageChange).toHaveBeenCalledWith(0);
  });

  it('calls onPageChange with correct page when previous button is clicked', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();

    render(<Pagination {...defaultProps} currentPage={2} onPageChange={onPageChange} />);

    const previousButton = screen.getByLabelText('Go to previous page');
    await user.click(previousButton);

    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it('calls onPageChange with correct page when next button is clicked', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();

    render(<Pagination {...defaultProps} currentPage={2} onPageChange={onPageChange} />);

    const nextButton = screen.getByLabelText('Go to next page');
    await user.click(nextButton);

    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it('calls onPageChange with correct page when last button is clicked', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();

    render(<Pagination {...defaultProps} currentPage={2} onPageChange={onPageChange} />);

    const lastButton = screen.getByLabelText('Go to last page');
    await user.click(lastButton);

    expect(onPageChange).toHaveBeenCalledWith(4);
  });

  it('does not call onPageChange when disabled buttons are clicked', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();

    render(<Pagination {...defaultProps} currentPage={0} onPageChange={onPageChange} />);

    const firstButton = screen.getByLabelText('Go to first page');
    const previousButton = screen.getByLabelText('Go to previous page');

    await user.click(firstButton);
    await user.click(previousButton);

    expect(onPageChange).not.toHaveBeenCalled();
  });

  it('displays correct item range for middle page', () => {
    render(<Pagination {...defaultProps} currentPage={2} />);

    expect(screen.getByText('41')).toBeInTheDocument();
    expect(screen.getByText('60')).toBeInTheDocument();
  });

  it('displays correct item range for last page with partial items', () => {
    render(
      <Pagination
        {...defaultProps}
        currentPage={4}
        totalPages={5}
        totalItems={95}
      />
    );

    expect(screen.getByText((content, element) => {
      return element?.textContent === 'Showing 81 to 95 of 95 items';
    })).toBeInTheDocument();
  });

  it('displays zero items when totalItems is 0', () => {
    render(<Pagination {...defaultProps} totalItems={0} totalPages={0} />);

    expect(screen.getByText((content, element) => {
      return element?.textContent === 'Showing 0 to 0 of 0 items';
    })).toBeInTheDocument();
  });

  it('displays correct page number (1-indexed)', () => {
    render(<Pagination {...defaultProps} currentPage={0} />);

    expect(screen.getByText((content, element) => {
      return element?.tagName === 'SPAN' && element?.textContent === 'Page 1 of 5';
    })).toBeInTheDocument();
  });
});
