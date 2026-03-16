import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../contexts';
import { loginSchema } from '../schemas/auth.schemas';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { Logo } from '../components/common/Logo';
import type { LoginFormData } from '../types';

/**
 * LoginPage Component
 * 
 * Provides user authentication interface with email and password inputs.
 * Integrates react-hook-form with Zod validation and redirects to /closet on success.
 * 
 * Requirements: 1.1, 1.2, 1.3, 11.5, 12.1, 12.2, 12.4, 12.5, 12.6, 14.2
 */
export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setAuthError(null);
      await login(data);
      // Force a hard redirect to ensure auth state is properly initialized
      window.location.href = '/closet';
    } catch (error: any) {
      const message = error.response?.data?.message || 'Invalid email or password';
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
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-primary">
            Or{' '}
            <Link
              to="/register"
              className="font-medium text-primary hover:text-primary-600"
            >
              create a new account
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
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
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
