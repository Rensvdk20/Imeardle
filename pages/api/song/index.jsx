import prisma from "../../../prisma/client";

export default async function handler(req, res) {
	const { method } = req;

	const songUrlRegex = new RegExp("^https:\\/\\/soundcloud\\.com\\/.*");

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

				if (!songUrlRegex.test(songUrl)) {
					res.status(400).json({
						error: "Invalid songUrl, must start with https://soundcloud.com/",
					});
					return;
				}

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
