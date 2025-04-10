const config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // You can extend the theme here if needed
      colors: {
        current: 'currentColor',
        black: '#222222',
        white: '#FFFFFF',
        primary: '#1A73E8',
        secondary: '#34A853',
        stroke: '#333333',
        themePrimary: 'var(--primary-color)',
        themeSecondary: 'var(--secondary-color)',
        themeSecondaryLight: 'var(--secondary-light-color)',
        blue: {
          300: '#4B516F',
          500: '#293153',
          700: '#132D7D',
          800: '#0E205A',
          50: '#8A91AF',
        },
        neutral: {
          900: '#333333',
          800: '#444444',
          700: '#555555',
          600: '#666666',
          500: '#808080',
          400: '#999999',
          300: '#BBBBBB',
          200: '#CFCFCF',
          100: '#EEEEEE',
          50: '#F4F4F4',
        },
        error: {
          500: '#AB2222',
          300: '#D43838',
          200: '#FA5757',
          100: '#FFDEDE',
        },
        'severe-warning': {
          500: '#DC1818',
          300: '#FA2F2F',
          200: '#FF5757',
          100: '#FFECEC',
          50: '#FFF7F7',
        },
        warning: {
          500: '#FC8800',
          400: '#FFA53A',
          300: '#FFBA68',
          200: '#FFD43E',
          100: '#FFE177',
          50: '#FFEFB5',
        },
        success: {
          500: '#0A9A6F',
          400: '#17AE81',
          300: '#21C393',
          200: '#92E8CE',
          100: '#C7E9DC',
        },
        selection: {
          500: '#0747A6',
          400: '#0052CC',
          300: '#0065FF',
          200: '#2684FF',
          100: '#4C9AFF',
          50: '#DEEBFF',
        },
        teal: {
          500: '#008DA6',
          300: '#2CB6CE',
          200: '#86D5E3',
          100: '#C2EEF5',
        },
        transparent: 'transparent',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        lato: ['Lato', 'sans-serif'],
      },
      boxShadow: {
        textfield: '0 0 10px 0 rgba(0, 0, 0, 0.1)',
        navbar: '0 1px 5px 0 rgba(0, 0, 0, 0.05)',
        'dropdown-menu': '0 8px 25px 0 rgba(0, 0, 0, 0.1)',
        table: 'inset 0 -1px 0 #EEEEEE',
        tab: 'inset 0 -1px 0 rgba(0, 0, 0, 0.1)',
      },
      strokeWidth: {
        3: '3px',
      },
      gap: {
        2.5: '0.625rem',
        7: '1.875rem',
      },
      borderRadius: {
        default: '.3125rem',
      },
      margin: {
        2.5: '0.625rem',
        7.5: '1.875rem',
      },
      padding: {
        2.5: '0.625rem',
        7.5: '1.875rem',
        full: '100%',
      },
      lineHeight: {
        0: '0',
      },
      borderWidth: {
        1: '1px',
      },
      animation: {
        'fade-out': 'fadeOut .3s ease-out',
        'fade-in': 'fadeIn .3s ease-in',
        spin: 'spin 1.5s infinite linear',
        'slide-up': 'slideUp .3s ease-in-out',
        'slide-down': 'slideDown .3s ease-in-out',
      },
      keyframes: (theme) => ({
        fadeOut: {
          '0%': { opacity: 1 },
          '100%': { opacity: 0 },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        slideDown: {
          '0%': { transform: 'translateY(0)', opacity: 0 },
          '100%': { transform: 'translateY(100%)', opacity: 1 },
        },
      }),
    },
  },
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes: [{
      wttheme: {
        "primary": "#3A0CA3",
        "secondary": "#293153",
        "accent": "#37cdbe",
        "neutral": "#3d4451",
        "base-100": "#ffffff",
        "error": "#AB2222",
        "stroke": '#333333'
      },
    },],
  },
  darkMode: 'class',
};
export default config;
