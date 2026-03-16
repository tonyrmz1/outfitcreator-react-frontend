import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Logo } from '../common/Logo';
import type { User } from '../../types';

export interface NavigationProps {
  user: User | null;
  onLogout: () => void;
}

export function Navigation({ user, onLogout }: NavigationProps) {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: '/closet', label: 'Closet' },
    { path: '/outfits', label: 'Outfits' },
    { path: '/recommendations', label: 'Recommendations' },
    { path: '/profile', label: 'Profile' },
  ];

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center">
            <Link to="/closet" className="flex items-center">
              <Logo size="sm" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${
                  isActive(link.path)
                    ? 'bg-accent text-white'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* User Info and Logout (Desktop) */}
          {user && (
            <div className="hidden md:flex md:items-center md:space-x-4">
              <span className="text-sm text-gray-700">
                {user.firstName} {user.lastName}
              </span>
              <button
                onClick={onLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-secondary rounded-md hover:opacity-80 transition-opacity"
              >
                Logout
              </button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive(link.path)
                    ? 'bg-accent text-white'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          {user && (
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="px-4 mb-3">
                <div className="text-base font-medium text-gray-800">
                  {user.firstName} {user.lastName}
                </div>
                <div className="text-sm text-gray-500">{user.email}</div>
              </div>
              <div className="px-2">
                <button
                  onClick={() => {
                    onLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white bg-secondary hover:opacity-80 transition-opacity"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
