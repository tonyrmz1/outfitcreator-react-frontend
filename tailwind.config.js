/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        tertiary: 'var(--color-tertiary)',
      },
      screens: {
        'sm': '768px',   // tablet
        'md': '1024px',  // desktop
        'lg': '1280px',
        'xl': '1536px',
      },
    },
  },
  plugins: [],
}
