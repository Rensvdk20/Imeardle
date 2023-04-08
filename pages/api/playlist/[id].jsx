import prisma from "../../../prisma/client";

export default async function handler(req, res) {
	const { method } = req;

	switch (method) {
		//Get by id
		case "GET":
			try {
				const { id } = req.query;
				const playlist = await prisma.playlist.findUnique({
					where: {
						id,
					},
				});

				if (playlist === null) {
					res.status(404).json({
						code: 404,
						message: "Playlist not found",
					});
				}

				res.status(200).json(playlist);
			} catch (error) {
				res.status(500).json({
					code: 500,
					message: error.message,
				});
			}
			break;

		//Edit playlist
		case "PUT":
			try {
				const { id } = req.query;
				const { name, coverUrl } = req.body;
				const playlist = await prisma.playlist.update({
					where: {
						id,
					},
					data: {
						name,
						coverUrl,
					},
				});
				res.status(200).json(playlist);
			} catch (error) {
				res.status(500).json({ error: error.message });
			}
			break;

		//Delete playlist
		case "DELETE":
			try {
				const { id } = req.query;
				const playlist = await prisma.playlist.delete({
					where: {
						id,
					},
				});
				res.status(200).json(playlist);
			} catch (error) {
				res.status(500).json({ error: error.message });
			}
			break;
		default:
			res.setHeader("Allow", ["GET"]);
			res.status(405).end(`Method ${method} Not Allowed`);
	}
}
