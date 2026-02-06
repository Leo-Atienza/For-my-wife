/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#E11D48',
        'primary-soft': '#FFF1F2',
        accent: '#FDA4AF',
        background: '#FFFBFB',
        surface: '#FFFFFF',
        danger: '#DC2626',
        success: '#16A34A',
        'text-primary': '#1C1917',
        'text-muted': '#78716C',
      },
      fontFamily: {
        heading: ['PlayfairDisplay_700Bold'],
        body: ['Inter_400Regular'],
        'body-medium': ['Inter_500Medium'],
        'body-semibold': ['Inter_600SemiBold'],
        accent: ['DancingScript_400Regular'],
      },
    },
  },
  plugins: [],
};
