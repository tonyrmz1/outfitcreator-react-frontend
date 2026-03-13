import { describe, it, expect } from 'vitest';
// Test that functions can be imported from the main utils index
import { getScoreColor, formatScore, getScoreLabel } from './index';

describe('scores module integration', () => {
  it('should export getScoreColor from utils index', () => {
    expect(typeof getScoreColor).toBe('function');
    expect(getScoreColor(85)).toBe('green');
  });

  it('should export formatScore from utils index', () => {
    expect(typeof formatScore).toBe('function');
    expect(formatScore(85)).toBe('85%');
  });

  it('should export getScoreLabel from utils index', () => {
    expect(typeof getScoreLabel).toBe('function');
    expect(getScoreLabel(85)).toBe('Excellent');
  });

  it('should work together for a complete score display', () => {
    const score = 87.5;
    
    const color = getScoreColor(score);
    const formatted = formatScore(score);
    const label = getScoreLabel(score);
    
    expect(color).toBe('green');
    expect(formatted).toBe('88%');
    expect(label).toBe('Excellent');
  });
});
