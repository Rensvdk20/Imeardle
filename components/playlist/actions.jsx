"use server";

import prisma from "../../prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../pages/api/auth/[...nextauth]";
import { revalidateTag } from "next/cache";

// ##### Playlist Actions #####

export async function userAuth(redirectUrl = "/") {
	const session = await getServerSession(authOptions);
	if (!session) redirect(`/api/auth/signin?callbackUrl=${redirectUrl}}`);
	return session.user.id;
}

export async function isPlaylistOwner(playlistId) {
	const userId = await userAuth();

	const playlist = await prisma.playlist.findUnique({
		where: {
			id: playlistId,
		},
	});

	if (!playlist) return false;

	if (playlist.userId !== userId) return false;

	return true;
}

export async function getPlaylistsAction() {
	const playlists = await prisma.playlist.findMany();

	if (playlists) {
		if (!playlists)
			return {
				status: 404,
				message: "No playlists found",
				data: [],
			};

		return {
			status: 200,
			message: "Playlists received",
			data: playlists,
		};
	}
}

export async function getMyPlaylistsAction() {
	const userId = await userAuth();

	const playlists = await prisma.playlist.findMany({
		where: {
			userId,
		},
	});

	if (playlists) {
		if (!playlists)
			return {
				status: 404,
				message: "You don't have any playlists yet",
				data: [],
			};

		return {
			status: 200,
			message: "Playlists received",
			data: playlists,
		};
	}
}

export async function getPlaylistAction(id, includeSongs = false) {
	const playlist = await prisma.playlist.findUnique({
		where: {
			id,
		},
		include: {
			Songs: includeSongs,
		},
	});

	if (!playlist)
		return {
			status: 404,
			message: "Playlist not found",
			data: {},
		};

	return {
		status: 200,
		message: "Playlist received",
		data: playlist,
	};
}

export async function getRandomPlaylistAction() {
	const playlists = await getPlaylistsAction();

	if (playlists.status !== 200) {
		return {
			status: playlists.status,
			message: playlists.message,
			data: {},
		};
	}

	//Get random playlist from the playlists array
	const randomPlaylistNumber = Math.floor(
		Math.random() * playlists.data.length
	);

	const randomPlaylist = await getPlaylistAction(
		playlists.data[randomPlaylistNumber].id,
		true
	);

	//Return the random playlist
	return {
		status: 200,
		message: "Random playlist received",
		data: randomPlaylist.data,
	};
}

export async function addPlaylistAction(playlist) {
	// ##### Auth #####
	const userId = await userAuth();

	const { name, coverUrl } = playlist;

	// ##### Input check #####

	// Title should be at least 3 characters long
	if (name.length < 3) {
		return {
			status: 400,
			message: "The playlist title must be at least 3 characters",
		};
	}

	//Check if the coverurl is from the url https://res.cloudinary.com/do67csxma/image/upload/
	if (
		!coverUrl.includes("https://res.cloudinary.com/do67csxma/image/upload/")
	) {
		return {
			status: 400,
			message:
				"The coverUrl source is invalid",
		};
	}

	// ##### Check playlist limit #####
	const playlists = await prisma.playlist.findMany({
		where: {
			userId,
		},
	});

	if (playlists.length >= 25) {
		return {
			status: 403,
			message: "You've reached the limit of 25 playlists",
		};
	}

	// ##### Execute query #####
	try {
		const { name, coverUrl } = playlist;
		const newPlaylist = await prisma.playlist.create({
			data: {
				name,
				coverUrl,
				userId,
			},
		});

		if (newPlaylist) {
			revalidateTag(["playlists"]);
			return {
				status: 201,
				message: "Playlist created successfully",
				playlist: newPlaylist,
			};
		}
	} catch (error) {
		return {
			status: 500,
			message: error.message,
		};
	}
}

