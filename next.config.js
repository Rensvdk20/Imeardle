const nextConfig = {
	experimental: {
		appDir: true,
		mdxRs: true,
		serverActions: true,
	},
	images: {
		domains: ["res.cloudinary.com"],
	},
};

module.exports = nextConfig;
