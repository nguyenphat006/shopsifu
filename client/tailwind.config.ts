import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#D0201C',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
      },
    },
  },
  darkMode: 'class', // Hoặc 'media' nếu bạn muốn tự động theo OS
  plugins: [],
};

export default config;
