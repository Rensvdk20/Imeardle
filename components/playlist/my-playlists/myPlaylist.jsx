import Link from "next/link";

import "../overview/PlaylistOverview.scss";
import Image from "next/image";

async function getPlaylists() {
	"use server";

	const res = await fetch(`${process.env.WEBSITE_URL}/api/playlist`, {
		next: {
			tags: ["playlists"],
			revalidate: 10,
		},
	});

	return res.json();
}

async function MyPlaylist() {
	const playlists = await getPlaylists();

	return (
		<div className="playlistOverview">
			<div className="playlist">
				<h2>My Playlists</h2>
				<div className="playlist-list">
					<div className="row">
						{playlists.map((playlist) => (
							<div
								className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-3"
								key={playlist.id}
							>
								<Link href={`/manager/playlist/${playlist.id}`}>
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
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

export default MyPlaylist;
