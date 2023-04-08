import prisma from "../../../prisma/client";

export default async function handler(req, res) {
	const { method } = req;

	switch (method) {
		// Get all
		case "GET":
			try {
				const song = await prisma.song.findMany();

				res.status(200).json(song);
			} catch (error) {
				res.status(500).json({ error: error.message });
			}
			break;

		// Add new song
		case "POST":
			try {
				const { title, songUrl, coverUrl, playlistId } = req.body;
				const song = await prisma.song.create({
					data: {
						title,
						songUrl,
						coverUrl,
						playlistId,
					},
				});
				res.status(201).json(song);
			} catch (error) {
				res.status(500).json({ error: error.message });
			}
			break;
		default:
			res.setHeader("Allow", ["GET"]);
			res.status(405).end(`Method ${method} Not Allowed`);
	}
}
