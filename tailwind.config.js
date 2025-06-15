/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['OnGlipParkDaHyun', 'system-ui', 'sans-serif'],
      },
      colors: {
        'booktown-bg': '#FFFAF0',
      },
      maxWidth: {
        'container': '28rem',
        'container-lg': '1440px',
      }
    },
  },
  plugins: [
    require("tailwind-scrollbar"),
  ],
};
