"use server";

import { revalidateTag } from "next/cache";

// ##### Playlist Actions #####

export async function addPlaylistAction(playlist) {
	const res = await fetch(`${process.env.WEBSITE_URL}/api/playlist/`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			name: playlist.name,
			coverUrl: playlist.coverUrl,
		}),
	});

	if (res.ok) {
		revalidateTag(["playlists"]);
	}

	return {
		status: res.status,
		message: (await res.json()).error,
	};
}

export async function editPlaylistAction(editedPlaylist) {
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

	return {
		status: res.status,
		message: (await res.json()).error,
	};
}

// ##### Song Actions #####

export async function addSongAction(song) {
	const res = await fetch(`${process.env.WEBSITE_URL}/api/song`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			title: song.title,
			songUrl: song.songUrl,
			coverUrl: song.coverUrl,
			playlistId: song.playlistId,
		}),
		next: {
			cache: "no-cache",
			revalidate: false,
			tags: ["playlists"],
		},
	});

	if (res.ok) {
		revalidateTag("playlists");
		return true;
	}

	return false;
}

export async function deleteSongAction(songId) {
	const res = await fetch(`${process.env.WEBSITE_URL}/api/song/${songId}`, {
		method: "DELETE",
	});

	if (res.ok) {
		revalidateTag("playlists");
	}
}
