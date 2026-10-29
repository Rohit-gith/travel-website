/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Primary: emerald green (logo, links, headings accents)
        brand: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        // Secondary: warm gold (call-to-action highlights)
        accent: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        },
        sand: {
          50: '#fdf9f3',
          100: '#f9efdf',
          500: '#e0a458',
        },
        // WhatsApp brand colours
        wa: {
          DEFAULT: '#25D366',
          dark: '#128C7E',
          deep: '#075E54',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      boxShadow: {
        card: '0 10px 30px -12px rgba(15, 23, 42, 0.25)',
        glow: '0 20px 50px -15px rgba(5, 150, 105, 0.45)',
      },
      // NOTE: animations (blink, WhatsApp glow, fade-up, progress) live in src/index.css
    },
  },
  plugins: [],
};