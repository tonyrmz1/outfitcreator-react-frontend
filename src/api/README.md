# API Client

This directory contains the base API client and service classes for communicating with the OutfitCreator backend.

## ApiClient

The `ApiClient` class provides a centralized HTTP client with automatic JWT token management and error handling.

### Features

- **Automatic Token Injection**: JWT tokens are automatically added to the `Authorization` header for all requests
- **401 Error Handling**: Automatically removes invalid tokens and redirects to login page
- **Environment Configuration**: Base URL is configured via `VITE_API_BASE_URL` environment variable
- **Type-Safe Methods**: Generic HTTP methods (GET, POST, PUT, DELETE) with TypeScript support
- **FormData Support**: Special method for multipart/form-data uploads

### Usage

```typescript
import apiClient from './api/client';

// GET request
const data = await apiClient.get<User>('/api/users/me');

// POST request
const newItem = await apiClient.post<ClothingItem>('/api/clothing', itemData);

// PUT request
const updated = await apiClient.put<ClothingItem>(`/api/clothing/${id}`, updates);

// DELETE request
await apiClient.delete(`/api/clothing/${id}`);

// FormData upload
const formData = new FormData();
formData.append('photo', file);
const result = await apiClient.postFormData<ClothingItem>('/api/clothing', formData);
```

### Interceptors

#### Request Interceptor
- Retrieves JWT token from `localStorage` (key: `authToken`)
- Adds token to `Authorization` header as `Bearer {token}`
- Passes through requests without modification if no token exists

#### Response Interceptor
- Handles successful responses by returning them unchanged
- Intercepts 401 Unauthorized errors:
  - Removes `authToken` from `localStorage`
  - Redirects to `/login` page
  - Rejects the promise with the error

### Requirements Satisfied

- **Requirement 1.2**: Authentication redirect handling
- **Requirement 25.1**: Automatic JWT token injection
- **Requirement 25.2**: 401 error handling with token removal and redirect
- **Requirement 25.3**: Consistent error handling
- **Requirement 25.4**: Single Axios instance with interceptors

## API Services

The following service classes are built on top of this client:

### AuthAPI

Authentication and user management service.

**Methods:**
- `login(credentials)` - Authenticate user and receive JWT token
- `register(data)` - Create new user account
- `getProfile()` - Get current user profile
- `updateProfile(data)` - Update user profile information

### ClothingItemsAPI

Clothing item CRUD operations with photo upload support.

**Methods:**
- `getAll(filters?, page?, size?)` - Fetch paginated list of clothing items with optional filters
- `getById(id)` - Fetch single clothing item by ID
- `create(data, photo?)` - Create new clothing item with optional photo upload
- `update(id, data)` - Update existing clothing item
- `delete(id)` - Delete clothing item
- `uploadPhoto(id, photo)` - Upload or update photo for existing item

**Usage Example:**

```typescript
import { clothingItemsAPI } from './api';

// Fetch all items with filters
const response = await clothingItemsAPI.getAll(
  { category: ClothingCategory.TOP, season: Season.SUMMER },
  0,
  20
);

// Create item with photo
const formData = {
  name: 'Blue Jeans',
  primaryColor: 'blue',
  category: ClothingCategory.BOTTOM
};
const photo = new File(['...'], 'jeans.jpg', { type: 'image/jpeg' });
const newItem = await clothingItemsAPI.create(formData, photo);

// Update item
const updated = await clothingItemsAPI.update(1, {
  name: 'Updated Name',
  primaryColor: 'dark blue',
  category: ClothingCategory.BOTTOM
});

// Upload photo separately
const updatedItem = await clothingItemsAPI.uploadPhoto(1, photoFile);

// Delete item
await clothingItemsAPI.delete(1);
```

**Requirements Satisfied:**
- **Requirement 3.1**: Create clothing items with API integration
- **Requirement 3.2**: Required fields (name, primaryColor, category)
- **Requirement 3.3**: Optional attributes support
- **Requirement 3.4**: Update with ID and photo URL preservation
- **Requirement 3.5**: Delete with API request
- **Requirement 4.6**: Photo upload for existing items

### Future API Services

The following service classes will be built on top of this client:

- `OutfitsAPI` - Outfit management
- `RecommendationsAPI` - Outfit recommendations
