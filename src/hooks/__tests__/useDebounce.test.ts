import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('basic functionality', () => {
    it('should return initial value immediately', () => {
      const { result } = renderHook(() => useDebounce('initial', 300));
      
      expect(result.current).toBe('initial');
    });

    it('should debounce value changes with default delay (300ms)', () => {
      const { result, rerender } = renderHook(
        ({ value }) => useDebounce(value, 300),
        { initialProps: { value: 'initial' } }
      );

      expect(result.current).toBe('initial');

      // Update the value
      rerender({ value: 'updated' });

      // Value should not change immediately
      expect(result.current).toBe('initial');

      // Fast-forward time by 299ms (just before delay)
      act(() => {
        vi.advanceTimersByTime(299);
      });
      expect(result.current).toBe('initial');

      // Fast-forward the remaining 1ms to complete the delay
      act(() => {
        vi.advanceTimersByTime(1);
      });
      
      expect(result.current).toBe('updated');
    });

    it('should debounce value changes with custom delay', () => {
      const { result, rerender } = renderHook(
        ({ value }) => useDebounce(value, 500),
        { initialProps: { value: 'initial' } }
      );

      rerender({ value: 'updated' });

      // Value should not change before delay
      act(() => {
        vi.advanceTimersByTime(499);
      });
      expect(result.current).toBe('initial');

      // Value should change after delay
      act(() => {
        vi.advanceTimersByTime(1);
      });
      
      expect(result.current).toBe('updated');
    });
  });

  describe('rapid value changes', () => {
    it('should reset timer on each value change', () => {
      const { result, rerender } = renderHook(
        ({ value }) => useDebounce(value, 300),
        { initialProps: { value: 'initial' } }
      );

      // First change
      rerender({ value: 'change1' });
      act(() => {
        vi.advanceTimersByTime(100);
      });
      expect(result.current).toBe('initial');

      // Second change (resets timer)
      rerender({ value: 'change2' });
      act(() => {
        vi.advanceTimersByTime(100);
      });
      expect(result.current).toBe('initial');

      // Third change (resets timer)
      rerender({ value: 'change3' });
      act(() => {
        vi.advanceTimersByTime(100);
      });
      expect(result.current).toBe('initial');

      // Now wait for full delay after last change
      act(() => {
        vi.advanceTimersByTime(200);
      });
      
      expect(result.current).toBe('change3');
    });

    it('should only update to the final value after rapid changes', () => {
      const { result, rerender } = renderHook(
        ({ value }) => useDebounce(value, 300),
        { initialProps: { value: 'initial' } }
      );

      // Simulate rapid typing
      rerender({ value: 'a' });
      act(() => {
        vi.advanceTimersByTime(50);
      });
      
      rerender({ value: 'ab' });
      act(() => {
        vi.advanceTimersByTime(50);
      });
      
      rerender({ value: 'abc' });
      act(() => {
        vi.advanceTimersByTime(50);
      });
      
      rerender({ value: 'abcd' });
      act(() => {
        vi.advanceTimersByTime(50);
      });
      
      rerender({ value: 'abcde' });

      // Value should still be initial
      expect(result.current).toBe('initial');

      // Wait for full delay after last change
      act(() => {
        vi.advanceTimersByTime(300);
      });
      
      expect(result.current).toBe('abcde');
    });
  });

  describe('different value types', () => {
    it('should work with string values', () => {
      const { result, rerender } = renderHook(
        ({ value }) => useDebounce(value, 300),
        { initialProps: { value: 'hello' } }
      );

      rerender({ value: 'world' });
      act(() => {
        vi.advanceTimersByTime(300);
      });
      
      expect(result.current).toBe('world');
    });

    it('should work with number values', () => {
      const { result, rerender } = renderHook(
        ({ value }) => useDebounce(value, 300),
        { initialProps: { value: 0 } }
      );

      rerender({ value: 42 });
      act(() => {
        vi.advanceTimersByTime(300);
      });
      
      expect(result.current).toBe(42);
    });

    it('should work with boolean values', () => {
      const { result, rerender } = renderHook(
        ({ value }) => useDebounce(value, 300),
        { initialProps: { value: false } }
      );

      rerender({ value: true });
      act(() => {
        vi.advanceTimersByTime(300);
      });
      
      expect(result.current).toBe(true);
    });

    it('should work with object values', () => {
      const { result, rerender } = renderHook(
        ({ value }) => useDebounce(value, 300),
        { initialProps: { value: { name: 'John' } } }
      );

      const newValue = { name: 'Jane' };
      rerender({ value: newValue });
      act(() => {
        vi.advanceTimersByTime(300);
      });
      
      expect(result.current).toEqual(newValue);
    });

    it('should work with array values', () => {
      const { result, rerender } = renderHook(
        ({ value }) => useDebounce(value, 300),
        { initialProps: { value: [1, 2, 3] } }
      );

      const newValue = [4, 5, 6];
      rerender({ value: newValue });
      act(() => {
        vi.advanceTimersByTime(300);
      });
      
      expect(result.current).toEqual(newValue);
    });
  });

  describe('edge cases', () => {
    it('should handle zero delay', () => {
      const { result, rerender } = renderHook(
        ({ value }) => useDebounce(value, 0),
        { initialProps: { value: 'initial' } }
      );

      rerender({ value: 'updated' });
      act(() => {
        vi.advanceTimersByTime(0);
      });
      
      expect(result.current).toBe('updated');
    });

    it('should handle undefined values', () => {
      const { result, rerender } = renderHook(
        ({ value }) => useDebounce(value, 300),
        { initialProps: { value: undefined } }
      );

      rerender({ value: 'defined' });
      act(() => {
        vi.advanceTimersByTime(300);
      });
      
      expect(result.current).toBe('defined');
    });

    it('should handle null values', () => {
      const { result, rerender } = renderHook(
        ({ value }) => useDebounce(value, 300),
        { initialProps: { value: null } }
      );

      rerender({ value: 'not null' });
      act(() => {
        vi.advanceTimersByTime(300);
      });
      
      expect(result.current).toBe('not null');
    });

    it('should clean up timer on unmount', () => {
      const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');
      
      const { unmount } = renderHook(() => useDebounce('value', 300));
      
      unmount();
      
      expect(clearTimeoutSpy).toHaveBeenCalled();
    });
  });

  describe('delay changes', () => {
    it('should handle delay changes', () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        { initialProps: { value: 'initial', delay: 300 } }
      );

      rerender({ value: 'updated', delay: 500 });

      // Should use new delay (500ms)
      act(() => {
        vi.advanceTimersByTime(300);
      });
      expect(result.current).toBe('initial');

      act(() => {
        vi.advanceTimersByTime(200);
      });
      
      expect(result.current).toBe('updated');
    });
  });

  describe('search input use case', () => {
    it('should debounce search query as user types', () => {
      const { result, rerender } = renderHook(
        ({ query }) => useDebounce(query, 300),
        { initialProps: { query: '' } }
      );

      // Simulate user typing "react"
      rerender({ query: 'r' });
      act(() => {
        vi.advanceTimersByTime(50);
      });
      
      rerender({ query: 're' });
      act(() => {
        vi.advanceTimersByTime(50);
      });
      
      rerender({ query: 'rea' });
      act(() => {
        vi.advanceTimersByTime(50);
      });
      
      rerender({ query: 'reac' });
      act(() => {
        vi.advanceTimersByTime(50);
      });
      
      rerender({ query: 'react' });

      // Value should still be empty during typing
      expect(result.current).toBe('');

      // After user stops typing for 300ms, value updates
      act(() => {
        vi.advanceTimersByTime(300);
      });
      
      expect(result.current).toBe('react');
    });
  });
});
