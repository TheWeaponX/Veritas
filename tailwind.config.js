/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Paleta atualizada: Azul da Prússia (logo) e fundo Creme
        ink: {
          DEFAULT: '#0B1D3A', // Azul escuro principal do logo
          50: '#F0F4FA',
          100: '#D6E0F0',
          300: '#426391',
          500: '#1F3C63',
          700: '#152C4D',
          900: '#0B1D3A',
          950: '#050E1D',
        },
        paper: {
          DEFAULT: '#F9F8F3', // Fundo creme exato da imagem
          50: '#FCFBF8',
          100: '#F9F8F3',
          200: '#EFECE1',
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
        // Alterado de Fraunces para Montserrat (estilo geométrico do logo)
        display: ['"Montserrat"', 'sans-serif'],
        body: ['"Montserrat"', '"Inter"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};
