/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom color palette
        background: '#C4EEF2',
        primary: {
          DEFAULT: '#3E848C',
          50: '#E8F4F5',
          100: '#D1E9EB',
          200: '#A3D3D7',
          300: '#75BDC3',
          400: '#5CA1A8',
          500: '#3E848C',
          600: '#326A70',
          700: '#254F54',
          800: '#193538',
          900: '#0C1A1C',
        },
        secondary: {
          DEFAULT: '#025159',
          50: '#E6F2F3',
          100: '#CCE5E7',
          200: '#99CBCF',
          300: '#66B1B7',
          400: '#33979F',
          500: '#025159',
          600: '#024147',
          700: '#013135',
          800: '#012023',
          900: '#001012',
        },
        accent: {
          DEFAULT: '#A67458',
          50: '#F5EDE8',
          100: '#EBDBD1',
          200: '#D7B7A3',
          300: '#C39375',
          400: '#B58367',
          500: '#A67458',
          600: '#855D46',
          700: '#644635',
          800: '#422E23',
          900: '#211712',
        },
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
