/** @type {import("next").NextConfig} */
const nextConfig = {
	output: "standalone",
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "**",
			},
		],
	},
	experimental: {
		swcPlugins: [["swc-plugin-coverage-instrument", {}]],
	},
	webpack(config) {
		config.resolve.fallback = {
			...config.resolve.fallback,
			fs: false,
		};

		return config;
	},
};

module.exports = nextConfig;
