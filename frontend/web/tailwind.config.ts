import type { Config } from "tailwindcss";
import daisyui from "daisyui";

const config: Config = {
	content: [
		"./layouts/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	plugins: [daisyui],
	daisyui: {
		themes: [
			{
				light: {
					"color-scheme": "light",
					primary: "#570df8",
					"primary-content": "#E0D2FE",
					secondary: "#f000b8",
					"secondary-content": "#FFD1F4",
					accent: "#1ECEBC",
					"accent-content": "#07312D",
					neutral: "#2B3440",
					"neutral-content": "#D7DDE4",
					"base-100": "#ffffff",
					"base-200": "#F2F2F2",
					"base-300": "#E5E6E6",
					"base-content": "#1f2937",
				},
				dark: {
					"color-scheme": "dark",
					primary: "#2E3244",
					secondary: "#F1895C",
					accent: "#516079",
					neutral: "#C5C6C6",

					"base-100": "#000",
					"base-content": "#FFF",
				},
			},
		],
	},
};
export default config;
