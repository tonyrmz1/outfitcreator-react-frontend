import { describe, it, expect } from 'vitest';
import {
  User,
  ClothingItem,
  Outfit,
  OutfitItem,
  OutfitRecommendation,
  ClothingCategory,
  Season,
  FitCategory,
  ItemPosition,
  LoginFormData,
  RegisterFormData,
  ProfileFormData,
  ClothingItemFormData,
  OutfitFormData,
  OutfitItemSelection,
  ApiResponse,
  PaginatedResponse,
  ErrorResponse,
  ClothingItemFilters,
  RecommendationFilters,
  PaginationState,
  ValidationResult,
  SelectOption,
} from './index';

describe('Type Definitions', () => {
  it('should define User type correctly', () => {
    const user: User = {
      id: 1,
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    };

    expect(user.id).toBe(1);
    expect(user.email).toBe('test@example.com');
  });

  it('should define ClothingItem type correctly', () => {
    const item: ClothingItem = {
      id: 1,
      name: 'Blue Jeans',
      brand: "Levi's",
      primaryColor: 'blue',
      secondaryColor: 'white',
      category: ClothingCategory.BOTTOM,
      size: 'M',
      season: Season.ALL_SEASON,
      fitCategory: FitCategory.REGULAR,
      purchaseDate: '2024-01-01',
      photoUrl: 'https://example.com/photo.jpg',
      wearCount: 5,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    };

    expect(item.name).toBe('Blue Jeans');
    expect(item.category).toBe(ClothingCategory.BOTTOM);
  });

  it('should define Outfit type correctly', () => {
    const outfit: Outfit = {
      id: 1,
      name: 'Casual Friday',
      notes: 'Comfortable outfit for work',
      items: [],
      isComplete: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    };

    expect(outfit.name).toBe('Casual Friday');
    expect(outfit.isComplete).toBe(true);
  });

  it('should define OutfitRecommendation type correctly', () => {
    const recommendation: OutfitRecommendation = {
      items: [],
      colorCompatibilityScore: 85,
      fitCompatibilityScore: 90,
      overallScore: 87.5,
      seasonalAppropriateness: 'APPROPRIATE',
      itemPositions: {},
      explanation: 'Great color combination',
    };

    expect(recommendation.overallScore).toBe(87.5);
    expect(recommendation.seasonalAppropriateness).toBe('APPROPRIATE');
  });

  it('should define form data types correctly', () => {
    const loginForm: LoginFormData = {
      email: 'test@example.com',
      password: 'password123',
    };

    const registerForm: RegisterFormData = {
      email: 'test@example.com',
      password: 'Password123',
      confirmPassword: 'Password123',
      firstName: 'John',
      lastName: 'Doe',
    };

    const profileForm: ProfileFormData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@example.com',
    };

    const itemForm: ClothingItemFormData = {
      name: 'Blue Jeans',
      primaryColor: 'blue',
      category: ClothingCategory.BOTTOM,
    };

    const outfitForm: OutfitFormData = {
      name: 'Casual Friday',
      items: [],
    };

    expect(loginForm.email).toBe('test@example.com');
    expect(registerForm.confirmPassword).toBe('Password123');
    expect(profileForm.firstName).toBe('John');
    expect(itemForm.name).toBe('Blue Jeans');
    expect(outfitForm.name).toBe('Casual Friday');
  });

  it('should define API response types correctly', () => {
    const apiResponse: ApiResponse<User> = {
      data: {
        id: 1,
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
      message: 'Success',
    };

    const paginatedResponse: PaginatedResponse<ClothingItem> = {
      content: [],
      page: 0,
      size: 20,
      totalElements: 0,
      totalPages: 0,
    };

    const errorResponse: ErrorResponse = {
      timestamp: '2024-01-01T00:00:00Z',
      status: 400,
      error: 'Bad Request',
      message: 'Invalid input',
      errorCode: 'VALIDATION_ERROR',
    };

    expect(apiResponse.data.id).toBe(1);
    expect(paginatedResponse.page).toBe(0);
    expect(errorResponse.status).toBe(400);
  });

  it('should define filter types correctly', () => {
    const itemFilters: ClothingItemFilters = {
      category: ClothingCategory.TOP,
      season: Season.SUMMER,
      color: 'blue',
      searchQuery: 'shirt',
    };

    const recFilters: RecommendationFilters = {
      season: Season.SPRING,
      occasion: 'casual',
      colorPreference: 'blue',
      limit: 10,
    };

    expect(itemFilters.category).toBe(ClothingCategory.TOP);
    expect(recFilters.limit).toBe(10);
  });

  it('should define utility types correctly', () => {
    const pagination: PaginationState = {
      page: 0,
      size: 20,
      totalPages: 5,
      totalElements: 100,
    };

    const validation: ValidationResult = {
      isValid: true,
      errors: [],
    };

    const option: SelectOption = {
      value: 'top',
      label: 'Top',
    };

    expect(pagination.page).toBe(0);
    expect(validation.isValid).toBe(true);
    expect(option.value).toBe('top');
  });

  it('should define all enum values correctly', () => {
    expect(ClothingCategory.TOP).toBe('TOP');
    expect(ClothingCategory.BOTTOM).toBe('BOTTOM');
    expect(ClothingCategory.FOOTWEAR).toBe('FOOTWEAR');
    expect(ClothingCategory.OUTERWEAR).toBe('OUTERWEAR');
    expect(ClothingCategory.ACCESSORIES).toBe('ACCESSORIES');

    expect(Season.SPRING).toBe('SPRING');
    expect(Season.SUMMER).toBe('SUMMER');
    expect(Season.AUTUMN).toBe('AUTUMN');
    expect(Season.WINTER).toBe('WINTER');
    expect(Season.ALL_SEASON).toBe('ALL_SEASON');

    expect(FitCategory.TIGHT).toBe('TIGHT');
    expect(FitCategory.REGULAR).toBe('REGULAR');
    expect(FitCategory.LOOSE).toBe('LOOSE');
    expect(FitCategory.OVERSIZED).toBe('OVERSIZED');

    expect(ItemPosition.TOP).toBe('TOP');
    expect(ItemPosition.BOTTOM).toBe('BOTTOM');
    expect(ItemPosition.FOOTWEAR).toBe('FOOTWEAR');
    expect(ItemPosition.OUTERWEAR).toBe('OUTERWEAR');
    expect(ItemPosition.ACCESSORY).toBe('ACCESSORY');
  });
});
