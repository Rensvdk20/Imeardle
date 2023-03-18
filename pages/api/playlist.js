import prisma from "../../prisma/client";

export default async function handler(req, res) {
	const message = await prisma.playlist.findMany();
	res.status(200).json({ message });
}
