/** @type {import("next").NextConfig} */
const nextConfig = {
	output: "standalone",
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "daisyui.com",
				port: "",
				pathname: "/**",
			},
		],
	},
};

module.exports = nextConfig;
