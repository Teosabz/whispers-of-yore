/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // Enable class-based dark mode
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}", // in case you're using /app directory
  ],
  theme: {
    extend: {},
    screens: {
      sm: "640px", // Small devices (phones)
      md: "768px", // Medium devices (tablets)
      lg: "1024px", // Large devices (laptops)
      xl: "1280px", // Extra large (desktops)
      "2xl": "1536px", // Extra extra large
    },
  },
  plugins: [],
};
