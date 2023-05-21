import Link from "next/link";

async function getPlaylist(id) {
	const res = await fetch(`${process.env.WEBSITE_URL}/api/playlist/${id}`, {
		next: { revalidate: 10 },
	});

	return res.json();
}

async function PlaylistDetail({ playlistId }) {
	const playlist = await getPlaylist(playlistId);

	return (
		<div className="playlistDetail">
			{playlist.Songs.length !== 0 ? (
				<button
					className="btn playlistDetail-select"
					id="selectPlaylistDesktop"
				>
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
			<div className="playlist">
				<img src={playlist.coverUrl} alt={playlist.name} />
				<h1>{playlist.name}</h1>
				{playlist.Songs.length !== 0 ? (
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
