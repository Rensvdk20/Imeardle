"use client";

import Link from "next/link";
import { getPlaylistAction } from "../actions";
import { useState, useEffect, Fragment } from "react";

function PlaylistDetail({ playlistId }) {
	const [playlist, setPlaylist] = useState([]);

	const loadAllPlaylists = async () => {
		setPlaylist(await getPlaylistAction(playlistId, true));
	};

	useEffect(() => {
		loadAllPlaylists();
	}, []);

	return (
		<div className="playlistDetail">
			{playlist.data?.Songs && playlist.data?.Songs.length !== 0 ? (
				<Link
					href={{
						pathname: "/",
						query: { playlistId },
					}}
					prefetch={false}
				>
					<button
						className="btn playlistDetail-select"
						id="selectPlaylistDesktop"
					>
						Use this playlist
					</button>
				</Link>
			) : (
				""
			)}
			{playlist.status != 200 ? (
				<div className="error">{playlist.message}</div>
			) : (
				<Fragment>
					<div className="playlist">
						<img
							src={playlist.data.coverUrl}
							alt={playlist.data.name}
						/>
						<h1>{playlist.data.name}</h1>
						{playlist.data.Songs &&
						playlist.data.Songs?.length !== 0 ? (
							<button className="btn" id="selectPlaylistMobile">
								<Link
									href={{
										pathname: "/",
										query: { playlistId },
									}}
									prefetch={false}
								>
									Use this playlist
								</Link>
							</button>
						) : (
							""
						)}
					</div>
					<div className="songs">
						<div className="row">
							{playlist.data.Songs &&
								playlist.data.Songs.map((song) => (
									<div
										className="col-12 col-lg-3 col-md-4 col-sm-6"
										key={song.id}
									>
										<div className="song">{song.title}</div>
									</div>
								))}
						</div>
					</div>
				</Fragment>
			)}
		</div>
	);
}

export default PlaylistDetail;
