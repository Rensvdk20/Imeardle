"use client";

import { useState, useEffect } from "react";
import { editPlaylist } from "../actions.jsx";

import { AiFillEdit, AiFillDelete } from "react-icons/ai";

export default function EditPlaylist({ playlistId }) {
	const [playlist, setData] = useState({});
	const [inputStates, setInputStates] = useState({});

	useEffect(() => {
		fetch(`/api/playlist/${playlistId}`, {
			next: {
				tags: ["playlists"],
				revalidate: 10,
			},
		}).then(async (res) => {
			const playlistTest = await res.json();
			console.log(playlistTest);
			setData(playlistTest);
		});
	}, []);

	const submitChanges = (formData) => {
		let count = 0;
		const editedPlaylist = {
			id: playlist.id,
			name: "",
			coverUrl: "",
			songs: [],
		};

		//Skip the first two entries because they are the name and coverUrl
		for (const [formSongId, formSongTitle] of getPlaylistInfo(
			formData.entries()
		)) {
			if (
				formSongId === playlist.Songs[count].id &&
				formSongTitle != playlist.Songs[count].title
			) {
				//Found a changed song
				editedPlaylist.songs.push({
					id: formSongId,
					title: formSongTitle,
				});
			}

			// console.log(editedPlaylist);

			count++;
		}

		editPlaylist(editedPlaylist);

		function getPlaylistInfo(iterator) {
			editedPlaylist.name = iterator.next().value[1];
			editedPlaylist.coverUrl = iterator.next().value[1];

			return iterator;
		}
	};

	const toggleInput = (songId) => {
		setInputStates((prevState) => ({
			...prevState,
			[songId]: !prevState[songId],
		}));
	};
	return (
		<div className="playlistEdit">
			<form
				action={(formData) => {
					submitChanges(formData);
				}}
			>
				<div className="row">
					<div className="col-xl-4 col-lg-6 col-md-6 form-column">
						<div className="form-container">
							<h2>Edit playlist</h2>
							<div className="form-item">
								<label>
									<span>Name:</span>
									<input
										type="text"
										placeholder="Ex. Queen"
										defaultValue={playlist.name}
										name="name"
										id="name"
									/>
								</label>
							</div>
							<div className="form-item">
								<label>
									<span>Cover url:</span>
									<input
										type="text"
										placeholder="Ex. https:i.imgur.com/GHkIb4B.jpg"
										defaultValue={playlist.coverUrl}
										name="coverUrl"
										id="coverUrl"
									/>
								</label>
							</div>
							<button className="btn btn-secondary" type="submit">
								Submit
							</button>
						</div>
					</div>
					<div className="col-xl-8 col-lg-6 col-md-6 list-column">
						<h2>Songs</h2>
						<div className="songs">
							<div className="row">
								{playlist.Songs &&
									playlist.Songs.map((song) => (
										<div
											className="col-12 col-lg-6 col-xl-4 col-md-12 col-sm-12"
											key={song.id}
										>
											<div className="song">
												<div className="song-title">
													<input
														type="text"
														id={song.id}
														name={song.id}
														defaultValue={
															song.title
														}
														readOnly={
															!inputStates[
																song.id
															]
														}
													/>
												</div>
												<div className="song-edit">
													<AiFillEdit
														size={22}
														onClick={() =>
															toggleInput(song.id)
														}
													/>
													&nbsp;
													<AiFillDelete size={22} />
												</div>
											</div>
										</div>
									))}
							</div>
						</div>
					</div>
				</div>
			</form>
		</div>
	);
}
