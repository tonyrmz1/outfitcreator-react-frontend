import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../contexts';
import { registerSchema } from '../schemas/auth.schemas';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { Logo } from '../components/common/Logo';
import type { RegisterFormData } from '../types';

/**
 * RegisterPage Component
 * 
 * Provides user registration interface with email, password, confirmPassword,
 * firstName, and lastName inputs. Validates password strength and confirmation match.
 * Auto-logs in and redirects to /closet on successful registration.
 * 
 * Requirements: 1.4, 1.5, 1.6, 12.1, 12.2, 12.4, 12.5, 12.6, 14.2
 */
export function RegisterPage() {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setAuthError(null);
      await registerUser(data);
      // Auto-login happens in useAuth, force hard redirect to ensure auth state is initialized
      window.location.href = '/closet';
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        'Registration failed. Please try again.';
      setAuthError(message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="flex justify-center">
          <Logo size="lg" />
        </div>

        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-secondary">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-primary">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-primary hover:text-primary-600"
            >
              Sign in
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
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

            <Input
              label="Password"
              type="password"
              {...register('password')}
              error={errors.password?.message}
              placeholder="Enter your password"
              disabled={isSubmitting}
            />

            <Input
              label="Confirm password"
              type="password"
              {...register('confirmPassword')}
              error={errors.confirmPassword?.message}
              placeholder="Confirm your password"
              disabled={isSubmitting}
            />

            <div className="text-xs text-gray-500 space-y-1">
              <p className="font-medium">Password requirements:</p>
              <ul className="list-disc list-inside space-y-0.5">
                <li>At least 8 characters</li>
                <li>One uppercase letter</li>
                <li>One lowercase letter</li>
                <li>One number</li>
              </ul>
            </div>
          </div>

          {authError && (
            <ErrorMessage
              message={authError}
              onDismiss={() => setAuthError(null)}
            />
          )}

          <Button
            type="submit"
            fullWidth
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating account...' : 'Create account'}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
