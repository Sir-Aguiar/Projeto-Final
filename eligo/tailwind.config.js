import colors from "tailwindcss/colors";
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", "./src/**/*.css"],
  theme: {
    extend: {
      colors: {
        ...colors,
        "black-text": "#404040",
        "white-text": "#FAFAFA",
        background: "#FAFAFA",
        blue: {
          500: "#228CE5",
          600: "#1B70B7",
        },
        black: {
          smooth: "#292C2E",
        },
      },
      fontFamily: {
        Montserrat: ["Montserrat", "sans-serif"],
        Roboto: ["Roboto", "sans-serif"],
        Lato: ["Lato", "sans-serif"],
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
    },
  },
  plugins: [],
  safelist: [
    {
      pattern: /(bg|text|border)-(transparent|current|white|purple|midnight|metal|tahiti|silver|bermuda)/,
    },
  ],
};
