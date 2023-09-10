/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "black-text": "#404040",
        "white-text": "#FAFAFA",
        background: "#FAFAFA",
        "blue-icon": "#228CE5",
        "icon-black":"#272A2B"
      },
      fontFamily: {
        Montserrat: ["Montserrat", "sans-serif"],
        Roboto: ["Roboto", "sans-serif"],
      },
      backgroundImage: {
        "blue-gradient": "linear-gradient(90deg, #3973E5 9.38%, #3695D9 90.07%)",
      },
      screens: {
        mobile: { max: "800px" },
        tablet: { min: "801px", max: "1200px" },
        desktop: { min: "1201px" },
      },
      dropShadow: {
        logo: "1px 1px 1px rgba(57, 115, 229, .65)",
      },
      gridTemplateRow: {
        8: "repeat(8, minmax(0, 1fr))",
      },
      gridRow: {
        "span-10": "span 13 / span 13",
      },
    },
  },
  plugins: [],
};
