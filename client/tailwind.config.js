/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#7c3aed',
          hover: '#6d28d9',
          light: '#a78bfa',
          dark: '#5b21b6',
        },
        'primary-hover': '#6d28d9',
        'primary-light': '#a78bfa',
        'primary-dark': '#5b21b6',
        secondary: '#9333ea',
        accent: '#c084fc',
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6',
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #7c3aed 0%, #9333ea 100%)',
        'gradient-light': 'linear-gradient(135deg, #a78bfa 0%, #c084fc 100%)',
      },
      boxShadow: {
        'purple': '0 10px 40px rgba(124, 58, 237, 0.2)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      transitionDuration: {
        '250': '250ms',
        '600': '600ms',
      },
    },
  },
  plugins: [],
}

