"use server";

import { revalidateTag } from "next/cache";

export async function editPlaylist(editedPlaylist) {
	console.log(editedPlaylist);
	const res = await fetch(
		`${process.env.WEBSITE_URL}/api/playlist/${editedPlaylist.id}`,
		{
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				name: editedPlaylist.name,
				coverUrl: editedPlaylist.coverUrl,
				songs: editedPlaylist.songs,
			}),
		}
	);

	if (res.ok) {
		revalidateTag("playlists");
	}
}
