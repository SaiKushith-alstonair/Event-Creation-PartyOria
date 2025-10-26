/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        romantic: {
          bg: '#FDF6E3',
          accent1: '#F8C8DC',
          accent2: '#FEF3C7',
          accent3: '#DBEAFE',
          border: '#F8C8DC',
          primary: '#F59E0B',
          dark: '#D97706',
          hover: '#F59E0B',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'wave': 'wave 8s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        wave: {
          '0%, 100%': { transform: 'translateX(-20px) scaleY(0.8)' },
          '50%': { transform: 'translateX(20px) scaleY(1.2)' },
        },
      },
      borderRadius: {
        'romantic': '20px',
      },
      backdropBlur: {
        'romantic': '10px',
      },
    },
  },
  plugins: [],
}