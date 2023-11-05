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
					primary: "#FFFFFF",
					secondary: "#F1895C",
					accent: "#91A0B9",
					neutral: "#E5E6E6",

					"base-100": "#2E3244",
					"base-content": "#2E3244",
				},
				dark: {
					"color-scheme": "dark",
					primary: "#2E3244",
					secondary: "#F1895C",
					accent: "#516079",
					neutral: "#3E4254",

					"base-100": "#FFFFFF",
					"base-content": "#E5E6E6",
				},
			},
		],
	},
};
export default config;
