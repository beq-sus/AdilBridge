/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0B1D3A',
          light: '#162B52',
          mid: '#1E3A6E',
        },
        brand: {
          blue: '#1A56DB',
          blueLight: '#3B82F6',
        },
        accent: {
          DEFAULT: '#C4A962',
          light: '#D4BC7E',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Montserrat', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 4px 24px rgba(11,29,58,0.08)',
        strong: '0 12px 48px rgba(11,29,58,0.15)',
        brand: '0 8px 32px rgba(26,86,219,0.25)',
        gold: '0 8px 24px rgba(196,169,98,0.35)',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        pulseDot: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      animation: {
        fadeUp: 'fadeUp 0.6s ease forwards',
        fadeIn: 'fadeIn 0.4s ease forwards',
        pulseDot: 'pulseDot 2s infinite',
        slideIn: 'slideIn 0.3s ease forwards',
      },
    },
  },
  plugins: [],
};
