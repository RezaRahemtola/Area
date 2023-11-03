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
					primary: "#2E3244",
					secondary: "#F1895C",
					accent: "#516079",
					neutral: "#C5C6C6",

					"base-100": "#2E3244",
					"base-content": "#FFFFFF",
				},
				dark: {
					"color-scheme": "dark",
					primary: "#516079",
					secondary: "#F1895C",
					accent: "#2E3244",
					neutral: "#718099",

					"base-100": "#2E3244",
					"base-content": "#FFFFFF",
				},
			},
		],
	},
};
export default config;
