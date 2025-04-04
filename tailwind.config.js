/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['OnGlipParkDaHyun', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [
    require("tailwind-scrollbar"),
  ],
};
