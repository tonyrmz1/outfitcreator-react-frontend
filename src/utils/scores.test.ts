import { describe, it, expect } from 'vitest';
import { getScoreColor, formatScore, getScoreLabel } from './scores';

describe('getScoreColor', () => {
  describe('excellent compatibility (green)', () => {
    it('should return green for score of 85', () => {
      expect(getScoreColor(85)).toBe('green');
    });

    it('should return green for score of 90', () => {
      expect(getScoreColor(90)).toBe('green');
    });

    it('should return green for score of 100', () => {
      expect(getScoreColor(100)).toBe('green');
    });
  });

  describe('good compatibility (yellow)', () => {
    it('should return yellow for score of 70', () => {
      expect(getScoreColor(70)).toBe('yellow');
    });

    it('should return yellow for score of 75', () => {
      expect(getScoreColor(75)).toBe('yellow');
    });

    it('should return yellow for score of 84', () => {
      expect(getScoreColor(84)).toBe('yellow');
    });
  });

  describe('fair compatibility (orange)', () => {
    it('should return orange for score of 50', () => {
      expect(getScoreColor(50)).toBe('orange');
    });

    it('should return orange for score of 60', () => {
      expect(getScoreColor(60)).toBe('orange');
    });

    it('should return orange for score of 69', () => {
      expect(getScoreColor(69)).toBe('orange');
    });
  });

  describe('poor compatibility (red)', () => {
    it('should return red for score of 49', () => {
      expect(getScoreColor(49)).toBe('red');
    });

    it('should return red for score of 30', () => {
      expect(getScoreColor(30)).toBe('red');
    });

    it('should return red for score of 0', () => {
      expect(getScoreColor(0)).toBe('red');
    });
  });

  describe('boundary values', () => {
    it('should return green for score exactly at 85 threshold', () => {
      expect(getScoreColor(85)).toBe('green');
    });

    it('should return yellow for score just below 85 threshold', () => {
      expect(getScoreColor(84.9)).toBe('yellow');
    });

    it('should return yellow for score exactly at 70 threshold', () => {
      expect(getScoreColor(70)).toBe('yellow');
    });

    it('should return orange for score just below 70 threshold', () => {
      expect(getScoreColor(69.9)).toBe('orange');
    });

    it('should return orange for score exactly at 50 threshold', () => {
      expect(getScoreColor(50)).toBe('orange');
    });

    it('should return red for score just below 50 threshold', () => {
      expect(getScoreColor(49.9)).toBe('red');
    });
  });
});

describe('formatScore', () => {
  describe('whole numbers', () => {
    it('should format score of 85 as "85%"', () => {
      expect(formatScore(85)).toBe('85%');
    });

    it('should format score of 100 as "100%"', () => {
      expect(formatScore(100)).toBe('100%');
    });

    it('should format score of 0 as "0%"', () => {
      expect(formatScore(0)).toBe('0%');
    });
  });

  describe('decimal numbers', () => {
    it('should round 85.4 down to "85%"', () => {
      expect(formatScore(85.4)).toBe('85%');
    });

    it('should round 85.5 up to "86%"', () => {
      expect(formatScore(85.5)).toBe('86%');
    });

    it('should round 85.7 up to "86%"', () => {
      expect(formatScore(85.7)).toBe('86%');
    });

    it('should round 99.9 up to "100%"', () => {
      expect(formatScore(99.9)).toBe('100%');
    });

    it('should round 0.4 down to "0%"', () => {
      expect(formatScore(0.4)).toBe('0%');
    });

    it('should round 0.5 up to "1%"', () => {
      expect(formatScore(0.5)).toBe('1%');
    });
  });

  describe('edge cases', () => {
    it('should handle very small decimals', () => {
      expect(formatScore(0.1)).toBe('0%');
    });

    it('should handle values close to 100', () => {
      expect(formatScore(99.4)).toBe('99%');
      expect(formatScore(99.5)).toBe('100%');
    });
  });
});

describe('getScoreLabel', () => {
  describe('excellent label', () => {
    it('should return "Excellent" for score of 85', () => {
      expect(getScoreLabel(85)).toBe('Excellent');
    });

    it('should return "Excellent" for score of 90', () => {
      expect(getScoreLabel(90)).toBe('Excellent');
    });

    it('should return "Excellent" for score of 100', () => {
      expect(getScoreLabel(100)).toBe('Excellent');
    });
  });

  describe('good label', () => {
    it('should return "Good" for score of 70', () => {
      expect(getScoreLabel(70)).toBe('Good');
    });

    it('should return "Good" for score of 75', () => {
      expect(getScoreLabel(75)).toBe('Good');
    });

    it('should return "Good" for score of 84', () => {
      expect(getScoreLabel(84)).toBe('Good');
    });
  });

  describe('fair label', () => {
    it('should return "Fair" for score of 50', () => {
      expect(getScoreLabel(50)).toBe('Fair');
    });

    it('should return "Fair" for score of 60', () => {
      expect(getScoreLabel(60)).toBe('Fair');
    });

    it('should return "Fair" for score of 69', () => {
      expect(getScoreLabel(69)).toBe('Fair');
    });
  });

  describe('poor label', () => {
    it('should return "Poor" for score of 49', () => {
      expect(getScoreLabel(49)).toBe('Poor');
    });

    it('should return "Poor" for score of 30', () => {
      expect(getScoreLabel(30)).toBe('Poor');
    });

    it('should return "Poor" for score of 0', () => {
      expect(getScoreLabel(0)).toBe('Poor');
    });
  });

  describe('boundary values', () => {
    it('should return "Excellent" for score exactly at 85 threshold', () => {
      expect(getScoreLabel(85)).toBe('Excellent');
    });

    it('should return "Good" for score just below 85 threshold', () => {
      expect(getScoreLabel(84.9)).toBe('Good');
    });

    it('should return "Good" for score exactly at 70 threshold', () => {
      expect(getScoreLabel(70)).toBe('Good');
    });

    it('should return "Fair" for score just below 70 threshold', () => {
      expect(getScoreLabel(69.9)).toBe('Fair');
    });

    it('should return "Fair" for score exactly at 50 threshold', () => {
      expect(getScoreLabel(50)).toBe('Fair');
    });

    it('should return "Poor" for score just below 50 threshold', () => {
      expect(getScoreLabel(49.9)).toBe('Poor');
    });
  });
});

describe('score functions consistency', () => {
  it('should have consistent thresholds across all functions', () => {
    // Test that all three functions use the same thresholds
    const testScores = [100, 85, 84, 70, 69, 50, 49, 0];
    
    testScores.forEach(score => {
      const color = getScoreColor(score);
      const label = getScoreLabel(score);
      
      // Verify color and label match
      if (score >= 85) {
        expect(color).toBe('green');
        expect(label).toBe('Excellent');
      } else if (score >= 70) {
        expect(color).toBe('yellow');
        expect(label).toBe('Good');
      } else if (score >= 50) {
        expect(color).toBe('orange');
        expect(label).toBe('Fair');
      } else {
        expect(color).toBe('red');
        expect(label).toBe('Poor');
      }
    });
  });

  it('should format scores consistently with color and label', () => {
    const score = 85.7;
    
    expect(getScoreColor(score)).toBe('green');
    expect(getScoreLabel(score)).toBe('Excellent');
    expect(formatScore(score)).toBe('86%');
  });
});
