"use client";

import { useState, useEffect, useRef } from "react";
import {
	editPlaylistAction,
	addSongAction,
	deleteSongAction,
} from "../actions.jsx";

import Collapse from "react-bootstrap/Collapse";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

import { AiFillEdit, AiFillDelete, AiOutlinePlus } from "react-icons/ai";
import { IoIosArrowForward } from "react-icons/io";
import { BsMusicNote, BsImage } from "react-icons/bs";
import { IoMdCheckmark } from "react-icons/io";
import { RxCross1 } from "react-icons/rx";

import toast, { Toaster } from "react-hot-toast";

import { CldImage, CldUploadWidget } from "next-cloudinary";
import Image from "next/image.js";

export default function EditPlaylist({ playlistId }) {
	const [playlist, setPlaylist] = useState({});
	const [originalPlaylist, setOriginalPlaylist] = useState({});
	const [collapseStates, setCollapseStates] = useState({});
	const [deleteOptionStates, setDeleteOptionStates] = useState({});

	const [showAddSongModal, setShowAddSongModal] = useState(false);

	const [newSongImage, setNewSongImage] = useState("");
	const [newPlaylistImage, setNewPlaylistImage] =
		useState("/img/skeleton.gif");

	const uploadWidgetRef = useRef(null);

	const messageUploadImageError = () => toast.error("Error uploading image");
	const messageUploadImageSuccess = () =>
		toast.success("Image uploaded successfully");
	const messageNoImageSelected = () => toast.error("No image selected");
	const messageSongAdded = () => toast.success("Song added successfully!");
	const messageSongError = () =>
		toast.error(
			"Something went wrong when adding the song! Please try again."
		);
	const messageFillInAllFields = () =>
		toast.error("Please fill in all fields!");
	const messagePlaylistEdited = () =>
		toast.success("Playlist edited successfully!");

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
			setOriginalPlaylist(JSON.parse(JSON.stringify(playlistRes)));
			setNewPlaylistImage(playlistRes.coverUrl);
		});
	};

	const deleteSong = async (songId) => {
		await deleteSongAction(songId);
		getPlaylist();
	};

	const submitAddSong = async (song) => {
		if (newSongImage.length > 0) {
			const title = song.get("title");
			const songUrl = song.get("songUrl");

			if (title !== "" || songUrl !== "") {
				const result = await addSongAction({
					title: title,
					songUrl: songUrl,
					coverUrl: newSongImage,
					playlistId: playlist.id,
				});

				if (result === true) {
					setShowAddSongModal(false);
					messageSongAdded();
					getPlaylist();
				} else {
					messageSongError();
				}
			} else {
				messageFillInAllFields();
			}
		} else {
			messageNoImageSelected();
		}
	};

	const editPlaylist = async (formData) => {
		toast.loading("Editing playlist...", {
			id: "editPlaylist",
		});

		if (!newPlaylistImage.includes("https://res.cloudinary.com/do67csxma/"))
			return toast.error("No image selected", {
				id: "editPlaylist",
			});

		const formSongs = playlist.Songs;
		const formPlaylist = {
			id: playlist.id,
			name: formData.get("name"),
			coverUrl: newPlaylistImage,
			songs: [],
		};

		for (const song of formSongs) {
			song.title = formData.get(`title-${song.id}`);
			song.songUrl = formData.get(`songUrl-${song.id}`);
		}

		//Compare the form results with the playlist from the database, if something changed only send the change to the database
		for (let i = 0; i < formSongs.length; i++) {
			const formSong = formSongs[i];
			const originalSong = originalPlaylist.Songs[i];

			if (
				formSong.title !== originalSong.title ||
				formSong.coverUrl !== originalSong.coverUrl ||
				formSong.songUrl !== originalSong.songUrl
			) {
				formPlaylist.songs.push({
					id: formSong.id,
					...(formSong.title !== originalSong.title && {
						title: formSong.title,
					}),
					...(formSong.coverUrl !== originalSong.coverUrl && {
						coverUrl: formSong.coverUrl,
					}),
					...(formSong.songUrl !== originalSong.songUrl && {
						songUrl: formSong.songUrl,
					}),
				});
			}
		}

		const saveResult = await editPlaylistAction(formPlaylist);

		if (saveResult.status !== 200) {
			return toast.error(saveResult.message, {
				id: "editPlaylist",
			});
		}

		if (saveResult)
			toast.success("Playlist edited successfully!", {
				id: "editPlaylist",
			});

		console.log(formPlaylist);
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
					editPlaylist(formData);
				}}
			>
				<div className="row">
					<div className="col-xl-4 col-lg-6 col-md-6 form-column">
						<div className="form-container">
							<h2>Edit playlist</h2>
							<div className="form-item">
								<CldUploadWidget
									uploadPreset="dpjhj6bt"
									options={{
										maxFiles: 1,
										resourceType: "image",
										cloudName: "do67csxma",
										clientAllowedFormats: [
											"png",
											"webp",
											"jpeg",
											"jpg",
										],
										folder: "Imeardle",
										return_delete_token: true,
										maxFileSize: 5000000,
										cropping: true,
										croppingAspectRatio: 300 / 300,
										croppingValidateDimensions: true,
										showSkipCropButton: false,
									}}
									onError={(error) => {
										console.log(error);
										messageUploadImageError();
									}}
									onUpload={(result) => {
										setNewPlaylistImage(
											result.info.secure_url
										);
										messageUploadImageSuccess();
										console.log(result);
									}}
								>
									{({ open }) => {
										function handleOnClick(e) {
											e.preventDefault();
											open();
										}
										return (
											<div className="form-item-img changeable-image-container">
												<Image
													className="playlist-image"
													fill={true}
													src={newPlaylistImage}
													priority
													sizes="200px"
													onClick={handleOnClick}
													onError={() => {
														setNewPlaylistImage(
															"/img/placeholder.jpeg"
														);
													}}
													alt="Playlist cover"
												/>
											</div>
										);
									}}
								</CldUploadWidget>
							</div>
							<div className="form-item">
								<label>
									<span>Name:</span>
									<input
										type="text"
										placeholder="Ex. Queen"
										defaultValue={playlist.name}
										name="name"
										required
										minLength={3}
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
								<div className="col-12">
									<div className="add-song">
										<button
											type="button"
											className="btn btn-primary"
											onClick={() => {
												setShowAddSongModal(true);
											}}
										>
											<AiOutlinePlus size={20} />
											&nbsp;Add song
										</button>
										<hr />
									</div>
								</div>
							</div>
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
															name={
																"title-" +
																song.id
															}
															defaultValue={
																song.title
															}
															readOnly={
																!collapseStates[
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
															onClick={() => {
																toggleCollapse(
																	song.id
																);
															}}
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
															name={
																"songUrl-" +
																song.id
															}
															defaultValue={
																song.songUrl
															}
															readOnly={
																!collapseStates[
																	song.id
																]
															}
															minLength={3}
															placeholder="Soundcloud URL"
														/>
														{/* <BsImage size={16} /> */}
														<span></span>
														<div className="song-upload">
															<div className="changeable-image-container">
																<CldImage
																	src={
																		song.coverUrl
																	}
																	onClick={() => {
																		uploadWidgetRef.current.setAttribute(
																			"data-song-id",
																			song.id
																		);
																		uploadWidgetRef.current.click();
																	}}
																	fill={true}
																	alt="Song cover"
																	sizes="400px"
																	style={{
																		objectFit:
																			"cover",
																		cursor: "pointer",
																	}}
																	f_auto
																	loading="eager"
																/>
															</div>
														</div>
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
			<Modal show={showAddSongModal} centered>
				<form
					action={(songData) => {
						submitAddSong(songData);
					}}
				>
					<Modal.Body className="modal-add-song">
						<label htmlFor="newSongName">
							<span>Song name</span>
							<input
								type="text"
								name="title"
								minLength={3}
								placeholder="Ex. Bohemian Rapsody"
							/>
						</label>
						<label htmlFor="newSongURL">
							<span>Song URL</span>
							<input
								type="text"
								name="songUrl"
								minLength={3}
								placeholder="Ex. https://soundcloud.com/queen-69312/bohemian-rhapsody-remastered-1"
							/>
						</label>
						<div className="modal-add-song-image">
							<CldUploadWidget
								uploadPreset="dpjhj6bt"
								options={{
									maxFiles: 1,
									resourceType: "image",
									cloudName: "do67csxma",
									clientAllowedFormats: [
										"png",
										"webp",
										"jpeg",
										"jpg",
									],
									folder: "Imeardle",
									return_delete_token: true,
									maxFileSize: 5000000,
									cropping: true,
									croppingAspectRatio: 300 / 300,
									croppingValidateDimensions: true,
									showSkipCropButton: false,
								}}
								onError={(error) => {
									console.log(error);
									messageUploadImageError();
								}}
								onUpload={(result) => {
									setNewSongImage(result.info.secure_url);
									messageUploadImageSuccess();
									console.log(result);
								}}
							>
								{({ open }) => {
									function handleOnClick(e) {
										e.preventDefault();
										open();
									}
									return (
										<button
											type="button"
											className="btn btn-secondary"
											onClick={handleOnClick}
										>
											Upload an Image
										</button>
									);
								}}
							</CldUploadWidget>
							{newSongImage.length > 0 ? (
								<CldImage
									src={newSongImage}
									width={300}
									height={300}
									style={{ objectFit: "cover" }}
								/>
							) : (
								""
							)}
						</div>
					</Modal.Body>
					<Modal.Footer>
						<Button
							variant="primary"
							onClick={() => {
								setShowAddSongModal(false);
							}}
						>
							Close
						</Button>
						<Button variant="secondary" type="submit">
							New Song
						</Button>
					</Modal.Footer>
				</form>
			</Modal>
			<Toaster
				position="top-right"
				toastOptions={{
					className: "toaster",
				}}
			/>
			<CldUploadWidget
				className="uploadWidgetTest"
				uploadPreset="dpjhj6bt"
				options={{
					maxFiles: 1,
					resourceType: "image",
					cloudName: "do67csxma",
					clientAllowedFormats: ["png", "webp", "jpeg", "jpg"],
					folder: "Imeardle",
					return_delete_token: true,
					maxFileSize: 5000000,
					cropping: true,
					croppingAspectRatio: 300 / 300,
					croppingValidateDimensions: true,
					showSkipCropButton: false,
				}}
				onError={(error) => {
					console.log(error);
					messageUploadImageError();
				}}
				onUpload={(result) => {
					const tempPlaylist = JSON.parse(JSON.stringify(playlist));
					const songId =
						uploadWidgetRef.current.getAttribute("data-song-id");

					tempPlaylist.Songs.forEach((tempSong) => {
						if (tempSong.id === songId) {
							tempSong.coverUrl = result.info.secure_url;
						}
					});

					setPlaylist(tempPlaylist);
					messageUploadImageSuccess();
					console.log(result);
				}}
			>
				{({ open }) => {
					const handleOnClick = (e) => {
						e.preventDefault();
						open();
					};
					return (
						<div
							ref={uploadWidgetRef}
							onClick={handleOnClick}
						></div>
					);
				}}
			</CldUploadWidget>
		</div>
	);
}
