/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0B1F3A',
          dark: '#071526',
          light: '#164A7A',
        },
        accent: {
          DEFAULT: '#C9A227',
          light: '#E2BF4D',
          dark: '#A68218',
        },
        cream: '#F8F8F6',
        charcoal: '#171A1F',
      },
      fontFamily: {
        serif: ['Lora', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
