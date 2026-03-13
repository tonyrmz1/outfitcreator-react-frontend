import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ProtectedRoute } from './components/ProtectedRoute';
import { MainLayout } from './components/MainLayout';
import { LoadingSpinner } from './components/LoadingSpinner';
import { useAutoLogout } from './hooks/useAutoLogout';

// Code-split page components using React.lazy
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ClosetPage = lazy(() => import('./pages/ClosetPage'));
const OutfitsPage = lazy(() => import('./pages/OutfitsPage'));
const RecommendationsPage = lazy(() => import('./pages/RecommendationsPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));

function AppRoutes() {
  const { isAuthenticated, isLoading } = useAuth();

  // Enable auto-logout for authenticated users
  useAutoLogout();

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to="/closet" replace />
          ) : (
            <Suspense fallback={<LoadingSpinner fullScreen />}>
              <LoginPage />
            </Suspense>
          )
        }
      />
      <Route
        path="/register"
        element={
          isAuthenticated ? (
            <Navigate to="/closet" replace />
          ) : (
            <Suspense fallback={<LoadingSpinner fullScreen />}>
              <RegisterPage />
            </Suspense>
          )
        }
      />

      {/* Protected routes with MainLayout */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route
          index
          element={<Navigate to="/closet" replace />}
        />
        <Route
          path="closet"
          element={
            <Suspense fallback={<LoadingSpinner fullScreen />}>
              <ClosetPage />
            </Suspense>
          }
        />
        <Route
          path="outfits"
          element={
            <Suspense fallback={<LoadingSpinner fullScreen />}>
              <OutfitsPage />
            </Suspense>
          }
        />
        <Route
          path="recommendations"
          element={
            <Suspense fallback={<LoadingSpinner fullScreen />}>
              <RecommendationsPage />
            </Suspense>
          }
        />
        <Route
          path="profile"
          element={
            <Suspense fallback={<LoadingSpinner fullScreen />}>
              <ProfilePage />
            </Suspense>
          }
        />
      </Route>

      {/* Catch-all redirect */}
      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? "/closet" : "/login"} replace />}
      />
    </Routes>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
