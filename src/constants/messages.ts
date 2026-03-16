// Message constants
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'Unauthorized. Please log in again.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
  SESSION_EXPIRED: 'Your session has expired. Please log in again.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  EMAIL_ALREADY_EXISTS: 'This email is already registered.',
  WEAK_PASSWORD: 'Password does not meet security requirements.',
} as const;

export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Logged in successfully.',
  LOGOUT_SUCCESS: 'Logged out successfully.',
  REGISTRATION_SUCCESS: 'Account created successfully.',
  ITEM_CREATED: 'Clothing item created successfully.',
  ITEM_UPDATED: 'Clothing item updated successfully.',
  ITEM_DELETED: 'Clothing item deleted successfully.',
  OUTFIT_CREATED: 'Outfit created successfully.',
  OUTFIT_UPDATED: 'Outfit updated successfully.',
  OUTFIT_DELETED: 'Outfit deleted successfully.',
} as const;

export const INFO_MESSAGES = {
  LOADING: 'Loading...',
  NO_ITEMS: 'No items found.',
  NO_OUTFITS: 'No outfits found.',
  NO_RECOMMENDATIONS: 'No recommendations available.',
} as const;

export const VALIDATION_MESSAGES = {
  REQUIRED_FIELD: 'This field is required.',
  INVALID_EMAIL: 'Please enter a valid email address.',
  PASSWORD_TOO_SHORT: 'Password must be at least 8 characters.',
  PASSWORDS_DO_NOT_MATCH: 'Passwords do not match.',
  INVALID_FILE_TYPE: 'Invalid file type. Please upload an image.',
  FILE_TOO_LARGE: 'File size must be less than 5MB.',
} as const;
