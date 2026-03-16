/**
 * Theme type definitions and constants for the theme color selector feature
 */

export interface Theme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    tertiary: string;
  };
}

export const THEMES: Record<string, Theme> = {
  'brown-tan': {
    id: 'brown-tan',
    name: 'Brown/Tan',
    colors: {
      primary: '#F5F1E8',
      secondary: '#8B7355',
      accent: '#3D3D2D',
      tertiary: '#C89B7B',
    },
  },
  'blue': {
    id: 'blue',
    name: 'Blue',
    colors: {
      primary: '#3E848C',
      secondary: '#025159',
      accent: '#A67458',
      tertiary: '#C4EEF2',
    },
  },
  'green': {
    id: 'green',
    name: 'Green',
    colors: {
      primary: '#D4A373',
      secondary: '#8BA888',
      accent: '#4D6B4F',
      tertiary: '#F4F6F1',
    },
  },
};

export const DEFAULT_THEME_ID = 'brown-tan';