export async function editPlaylistAction(playlist) {
	// ##### Auth #####
	const userId = await userAuth();

	const { id, name, coverUrl, songs = [] } = playlist;

	// ##### Input check playlist #####

	// Title should be at least 3 characters long
	if (name !== undefined) {
		if (name.length < 3) {
			return {
				status: 400,
				message: "The playlist title must be at least 3 characters",
			};
		}
	}

	//Check if the coverurl is from the url https://res.cloudinary.com/do67csxma/image/upload/
	if (coverUrl !== undefined) {
		if (
			!coverUrl.includes(
				"https://res.cloudinary.com/do67csxma/image/upload/"
			)
		) {
			return {
				status: 400,
				message:
					"The coverUrl source is invalid",
			};
		}
	}

	// ##### Input check songs #####
	if (songs !== undefined) {
		for (const song of songs) {
			//Title should be at least 3 characters long
			if (song.title !== undefined)
				if (song.title.length < 3)
					return {
						status: 400,
						message: `The song title '${song.title}' must be at least 3 characters`,
					};

			//Check if the coverUrl is from the url https://res.cloudinary.com/do67csxma/image/upload/
			if (song.coverUrl !== undefined) {
				if (
					!song.coverUrl.includes(
						"https://res.cloudinary.com/do67csxma/image/upload/"
					)
				)
					return {
						status: 400,
						message: `The coverUrl '${song.coverUrl}' is invalid `,
					};
			}

			// Check if the songUrl is from the url https://soundcloud.com/
			if (song.songUrl !== undefined) {
				if (!song.songUrl.includes("https://soundcloud.com/"))
					return {
						status: 400,
						message: `The songUrl '${song.songUrl}' is invalid`,
					};
			}
		}
	}

	// ##### Execute query #####
	try {
		const editedPlaylist = await prisma.playlist.update({
			where: {
				id_userId: {
					id,
					userId,
				},
			},
			data: {
				name,
				coverUrl,
				Songs: {
					updateMany: songs.map((song) => ({
						where: { id: song.id },
						data: {
							title: song.title,
							songUrl: song.songUrl,
							coverUrl: song.coverUrl,
						},
					})),
				},
			},
		});

		if (!editedPlaylist) {
			return {
				status: 404,
				message: "Playlist not found",
			};
		}

		revalidateTag(["playlists"]);
		return {
			status: 200,
			message: "Playlist updated successfully",
			data: editedPlaylist,
		};
	} catch (error) {
		if(error.code === "P2025") return {
			status: 401,
			message: "Unauthorized playlist",
		}

		return {
			status: 500,
			message: error.message,
		};
	}
}

export async function deletePlaylistAction(playlistId) {
	// ##### Auth #####
	const userId = await userAuth();

	try {
		const deletedPlaylist = await prisma.playlist.delete({
			where: {
				id_userId: {
					id: playlistId,
					userId,
				},
			},
		});

		if (deletedPlaylist) {
			revalidateTag(["playlists"]);
			return {
				status: 200,
				message: "Playlist deleted successfully",
			};
		}
	} catch (error) {
		if(error.code === "P2025") return {
			status: 401,
			message: "Unauthorized playlist",
		}

		return {
			status: 500,
			message: error.message,
		};
	}
}

// ##### Song Actions #####

export async function addSongAction(song) {
	// ##### Auth #####
	const userId = await userAuth();
	const { title, songUrl, coverUrl, playlistId } = song;

	// ##### Input check #####

	//Check if the playlist exists
	const playlist = await getPlaylistAction(playlistId);
	if (playlist.status === 404) {
		return {
			status: 404,
			message: "The playlist doesn't exist",
		};
	}

	//Check if the playlists belongs to the user
	if (playlist.data.userId !== userId) {
		return {
			status: 401,
			message: "Unauthorized playlist",
		};
	}

	// Title should be at least 3 characters long
	if (title.length < 3) {
		return {
			status: 400,
			message: "The song title must be at least 3 characters",
		};
	}

	// Check if the songUrl is from the url https://soundcloud.com/
	if (!songUrl.includes("https://soundcloud.com/"))
		return {
			status: 400,
			message: "Invalid songUrl",
		};

	//Check if the coverUrl is from the url https://res.cloudinary.com/do67csxma/image/upload/
	if (
		!coverUrl.includes("https://res.cloudinary.com/do67csxma/image/upload/")
	)
		return {
			status: 400,
			message:
				"Invalid coverUrl",
		};

	// ##### Check the playlist song limit #####

	const songs = await prisma.song.findMany({
		where: {
			playlistId,
		},
	});

	if (songs.length >= 120) {
		return {
			status: 403,
			message: "You've reached the limit of 120 songs in this playlist",
		};
	}

	try {
		const newSong = await prisma.song.create({
			data: {
				title,
				songUrl,
				coverUrl,
				playlistId,
			},
		});

		if (newSong) {
			revalidateTag(["playlists"]);
			return {
				status: 201,
				message: "Song added successfully",
				data: newSong,
			};
		}
	} catch (error) {
		return {
			status: 500,
			message: error.message,
		};
	}
}

export async function deleteSongAction(songId) {
	const userId = await userAuth();

	try {
		const deletedSong = await prisma.song.deleteMany({
			where: {
				id: songId,
				playlist: {
					userId,
				},
			},
		});

		if (deletedSong.count === 0) {
			return {
				status: 401,
				message: "Unauthorized song"
			}
		}

		revalidateTag(["playlists"]);
			return {
				status: 200,
				message: "Song deleted successfully",
			};
	} catch (error) {
		return {
			status: 500,
			message: error.message,
		};
	}
}
