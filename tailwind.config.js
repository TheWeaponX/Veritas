/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Paleta "biblioteca científica": tinta noturna + papel + latão
        ink: {
          DEFAULT: '#10192E',
          50: '#EEF1F6',
          100: '#D6DCE8',
          300: '#8B99B8',
          500: '#3B4A6B',
          700: '#1C2942',
          900: '#10192E',
          950: '#0A1120',
        },
        paper: {
          DEFAULT: '#EFEEE6',
          50: '#FBFAF6',
          100: '#F4F2EA',
          200: '#EFEEE6',
        },
        brass: {
          DEFAULT: '#B98B3E',
          400: '#CBA05F',
          500: '#B98B3E',
          600: '#9C7231',
        },
        teal: {
          DEFAULT: '#1F6F63',
          500: '#1F6F63',
          600: '#175349',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};
