const nextConfig = {
	experimental: {
		appDir: true,
		mdxRs: true,
		serverActions: true,
	},
	images: {
		domains: ["res.cloudinary.com"],
		remotePatterns: [
			{
				protocol: "https",
				hostname: "*.googleusercontent.com",
				port: "",
				pathname: "**",
			},
		],
	},
};

module.exports = nextConfig;
