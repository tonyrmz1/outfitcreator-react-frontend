// User types
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
}

// Enums
export enum ClothingCategory {
  TOP = 'TOP',
  BOTTOM = 'BOTTOM',
  FOOTWEAR = 'FOOTWEAR',
  OUTERWEAR = 'OUTERWEAR',
  ACCESSORIES = 'ACCESSORIES',
}

export enum Season {
  SPRING = 'SPRING',
  SUMMER = 'SUMMER',
  AUTUMN = 'AUTUMN',
  WINTER = 'WINTER',
  ALL_SEASON = 'ALL_SEASON',
}

export enum FitCategory {
  TIGHT = 'TIGHT',
  REGULAR = 'REGULAR',
  LOOSE = 'LOOSE',
  OVERSIZED = 'OVERSIZED',
}

export enum ItemPosition {
  TOP = 'TOP',
  BOTTOM = 'BOTTOM',
  FOOTWEAR = 'FOOTWEAR',
  OUTERWEAR = 'OUTERWEAR',
  ACCESSORY = 'ACCESSORY',
}

// Clothing item types
export interface ClothingItem {
  id: number;
  name: string;
  brand?: string;
  primaryColor: string;
  secondaryColor?: string;
  category: ClothingCategory;
  size?: string;
  season?: Season;
  fitCategory?: FitCategory;
  purchaseDate?: string;
  photoUrl?: string;
  wearCount: number;
  createdAt: string;
  updatedAt: string;
}

// Outfit types
export interface Outfit {
  id: number;
  name: string;
  notes?: string;
  items: OutfitItem[];
  isComplete: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OutfitItem {
  id: number;
  clothingItem: ClothingItem;
  position: ItemPosition;
}

// Recommendation types
export interface OutfitRecommendation {
  items: ClothingItem[];
  colorCompatibilityScore: number;
  fitCompatibilityScore: number;
  overallScore: number;
  seasonalAppropriateness: 'APPROPRIATE' | 'WARNING' | 'NOT_APPROPRIATE';
  itemPositions: Record<string, string>;
  explanation: string;
}

// API response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  number: number;   // Spring Boot serializes current page as 'number'
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface ErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  errorCode: string;
  fieldErrors?: Record<string, string>;
  path?: string;
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

// Form data types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

export interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
}

export interface ClothingItemFormData {
  name: string;
  brand?: string;
  primaryColor: string;
  secondaryColor?: string;
  category: ClothingCategory;
  size?: string;
  season?: Season;
  fitCategory?: FitCategory;
  purchaseDate?: string;
}

export interface OutfitFormData {
  name: string;
  notes?: string;
  items: OutfitItemSelection[];
}

export interface OutfitItemSelection {
  clothingItemId: number;
  position: ItemPosition;
}

// Filter types
export interface ClothingItemFilters {
  category?: ClothingCategory;
  season?: Season;
  color?: string;
  searchQuery?: string;
}

export interface RecommendationFilters {
  season?: Season;
  occasion?: string;
  colorPreference?: string;
  limit: number;
}

// Pagination state
export interface PaginationState {
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
}

// Validation types
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Component prop types
export interface SelectOption {
  value: string;
  label: string;
}
