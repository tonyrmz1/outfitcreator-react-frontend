import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAutoLogout } from '../auth/useAutoLogout';
import { useAuth } from '../auth/useAuth';

// Mock the useAuth hook (path must match what useAutoLogout imports)
vi.mock('../auth/useAuth', () => ({
  useAuth: vi.fn(),
}));

describe('useAutoLogout', () => {
  let mockLogout: ReturnType<typeof vi.fn>;
  let alertSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.useFakeTimers();
    mockLogout = vi.fn();
    (useAuth as ReturnType<typeof vi.fn>).mockReturnValue({
      logout: mockLogout,
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: vi.fn(),
      register: vi.fn(),
      updateProfile: vi.fn(),
    });
    alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('should set up inactivity timer on mount', () => {
    renderHook(() => useAutoLogout(30));
    
    // Timer should be set but not triggered yet
    expect(mockLogout).not.toHaveBeenCalled();
  });

  it('should call logout after inactivity timeout', () => {
    renderHook(() => useAutoLogout(30));
    
    // Fast-forward time by 30 minutes
    act(() => {
      vi.advanceTimersByTime(30 * 60 * 1000);
    });
    
    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(alertSpy).toHaveBeenCalledWith('You have been logged out due to inactivity');
  });

  it('should reset timer on mousedown event', () => {
    renderHook(() => useAutoLogout(30));
    
    // Fast-forward time by 25 minutes
    act(() => {
      vi.advanceTimersByTime(25 * 60 * 1000);
    });
    
    // Trigger mousedown event
    act(() => {
      document.dispatchEvent(new MouseEvent('mousedown'));
    });
    
    // Fast-forward time by another 25 minutes (total 50 minutes)
    act(() => {
      vi.advanceTimersByTime(25 * 60 * 1000);
    });
    
    // Should not have logged out yet because timer was reset
    expect(mockLogout).not.toHaveBeenCalled();
    
    // Fast-forward by 5 more minutes (30 minutes since last interaction)
    act(() => {
      vi.advanceTimersByTime(5 * 60 * 1000);
    });
    
    // Now should be logged out
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it('should reset timer on keydown event', () => {
    renderHook(() => useAutoLogout(30));
    
    // Fast-forward time by 25 minutes
    act(() => {
      vi.advanceTimersByTime(25 * 60 * 1000);
    });
    
    // Trigger keydown event
    act(() => {
      document.dispatchEvent(new KeyboardEvent('keydown'));
    });
    
    // Fast-forward time by another 25 minutes
    act(() => {
      vi.advanceTimersByTime(25 * 60 * 1000);
    });
    
    // Should not have logged out yet
    expect(mockLogout).not.toHaveBeenCalled();
  });

  it('should reset timer on scroll event', () => {
    renderHook(() => useAutoLogout(30));
    
    // Fast-forward time by 25 minutes
    act(() => {
      vi.advanceTimersByTime(25 * 60 * 1000);
    });
    
    // Trigger scroll event
    act(() => {
      document.dispatchEvent(new Event('scroll'));
    });
    
    // Fast-forward time by another 25 minutes
    act(() => {
      vi.advanceTimersByTime(25 * 60 * 1000);
    });
    
    // Should not have logged out yet
    expect(mockLogout).not.toHaveBeenCalled();
  });

  it('should reset timer on touchstart event', () => {
    renderHook(() => useAutoLogout(30));
    
    // Fast-forward time by 25 minutes
    act(() => {
      vi.advanceTimersByTime(25 * 60 * 1000);
    });
    
    // Trigger touchstart event
    act(() => {
      document.dispatchEvent(new TouchEvent('touchstart'));
    });
    
    // Fast-forward time by another 25 minutes
    act(() => {
      vi.advanceTimersByTime(25 * 60 * 1000);
    });
    
    // Should not have logged out yet
    expect(mockLogout).not.toHaveBeenCalled();
  });

  it('should use custom timeout value', () => {
    renderHook(() => useAutoLogout(10));
    
    // Fast-forward time by 10 minutes
    act(() => {
      vi.advanceTimersByTime(10 * 60 * 1000);
    });
    
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it('should clean up event listeners on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');
    
    const { unmount } = renderHook(() => useAutoLogout(30));
    
    unmount();
    
    // Should remove all 4 event listeners
    expect(removeEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith('touchstart', expect.any(Function));
  });

  it('should clear timeout on unmount', () => {
    const { unmount } = renderHook(() => useAutoLogout(30));
    
    unmount();
    
    // Fast-forward time by 30 minutes
    act(() => {
      vi.advanceTimersByTime(30 * 60 * 1000);
    });
    
    // Should not call logout after unmount
    expect(mockLogout).not.toHaveBeenCalled();
  });

  it('should handle multiple interactions correctly', () => {
    renderHook(() => useAutoLogout(30));
    
    // Simulate multiple interactions over time
    for (let i = 0; i < 5; i++) {
      act(() => {
        vi.advanceTimersByTime(20 * 60 * 1000); // 20 minutes
        document.dispatchEvent(new MouseEvent('mousedown'));
      });
    }
    
    // Total time passed: 100 minutes, but should not logout due to interactions
    expect(mockLogout).not.toHaveBeenCalled();
    
    // Now wait 30 minutes without interaction
    act(() => {
      vi.advanceTimersByTime(30 * 60 * 1000);
    });
    
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});
