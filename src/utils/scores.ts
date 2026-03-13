/**
 * Score display utility functions for outfit recommendations
 * 
 * These functions provide consistent formatting and visualization
 * of compatibility scores across the application.
 */

/**
 * Returns a color indicator based on the score threshold
 * 
 * @param score - Compatibility score between 0 and 100
 * @returns Color string: 'green' (≥85), 'yellow' (≥70), 'orange' (≥50), or 'red' (<50)
 * 
 * @example
 * getScoreColor(90) // returns 'green'
 * getScoreColor(75) // returns 'yellow'
 * getScoreColor(55) // returns 'orange'
 * getScoreColor(40) // returns 'red'
 */
export function getScoreColor(score: number): string {
  if (score >= 85) {
    return 'green'; // Excellent compatibility
  } else if (score >= 70) {
    return 'yellow'; // Good compatibility
  } else if (score >= 50) {
    return 'orange'; // Fair compatibility
  } else {
    return 'red'; // Poor compatibility
  }
}

/**
 * Formats a score as a percentage string with no decimal places
 * 
 * @param score - Numeric score value
 * @returns Formatted percentage string (e.g., "85%")
 * 
 * @example
 * formatScore(85.7) // returns "86%"
 * formatScore(70) // returns "70%"
 */
export function formatScore(score: number): string {
  return `${Math.round(score)}%`;
}

/**
 * Returns a descriptive label based on the score threshold
 * 
 * @param score - Compatibility score between 0 and 100
 * @returns Label string: 'Excellent' (≥85), 'Good' (≥70), 'Fair' (≥50), or 'Poor' (<50)
 * 
 * @example
 * getScoreLabel(90) // returns 'Excellent'
 * getScoreLabel(75) // returns 'Good'
 * getScoreLabel(55) // returns 'Fair'
 * getScoreLabel(40) // returns 'Poor'
 */
export function getScoreLabel(score: number): string {
  if (score >= 85) {
    return 'Excellent';
  } else if (score >= 70) {
    return 'Good';
  } else if (score >= 50) {
    return 'Fair';
  } else {
    return 'Poor';
  }
}
