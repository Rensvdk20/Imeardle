import prisma from "../../../prisma/client";

export default async function handler(req, res) {
	const { method } = req;

	switch (method) {
		// Get all
		case "GET":
			try {
				const playlist = await prisma.playlist.findMany({
					include: {
						Songs: true,
					},
				});

				res.status(200).json(playlist);
			} catch (error) {
				res.status(500).json({ error: error.message });
			}
			break;

		// Add new playlist
		case "POST":
			try {
				const { name, coverUrl } = req.body;
				const playlist = await prisma.playlist.create({
					data: {
						name,
						coverUrl,
					},
				});
				res.status(201).json(playlist);
			} catch (error) {
				res.status(500).json({ error: error.message });
			}
			break;
		default:
			res.setHeader("Allow", ["GET"]);
			res.status(405).end(`Method ${method} Not Allowed`);
	}
}
