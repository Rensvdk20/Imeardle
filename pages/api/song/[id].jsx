import prisma from "../../../prisma/client";

export default async function handler(req, res) {
	const { method } = req;

	switch (method) {
		//Get by id
		case "GET":
			try {
				const { id } = req.query;
				const song = await prisma.song.findUnique({
					where: {
						id,
					},
				});

				if (song === null) {
					res.status(404).json({
						code: 404,
						message: "Song not found",
					});
				}

				res.status(200).json(song);
			} catch (error) {
				res.status(500).json({
					code: 500,
					message: error.message,
				});
			}
			break;

		//Edit song
		case "PUT":
			try {
				const { id } = req.query;
				const { title, songUrl, coverUrl, playlistId } = req.body;
				const song = await prisma.song.update({
					where: {
						id,
					},
					data: {
						title,
						songUrl,
						coverUrl,
						playlistId,
					},
				});
				res.status(200).json(song);
			} catch (error) {
				res.status(500).json({ error: error.message });
			}
			break;

		//Delete song
		case "DELETE":
			try {
				const { id } = req.query;
				const song = await prisma.song.delete({
					where: {
						id,
					},
				});
				res.status(200).json(song);
			} catch (error) {
				res.status(500).json({ error: error.message });
			}
			break;
		default:
			res.setHeader("Allow", ["GET"]);
			res.status(405).end(`Method ${method} Not Allowed`);
	}
}
