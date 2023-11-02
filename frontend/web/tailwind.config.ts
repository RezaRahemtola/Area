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
					primary: "#718099",
					secondary: "#F1895C",
					accent: "#C5C6C6",
					neutral: "#FFFFFF",

					"base-100": "#FFFFFF",
					"base-content": "#1f2937",
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

