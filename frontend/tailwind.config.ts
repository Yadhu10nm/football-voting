import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0f5132',
        secondary: '#198754',
        accent: '#ffc107',
        surface: '#0c2b1e',
        panel: '#142f24',
      },
      boxShadow: {
        glow: '0 10px 40px rgba(255, 193, 7, 0.18)',
      },
      backgroundImage: {
        stadium: 'radial-gradient(circle at top, rgba(255,255,255,0.08), transparent 40%), linear-gradient(180deg, rgba(15,81,50,0.92), rgba(6,25,13,0.95))',
      },
    },
  },
  plugins: [],
};

export default config;
