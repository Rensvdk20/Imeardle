import prisma from "../../../prisma/client";

export default async function handler(req, res) {
	const { method } = req;
	const { title, songUrl, coverUrl, playlistId } = req.body;

	// ##### Input check interceptor #####
	if (method === "POST") {
		// Title should be at least 3 characters long
		if (title.length < 3) {
			return res
				.status(400)
				.json({ error: "The playlist title is too short" });
		}

		//Check if the coverurl is from the url https://res.cloudinary.com/do67csxma/image/upload/
		if (
			!coverUrl.includes(
				"https://res.cloudinary.com/do67csxma/image/upload/"
			)
		) {
			return res.status(400).json({
				error: "The coverUrl source is invalid, should be from: https://res.cloudinary.com/do67csxma",
			});
		}

		// Check if the songUrl is from the url https://soundcloud.com/
		if (!songUrl.includes("https://soundcloud.com/")) {
			return res.status(400).json({
				error: "Invalid songUrl, must start with https://soundcloud.com/",
			});
		}

		// Check if the playlistId has the valid prisma cuid length
		if (!(playlistId.length >= 25 && playlistId.length <= 30)) {
			return res.status(400).json({
				error: "Invalid playlistId",
			});
		}
	}

	switch (method) {
		// Get all songs
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
