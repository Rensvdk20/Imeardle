"use client";

import { useEffect, useState, useRef } from "react";

function PlaylistDetail({ params }) {
	const [playlist, setData] = useState({});

	useEffect(() => {
		fetch(`/api/playlist/${params.id}`, {
			next: { revalidate: 10 },
		}).then(async (res) => {
			const playlist = await res.json();
			console.log(playlist);
			setData(playlist);
		});
	}, []);

	return (
		<div className="playlistDetail">
			<div className="playlist">
				<img src={playlist.coverUrl} alt={playlist.name} />
				<h1>{playlist.name}</h1>
			</div>
			<div className="songs">
				<div className="row">
					{playlist.Songs &&
						playlist.Songs.map((song) => (
							<div
								className="col-12 col-lg-3 col-md-4 col-sm-6"
								key={song.id}
							>
								<div className="song">{song.title}</div>
							</div>
						))}
				</div>
			</div>
		</div>
	);
}

export default PlaylistDetail;
