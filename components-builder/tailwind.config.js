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
				tablet: { min: "800px", max: "1280px" },
				desktop: { min: "1281px" },
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

