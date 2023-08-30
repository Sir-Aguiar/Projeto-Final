/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			fontFamily: {
				Montserrat: ["Montserrat", "sans-serif"],
				Roboto: ["Roboto", "sans-serif"],
			},
			screens: {
				mobile: { max: "800px" },
				tablet: { min: "800px", max: "1280" },
				desktop: { min: "1281px" },
			},
		},
	},
	plugins: [],
};

