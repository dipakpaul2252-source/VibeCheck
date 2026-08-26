/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        canvas: {
          light: '#F4F0EA',
          dark: '#0F0F11',
        },
        surface: {
          light: '#FFFFFF',
          dark: '#18181B',
        },
        accent: {
          yellow: '#E2F952',
          lilac: '#C084FC',
          coral: '#FF5C00',
          cyan: '#00F0FF',
          emerald: '#10B981',
          crimson: '#EF4444',
        },
      },
      boxShadow: {
        brutal: '4px 4px 0px 0px #000000',
        'brutal-hover': '6px 6px 0px 0px #000000',
        'brutal-lg': '8px 8px 0px 0px #000000',
        'brutal-sm': '2px 2px 0px 0px #000000',
        'brutal-dark': '4px 4px 0px 0px #E2F952',
      },
      borderWidth: {
        3: '3px',
      },
      fontFamily: {
        display: ['Space Grotesk', 'system-ui', 'sans-serif'],
        mono: ['Space Mono', 'Courier New', 'monospace'],
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-1deg) translate(0px, 0px)' },
          '50%': { transform: 'rotate(1deg) translate(1px, -1px)' },
        },
        scan: {
          '0%, 100%': { top: '0%' },
          '50%': { top: '100%' },
        },
      },
      animation: {
        marquee: 'marquee 25s linear infinite',
        wiggle: 'wiggle 0.15s ease-in-out infinite',
        scan: 'scan 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
