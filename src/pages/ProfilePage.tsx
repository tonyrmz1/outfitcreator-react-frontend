import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../contexts';
import { useClothingItems } from '../hooks/useClothingItems';
import { useOutfits } from '../hooks/useOutfits';
import { profileSchema } from '../schemas/auth.schemas';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { ErrorMessage } from '../components/ErrorMessage';
import type { ProfileFormData } from '../types';

/**
 * ProfilePage Component
 * 
 * User profile management interface that displays user information,
 * account statistics, and provides profile update functionality.
 * 
 * Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 12.1, 12.2, 14.2
 */
export function ProfilePage() {
  const { user, logout, updateProfile } = useAuth();
  const { pagination: itemsPagination, fetchItems } = useClothingItems();
  const { pagination: outfitsPagination, fetchOutfits } = useOutfits();
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [statsLoading, setStatsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
    },
  });

  // Fetch statistics on mount
  useEffect(() => {
    const fetchStats = async () => {
      setStatsLoading(true);
      try {
        await Promise.all([
          fetchItems(undefined, 0),
          fetchOutfits(0),
        ]);
      } catch (error) {
        // Silently fail - stats are not critical
        console.error('Failed to fetch statistics:', error);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Reset form when user data changes
  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setUpdateError(null);
      setUpdateSuccess(false);
      await updateProfile(data);
      setUpdateSuccess(true);
      // Clear success message after 3 seconds
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        'Failed to update profile. Please try again.';
      setUpdateError(message);
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage your account information and view your wardrobe statistics
          </p>
        </div>

        {/* Account Statistics */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Account Statistics
          </h2>
          {statsLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-600">Total Items</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {itemsPagination.totalElements}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-600">Total Outfits</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {outfitsPagination.totalElements}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Profile Update Form */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Profile Information
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="First name"
                type="text"
                {...register('firstName')}
                error={errors.firstName?.message}
                placeholder="John"
                disabled={isSubmitting}
              />

              <Input
                label="Last name"
                type="text"
                {...register('lastName')}
                error={errors.lastName?.message}
                placeholder="Doe"
                disabled={isSubmitting}
              />
            </div>

            <Input
              label="Email address"
              type="email"
              {...register('email')}
              error={errors.email?.message}
              placeholder="you@example.com"
              disabled={isSubmitting}
            />

            {updateError && (
              <ErrorMessage
                message={updateError}
                onDismiss={() => setUpdateError(null)}
              />
            )}

            {updateSuccess && (
              <div
                className="rounded-md bg-green-50 p-4"
                role="alert"
                aria-live="polite"
              >
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-green-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">
                      Profile updated successfully
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <Button
                type="submit"
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Updating...' : 'Update Profile'}
              </Button>
            </div>
          </form>
        </div>

        {/* Logout Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Account Actions
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Sign out of your account to end your current session.
          </p>
          <Button variant="danger" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
