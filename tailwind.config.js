/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.hbs"],
	theme: {
		extend: {
			fontFamily: {
				poppins: ["Poppins", "sans-serif"],
				yellowtail: ["Yellowtail", "cursive"],
			},
		},
	},
	plugins: [require("daisyui")],
	daisyui: {
		themes: ["garden"],
	},
};
