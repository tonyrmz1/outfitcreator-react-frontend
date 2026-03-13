/**
 * Input sanitization utilities
 * 
 * Provides functions to sanitize user-generated content before display
 * to prevent XSS attacks.
 * 
 * Requirements: 12.1, 12.2
 */

/**
 * Escapes HTML special characters to prevent XSS attacks
 * 
 * @param text - Text to escape
 * @returns Escaped text safe for HTML display
 */
export function escapeHtml(text: string): string {
  const htmlEscapeMap: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };

  return text.replace(/[&<>"'/]/g, (char) => htmlEscapeMap[char] || char);
}

/**
 * Sanitizes text for safe display in HTML
 * Removes or escapes potentially dangerous content
 * 
 * @param text - Text to sanitize
 * @returns Sanitized text
 */
export function sanitizeText(text: string): string {
  if (!text || typeof text !== 'string') {
    return '';
  }

  // Escape HTML characters
  let sanitized = escapeHtml(text);

  // Remove any remaining script tags (defense in depth)
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  return sanitized;
}

/**
 * Sanitizes notes or longer text fields
 * Preserves line breaks but escapes HTML
 * 
 * @param notes - Notes text to sanitize
 * @returns Sanitized notes with preserved line breaks
 */
export function sanitizeNotes(notes: string): string {
  if (!notes || typeof notes !== 'string') {
    return '';
  }

  // Escape HTML but preserve line breaks
  const sanitized = escapeHtml(notes);
  
  // Convert line breaks to <br> tags for display
  return sanitized.replace(/\n/g, '<br>');
}

/**
 * Strips all HTML tags from text
 * Useful for plain text contexts
 * 
 * @param html - HTML string to strip
 * @returns Plain text without HTML tags
 */
export function stripHtml(html: string): string {
  if (!html || typeof html !== 'string') {
    return '';
  }

  // Create a temporary div to parse HTML
  const temp = document.createElement('div');
  temp.innerHTML = html;
  return temp.textContent || temp.innerText || '';
}

/**
 * Validates and sanitizes a URL
 * Ensures URL uses safe protocols (http, https)
 * 
 * @param url - URL to validate
 * @returns Sanitized URL or empty string if invalid
 */
export function sanitizeUrl(url: string): string {
  if (!url || typeof url !== 'string') {
    return '';
  }

  try {
    const parsed = new URL(url);
    
    // Only allow http and https protocols
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return '';
    }

    return parsed.toString();
  } catch {
    // Invalid URL
    return '';
  }
}
