"use client";

import { useState, useEffect } from "react";
import { editPlaylistAction, DeleteSongAction } from "../actions.jsx";

import Collapse from "react-bootstrap/Collapse";
import Fade from "react-bootstrap/Fade";

import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import { IoIosArrowForward } from "react-icons/io";
import { BsMusicNote, BsImage } from "react-icons/bs";
import { IoMdCheckmark } from "react-icons/io";
import { RxCross1 } from "react-icons/rx";

export default function EditPlaylist({ playlistId }) {
	const [playlist, setPlaylist] = useState({});
	const [inputStates, setInputStates] = useState({});
	const [collapseStates, setCollapseStates] = useState({});
	const [deleteOptionStates, setDeleteOptionStates] = useState({});

	const [savingPlaylistState, setSavingPlaylistState] = useState(0);

	useEffect(() => {
		getPlaylist();
	}, []);

	const getPlaylist = () => {
		fetch(`/api/playlist/${playlistId}`, {
			next: {
				tags: ["playlists"],
				revalidate: 10,
			},
		}).then(async (res) => {
			const playlistRes = await res.json();
			console.log(playlistRes);
			setPlaylist(playlistRes);
		});
	};

	const deleteSong = async (songId) => {
		await DeleteSongAction(songId);
		getPlaylist();
	};

	const submitChanges = async (formData) => {
		// Set playlist save to saving...
		setSavingPlaylistState(1);

		let formItems = [];
		const formPlaylist = {
			id: playlist.id,
			name: "",
			coverUrl: "",
			songs: [],
		};

		let playlistItemCount = 0;
		let playlistCount = 0;
		// Change the form results into the same format as the playlist from the database
		for (const [songId, value] of getPlaylistInfo(formData.entries())) {
			if (playlistItemCount === 0) {
				//Add the title
				formItems[playlistCount] = {
					id: songId,
					title: value,
					songUrl: "",
					coverUrl: "",
				};

				playlistItemCount++;
			} else {
				if (playlistItemCount === 1) {
					//Add the song url
					formItems[playlistCount].songUrl = value;
					playlistItemCount++;
				} else if (playlistItemCount === 2) {
					//Add the cover url
					formItems[playlistCount].coverUrl = value;
					playlistItemCount = 0;
					playlistCount++;
				} else {
					playlistItemCount = 0;
				}
			}
		}

		function getPlaylistInfo(iterator) {
			formPlaylist.name = iterator.next().value[1];
			formPlaylist.coverUrl = iterator.next().value[1];

			return iterator;
		}

		// Compare the form results with the playlist from the database, if something changed only send the change to the database
		for (let i = 0; i < formItems.length; i++) {
			const formSong = formItems[i];
			const playlistSong = playlist.Songs[i];

			if (
				formSong.title !== playlistSong.title ||
				formSong.coverUrl !== playlistSong.coverUrl ||
				formSong.songUrl !== playlistSong.songUrl
			) {
				formPlaylist.songs.push({
					id: formSong.id,
					...(formSong.title !== playlistSong.title && {
						title: formSong.title,
					}),
					...(formSong.coverUrl !== playlistSong.coverUrl && {
						coverUrl: formSong.coverUrl,
					}),
					...(formSong.songUrl !== playlistSong.songUrl && {
						songUrl: formSong.songUrl,
					}),
				});
			}
		}

		console.log(formPlaylist);

		const saveResult = await editPlaylistAction(formPlaylist);
		if (saveResult === true) {
			// Set playlist save state to saved
			setSavingPlaylistState(2);
			setTimeout(() => {
				setSavingPlaylistState(0);
			}, 5000);
		} else {
			// Set playlist save state to error
			setSavingPlaylistState(3);
		}
	};

	const toggleInput = (songId) => {
		setInputStates((prevState) => ({
			...prevState,
			[songId]: !prevState[songId],
		}));
	};

	const toggleCollapse = (songId) => {
		setCollapseStates((prevState) => ({
			...prevState,
			[songId]: !prevState[songId],
		}));
	};

	const toggleDeleteOption = (songId) => {
		setDeleteOptionStates((prevState) => ({
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
							<div className="form-result">
								<Fade in={savingPlaylistState > 0}>
									<h5>
										{savingPlaylistState === 1
											? "Saving..."
											: savingPlaylistState === 3
											? "Error!"
											: "Saved!"}
									</h5>
								</Fade>
							</div>
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
												<div className="song-top">
													<div
														className="song-collapse"
														onClick={() => {
															toggleCollapse(
																song.id
															);

															toggleInput(
																song.id
															);
														}}
														aria-expanded={
															collapseStates
														}
													>
														<IoIosArrowForward
															className={
																collapseStates[
																	song.id
																]
																	? "rotate-90"
																	: ""
															}
														/>
													</div>
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
															minLength={3}
														/>
													</div>
													<div
														className={`song-edit ${
															!deleteOptionStates[
																song.id
															]
																? ""
																: "hide"
														}`}
													>
														<AiFillEdit
															size={22}
															onClick={() =>
																toggleInput(
																	song.id
																)
															}
														/>
														&nbsp;
														<AiFillDelete
															size={22}
															onClick={() => {
																toggleDeleteOption(
																	song.id
																);
															}}
														/>
													</div>
													<div
														className={`song-delete-option ${
															deleteOptionStates[
																song.id
															]
																? ""
																: "hide"
														}`}
													>
														<IoMdCheckmark
															size={22}
															onClick={() =>
																deleteSong(
																	song.id
																)
															}
														/>
														<RxCross1
															id="cross"
															size={20}
															onClick={() => {
																toggleDeleteOption(
																	song.id
																);
															}}
														/>
													</div>
												</div>
												<Collapse
													dimension={"height"}
													in={collapseStates[song.id]}
												>
													<div className="song-extra">
														<BsMusicNote
															size={18}
														/>
														<input
															type="text"
															name={song.id}
															defaultValue={
																song.songUrl
															}
															readOnly={
																!inputStates[
																	song.id
																]
															}
															minLength={3}
															placeholder="Soundcloud URL"
														/>
														<BsImage size={16} />
														<input
															type="text"
															name={song.id}
															defaultValue={
																song.coverUrl
															}
															readOnly={
																!inputStates[
																	song.id
																]
															}
															minLength={3}
															placeholder="Song cover URL"
														/>
													</div>
												</Collapse>
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
