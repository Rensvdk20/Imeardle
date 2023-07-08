import prisma from "../../../../prisma/client";

export default async function handler(req, res) {
	const { method } = req;

	switch (method) {
		// Get a random playlist
		case "GET":
			try {
				const playlist = await prisma.playlist.findMany({
					include: {
						Songs: true,
					},
				});
				//Get random from the playlist array
				const random = Math.floor(Math.random() * playlist.length);
				//Return the random playlist
				res.status(200).json(playlist[random]);
			} catch (error) {
				res.status(500).json({ error: error.message });
			}
			break;
		default:
			res.setHeader("Allow", ["GET"]);
			res.status(405).end(`Method ${method} Not Allowed`);
	}
}
