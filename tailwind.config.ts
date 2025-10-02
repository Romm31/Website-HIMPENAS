// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'emerald-himp': '#046A38',
        'emerald-light': '#068A48',
        'emerald-dark': '#024D26',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Font untuk teks biasa (tetap)
        // Ganti 'serif' menjadi 'heading' agar lebih jelas
        heading: ['Poppins', 'sans-serif'], // Font untuk judul
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

export default config;