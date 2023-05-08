"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";

import { BsSearch } from "react-icons/bs";

function Playlist() {
	const [playlists, setPlaylists] = useState([]);

	const searchInputRef = useRef(null);
	const [hideSearch, setHideSearch] = useState(true);
	const [searchInput, setSearchInput] = useState("");

	const loadAllPlaylists = async () => {
		const res = await fetch("/api/playlist", { next: { revalidate: 10 } });
		const data = await res.json();
		console.log(data);

		setPlaylists(data);
	};

	useEffect(() => {
		loadAllPlaylists();
	}, []);

	const showSearch = () => {
		setHideSearch(!hideSearch);
		searchInputRef.current.style.visibility = "visible";
	};

	return (
		<div className="playlistOverview">
			<div className="playlist">
				<div className="playlist-search">
					<BsSearch onClick={showSearch} />
					<input
						ref={searchInputRef}
						onChange={(e) => setSearchInput(e.target.value)}
						type="text"
						placeholder="Search"
						className={hideSearch ? "hide" : "show"}
					/>
				</div>
				<h2>Playlists</h2>
				<div className="playlist-list">
					<div className="row">
						{playlists
							.filter((playlist) => {
								if (searchInput === "") {
									return playlist;
								} else if (
									playlist.name
										.toLowerCase()
										.includes(searchInput.toLowerCase())
								) {
									return playlist;
								}
							})
							.map((playlist) => (
								<div
									className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-3"
									key={playlist.id}
								>
									<Link href={`/playlist/${playlist.id}`}>
										<div className="item">
											<div className="item-cover">
												<div className="item-cover-overlay"></div>
												<img
													src={playlist.coverUrl}
													alt="Playlist cover"
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

export default Playlist;
