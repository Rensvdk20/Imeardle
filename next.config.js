const nextConfig = {
	experimental: {
		appDir: true,
		mdxRs: true,
		serverActions: true,
	},
	images: {
		domains: ["res.cloudinary.com"],
	},
	target: 'serverless',
};

module.exports = nextConfig;
