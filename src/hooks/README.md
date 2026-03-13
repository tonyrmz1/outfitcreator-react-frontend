# Custom Hooks

This directory contains custom React hooks for state management and business logic.

## useAuth

The `useAuth` hook manages authentication state and provides methods for user authentication operations.

### Usage

```typescript
import { useAuth } from './hooks';

function MyComponent() {
  const { user, isAuthenticated, isLoading, login, register, logout, updateProfile } = useAuth();

  // Check if user is authenticated
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return <div>Welcome, {user.firstName}!</div>;
}
```

### API

#### State

- `user: User | null` - The currently authenticated user, or null if not authenticated
- `isAuthenticated: boolean` - True if a user is logged in
- `isLoading: boolean` - True while checking for an existing session on mount

#### Methods

- `login(credentials: LoginRequest): Promise<void>` - Authenticates a user with email and password
- `register(data: RegisterRequest): Promise<void>` - Creates a new account and automatically logs in
- `logout(): void` - Logs out the current user and clears the session
- `updateProfile(data: Partial<User>): Promise<void>` - Updates the current user's profile information

### Features

- **Automatic Session Restoration**: On mount, checks localStorage for an existing JWT token and restores the session
- **Auto-login After Registration**: After successful registration, automatically logs in the user
- **Token Management**: Stores and removes JWT tokens in localStorage
- **Error Handling**: Removes invalid tokens if session restoration fails

### Requirements Satisfied

This hook satisfies the following requirements from the spec:

- **1.1**: User login with credentials
- **1.2**: JWT token storage and authentication
- **1.3**: Error handling for invalid credentials
- **1.7**: User logout functionality
- **2.1**: JWT token storage in localStorage
- **2.2**: Automatic token inclusion in API requests (via API client)
- **2.5**: Session restoration on app load
- **10.2**: Profile update functionality
- **10.3**: Profile update success handling
- **18.1**: Token storage in localStorage
- **18.2**: Token check on app load
- **18.3**: Automatic session restoration
- **18.4**: Invalid token removal
- **18.5**: Token removal on logout

## useClothingItems

The `useClothingItems` hook manages clothing items state and provides methods for CRUD operations with optimistic updates.

### Usage

```typescript
import { useClothingItems } from './hooks';

function ClosetPage() {
  const {
    items,
    pagination,
    isLoading,
    error,
    fetchItems,
    createItem,
    updateItem,
    deleteItem,
    uploadPhoto
  } = useClothingItems();

  useEffect(() => {
    fetchItems();
  }, []);

  const handleCreate = async (data: ClothingItemFormData, photo?: File) => {
    try {
      await createItem(data, photo);
      // Item is already optimistically added to the list
    } catch (error) {
      // Error is handled, optimistic update reverted
    }
  };

  return (
    <div>
      {isLoading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} />}
      {items.map(item => <ItemCard key={item.id} item={item} />)}
    </div>
  );
}
```

### API

#### State

- `items: ClothingItem[]` - Array of clothing items
- `pagination: PaginationState` - Pagination information (page, size, totalPages, totalElements)
- `isLoading: boolean` - True while fetching items
- `error: string | null` - Error message if an operation failed

#### Methods

- `fetchItems(filters?: ClothingItemFilters, page?: number): Promise<void>` - Fetches clothing items with optional filters and pagination
- `createItem(data: ClothingItemFormData, photo?: File): Promise<ClothingItem>` - Creates a new clothing item with optional photo
- `updateItem(id: number, data: ClothingItemFormData): Promise<ClothingItem>` - Updates an existing clothing item
- `deleteItem(id: number): Promise<void>` - Deletes a clothing item
- `uploadPhoto(id: number, photo: File): Promise<ClothingItem>` - Uploads a photo for an existing item

### Features

- **Optimistic Updates**: All mutations (create, update, delete) immediately update the UI before the API call completes
- **Automatic Rollback**: If an API call fails, the optimistic update is automatically reverted
- **Error Handling**: Sets error state and throws errors for proper error handling in components
- **Pagination Support**: Manages pagination state automatically when fetching items
- **Filter Support**: Supports filtering by category, season, color, and search query

### Optimistic Update Behavior

#### Create
1. Immediately adds a temporary item to the list with a temporary ID
2. Makes API call to create the item
3. On success: Replaces temporary item with the real item from the server
4. On failure: Removes the temporary item and sets error state

#### Update
1. Stores the original item for rollback
2. Immediately updates the item in the list
3. Makes API call to update the item
4. On success: Replaces with the updated item from the server
5. On failure: Reverts to the original item and sets error state

#### Delete
1. Stores the original item for rollback
2. Immediately removes the item from the list
3. Makes API call to delete the item
4. On success: Item remains removed
5. On failure: Re-adds the item to the list and sets error state

### Requirements Satisfied

This hook satisfies the following requirements from the spec:

- **3.1**: Create clothing item with valid data
- **3.2**: Require name, primary color, and category
- **3.3**: Include optional attributes
- **3.4**: Update clothing item
- **3.5**: Delete clothing item
- **4.6**: Upload photo for existing item
- **5.1**: Fetch and display clothing items
- **5.2**: Display item details
- **21.1**: Optimistic update for create
- **21.2**: Optimistic update for delete
- **21.3**: Optimistic update for update
- **21.4**: Revert optimistic updates on failure

