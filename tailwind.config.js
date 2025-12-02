/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Dizzy Otter Brand Colors
        'primary-navy': {
          DEFAULT: '#1A1F36',
          80: 'rgba(26, 31, 54, 0.8)',
          60: 'rgba(26, 31, 54, 0.6)',
          40: 'rgba(26, 31, 54, 0.4)',
          20: 'rgba(26, 31, 54, 0.2)',
          10: 'rgba(26, 31, 54, 0.1)',
        },
        'accent-blue': {
          DEFAULT: '#2979FF',
          80: 'rgba(41, 121, 255, 0.8)',
          60: 'rgba(41, 121, 255, 0.6)',
          40: 'rgba(41, 121, 255, 0.4)',
          20: 'rgba(41, 121, 255, 0.2)',
          10: 'rgba(41, 121, 255, 0.1)',
        },
        'highlight-teal': {
          DEFAULT: '#50E3C2',
          80: 'rgba(80, 227, 194, 0.8)',
          60: 'rgba(80, 227, 194, 0.6)',
          40: 'rgba(80, 227, 194, 0.4)',
          20: 'rgba(80, 227, 194, 0.2)',
          10: 'rgba(80, 227, 194, 0.1)',
        },
        'secondary-light': {
          DEFAULT: '#F2F4F8',
          80: 'rgba(242, 244, 248, 0.8)',
          60: 'rgba(242, 244, 248, 0.6)',
          40: 'rgba(242, 244, 248, 0.4)',
          20: 'rgba(242, 244, 248, 0.2)',
          10: 'rgba(242, 244, 248, 0.1)',
        },
        // Legacy colors (kept for backwards compatibility)
        primary: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
          950: '#042f2e',
        },
        charcoal: {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b',
          950: '#09090b',
        },
        slate: {
          950: '#020617',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        // Dizzy Otter Typography Scale
        'h1': ['4.5rem', { lineHeight: '1.1', fontWeight: '800' }],      // 72px
        'h2': ['2.5rem', { lineHeight: '1.2', fontWeight: '700' }],      // 40px
        'h3': ['1.8rem', { lineHeight: '1.3', fontWeight: '600' }],      // 28.8px
        'body': ['1.1rem', { lineHeight: '1.6', fontWeight: '400' }],    // 17.6px
        'small': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }], // 14px
      },
      borderRadius: {
        'sm': '4px',
        DEFAULT: '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
      },
      spacing: {
        '18': '4.5rem',
        'card': '1.5rem',     // 24px - card padding
        'section': '2rem',    // 32px - section spacing
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(26, 31, 54, 0.1), 0 2px 4px -1px rgba(26, 31, 54, 0.06)',
        'card-hover': '0 10px 15px -3px rgba(26, 31, 54, 0.15), 0 4px 6px -2px rgba(26, 31, 54, 0.1)',
        'lg-dark': '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
    },
  },
  plugins: [],
}
