import prisma from "../../../prisma/client";

export default async function handler(req, res) {
	const { method } = req;

	// ##### Input check interceptor #####
	if (method === "POST") {
		// Title should be at least 3 characters long
		if (req.body.name.length < 3) {
			return res
				.status(400)
				.json({ error: "The playlist title is too short" });
		}

		//Check if the coverurl is from the url https://res.cloudinary.com/do67csxma/image/upload/
		if (
			!req.body.coverUrl.includes(
				"https://res.cloudinary.com/do67csxma/image/upload/"
			)
		) {
			return res
				.status(400)
				.json({ error: "The coverUrl source is invalid" });
		}
	}

	// ##### API Endpoints #####

	switch (method) {
		// Get all playlists
		case "GET":
			try {
				const playlist = await prisma.playlist.findMany();

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
