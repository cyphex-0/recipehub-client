
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#E63946',
        secondary: '#F4A261',
        accent: '#2A9D8F',
        dark: '#1D3557',
        light: '#F1FAEE',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out',
        float: 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        recipelight: {
          primary: '#E63946',
          secondary: '#F4A261',
          accent: '#2A9D8F',
          neutral: '#1D3557',
          'base-100': '#FFFFFF',
          'base-200': '#F8F9FA',
          'base-300': '#E9ECEF',
          info: '#3ABFF8',
          success: '#36D399',
          warning: '#FBBD23',
          error: '#F87272',
        },
      },
      {
        recipedark: {
          primary: '#E63946',
          secondary: '#F4A261',
          accent: '#2A9D8F',
          neutral: '#E5E5E5',
          'base-100': '#1A1A1A',
          'base-200': '#2D2D2D',
          'base-300': '#404040',
          info: '#3ABFF8',
          success: '#36D399',
          warning: '#FBBD23',
          error: '#F87272',
        },
      },
    ],
    darkTheme: 'recipedark',
  },
}
