"use server";

import { revalidateTag } from "next/cache";

export async function editPlaylistAction(editedPlaylist) {
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
				...(editedPlaylist.songs.length > 0 && {
					songs: editedPlaylist.songs,
				}),
			}),
			next: {
				cache: "no-cache",
				revalidate: false,
				tags: ["playlists"],
			},
		}
	);

	if (res.ok) {
		revalidateTag("playlists");
	}
}

export async function DeleteSongAction(songId, playlistId) {
	const res = await fetch(`${process.env.WEBSITE_URL}/api/song/${songId}`, {
		method: "DELETE",
	});

	if (res.ok) {
		revalidateTag("playlists");
	}
}
