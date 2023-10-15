"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";

import "./PlaylistOverview.scss";

import { BsSearch } from "react-icons/bs";
import Image from "next/image";
import { getPlaylistsAction } from "../actions";

function PlaylistOverview() {
	const [playlists, setPlaylists] = useState([]);

	const searchInputRef = useRef(null);
	const [hideSearch, setHideSearch] = useState(true);
	const [searchInput, setSearchInput] = useState("");

	const loadAllPlaylists = async () => {
		setPlaylists(await getPlaylistsAction());
	};

	useEffect(() => {
		loadAllPlaylists();
	}, []);

	const filteredPlaylists = playlists.data
		? playlists.data.filter((playlist) => {
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
		: [];

	const showSearch = () => {
		setHideSearch(!hideSearch);
		searchInputRef.current.style.visibility = "visible";

		if (hideSearch) {
			searchInputRef.current.disabled = false;
		} else {
			searchInputRef.current.disabled = true;
		}

		searchInputRef.current.select();
	};

	return (
		<div className="playlistOverview">
			<div className="playlist">
				<div className="playlist-search">
					<div className="playlist-search-icon" onClick={showSearch}>
						<BsSearch />
					</div>
					<input
						ref={searchInputRef}
						onChange={(e) => setSearchInput(e.target.value)}
						type="text"
						placeholder="Search"
						disabled={hideSearch}
						className={hideSearch ? "hide" : "show"}
					/>
				</div>
				<h2>Playlists</h2>
				<div className="playlist-list">
					<div className="row">
						{playlists.status != 200 &&
						playlists.data !== undefined &&
						filteredPlaylists.length === 0 ? (
							<div>No playlists found</div>
						) : (
							filteredPlaylists.map((playlist) => (
								<div
									className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-3"
									key={playlist.id}
								>
									<Link href={`/playlist/${playlist.id}`}>
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
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

export default PlaylistOverview;
