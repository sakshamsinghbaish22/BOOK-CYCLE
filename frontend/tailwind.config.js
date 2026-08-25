/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Celestial Amber / Sunbeam Gold Palette matching uploaded floating books image
        amber: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        gold: {
          300: '#ffe082',
          400: '#ffd54f',
          500: '#ffca28',
          600: '#e5a93c',
          700: '#c68a26',
        },
        // Midnight Blue / Cloud Atmosphere
        midnight: {
          950: '#060b13',
          900: '#09101c',
          850: '#0d1626',
          800: '#111d33',
          750: '#162540',
          700: '#1c2f50',
          600: '#263e66',
          500: '#385587',
          400: '#5274aa',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-amber': '0 0 25px -4px rgba(245, 158, 11, 0.45), 0 0 10px -2px rgba(245, 158, 11, 0.3)',
        'glow-gold': '0 0 35px -5px rgba(229, 169, 60, 0.5), 0 0 15px -3px rgba(255, 213, 79, 0.35)',
        'celestial-card': '0 20px 45px -10px rgba(0, 0, 0, 0.8), 0 0 20px -3px rgba(229, 169, 60, 0.15)',
      },
      scale: {
        '102': '1.02',
        '108': '1.08',
      }
    },
  },
  plugins: [],
}
