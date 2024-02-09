"use client";

import Link from "next/link";
import Image from "next/image";

import "../overview/PlaylistOverview.scss";
import { getMyPlaylistsAction } from "../actions";
import { useState, useEffect } from "react";

function MyPlaylist() {
	const [playlists, setPlaylists] = useState({});

	const loadAllPlaylists = async () => {
		setPlaylists(await getMyPlaylistsAction());
	};

	useEffect(() => {
		loadAllPlaylists();
	}, []);

	return (
		<div className="playlistOverview">
			<div className="playlist">
				<h2>My Playlists</h2>
				<div className="playlist-list">
					<div className="row">
						{playlists.status == 200 ? (
							playlists.data.length > 0 ? (
								playlists.data?.map((playlist) => (
									<div
										className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-4 col-xxl-3"
										key={playlist.id}
									>
										<Link
											href={`/manager/playlist/${playlist.id}`}
										>
											<div className="item">
												<div className="item-cover">
													<div className="item-cover-overlay"></div>
													<Image
														src={playlist.coverUrl}
														alt="Playlist cover"
														width={500}
														height={250}
													/>
												</div>
												<div className="item-name">
													{playlist.name}
												</div>
											</div>
										</Link>
									</div>
								))
							) : (
								<div>You don't have any playlists yet</div>
							)
						) : (
							""
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

export default MyPlaylist;
