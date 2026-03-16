import { useTheme } from '../../../hooks/theme/useTheme';

export interface ThemeSelectorProps {
  className?: string;
}

/**
 * ThemeSelector component that displays all available themes as selectable options
 * Shows color palette preview for each theme (4 color swatches)
 * Highlights the currently selected theme
 * Handles theme selection with onClick handler
 */
export function ThemeSelector({ className = '' }: ThemeSelectorProps) {
  const { currentTheme, themes, setTheme } = useTheme();

  const handleThemeSelect = (themeId: string) => {
    setTheme(themeId);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {themes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => handleThemeSelect(theme.id)}
            className={`relative rounded-lg border-2 p-4 transition-all ${
              currentTheme.id === theme.id
                ? 'border-secondary bg-tertiary shadow-lg'
                : 'border-gray-300 hover:border-secondary'
            }`}
            aria-pressed={currentTheme.id === theme.id}
            aria-label={`Select ${theme.name} theme`}
          >
            {/* Theme name */}
            <div className="mb-3 text-left">
              <h3 className="font-semibold text-secondary">{theme.name}</h3>
            </div>

            {/* Color palette preview - 4 swatches */}
            <div className="flex gap-2">
              <div
                className="h-8 w-8 rounded border border-gray-300"
                style={{ backgroundColor: theme.colors.primary }}
                title={`Primary: ${theme.colors.primary}`}
              />
              <div
                className="h-8 w-8 rounded border border-gray-300"
                style={{ backgroundColor: theme.colors.secondary }}
                title={`Secondary: ${theme.colors.secondary}`}
              />
              <div
                className="h-8 w-8 rounded border border-gray-300"
                style={{ backgroundColor: theme.colors.accent }}
                title={`Accent: ${theme.colors.accent}`}
              />
              <div
                className="h-8 w-8 rounded border border-gray-300"
                style={{ backgroundColor: theme.colors.tertiary }}
                title={`Tertiary: ${theme.colors.tertiary}`}
              />
            </div>

            {/* Selection indicator */}
            {currentTheme.id === theme.id && (
              <div className="absolute right-3 top-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary">
                  <svg
                    className="h-4 w-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
