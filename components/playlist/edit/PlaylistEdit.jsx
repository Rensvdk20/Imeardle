"use client";

import { useState, useEffect, useRef } from "react";
import {
	editPlaylistAction,
	deletePlaylistAction,
	addSongAction,
	deleteSongAction,
	getPlaylistAction,
} from "../actions.jsx";

import { useRouter } from "next/navigation";

import Collapse from "react-bootstrap/Collapse";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

import { AiFillEdit, AiFillDelete, AiOutlinePlus } from "react-icons/ai";
import { IoIosArrowForward } from "react-icons/io";
import { BsMusicNote } from "react-icons/bs";
import { IoMdCheckmark } from "react-icons/io";
import { RxCross1 } from "react-icons/rx";

import toast, { Toaster } from "react-hot-toast";

import { CldImage, CldUploadWidget } from "next-cloudinary";
import Image from "next/image.js";

export default function EditPlaylist({ playlistId }) {
	const router = useRouter();

	const [playlist, setPlaylist] = useState({});
	const [originalPlaylist, setOriginalPlaylist] = useState({});
	const [collapseStates, setCollapseStates] = useState({});
	const [deleteOptionStates, setDeleteOptionStates] = useState({});

	const [showAddSongModal, setShowAddSongModal] = useState(false);
	const [showDeletePlaylistModal, setShowDeletePlaylistModal] =
		useState(false);

	const [newSongImage, setNewSongImage] = useState("");
	const [newPlaylistImage, setNewPlaylistImage] =
		useState("/img/skeleton.gif");

	const uploadWidgetRef = useRef(null);
	const addSongForm = useRef(null);

	const messageUploadImageError = () => toast.error("Error uploading image");
	const messageUploadImageSuccess = () =>
		toast.success("Image uploaded successfully");

	useEffect(() => {
		getPlaylist();
	}, []);

	const getPlaylist = async () => {
		const res = await getPlaylistAction(playlistId, true, true);
		setPlaylist(res);
		setOriginalPlaylist(JSON.parse(JSON.stringify(res)));
		setNewPlaylistImage(res.data.coverUrl);
	};

	const deleteSong = async (songId) => {
		toast.loading("Deleting song...", {
			id: "deleteSong",
		});

		const result = await deleteSongAction(songId);

		if (result.status !== 200) {
			return toast.error(result.message, {
				id: "deleteSong",
			});
		}

		toast.success("Song deleted successfully!", {
			id: "deleteSong",
		});

		getPlaylist();
	};

	const submitAddSong = async (song) => {
		const title = song.get("title");
		const songUrl = song.get("songUrl");

		if (title !== "" || songUrl !== "") {
			if (title.length < 3)
				return toast.error(
					"The title must be at least 3 characters long",
					{
						id: "addSong",
					}
				);

			if (!songUrl.includes("https://soundcloud.com/"))
				return toast.error("The song URL must be a Soundcloud URL", {
					id: "addSong",
				});

			if (newSongImage.length === 0)
				return toast.error("No image selected", {
					id: "addSong",
				});

			const result = await addSongAction({
				title: title,
				songUrl: songUrl,
				coverUrl: newSongImage,
				playlistId: playlist.data.id,
			});

			if (result.status === 201) {
				setShowAddSongModal(false);
				toast.success("Song added successfully!");
				getPlaylist();

				//Empty the form
				addSongForm.current.reset();
				setNewSongImage("");
			} else {
				toast.error(
					result.message ||
						"Something went wrong when adding the song! Please try again."
				);
			}
		} else {
			toast.error("Please fill in all fields!");
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

		const formSongs = playlist.data.Songs;
		const formPlaylist = {
			id: playlist.data.id,
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
			const originalSong = originalPlaylist.data.Songs[i];

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
	};

	const deletePlaylist = async () => {
		toast.loading("Deleting playlist...", {
			id: "deletePlaylist",
		});

		const result = await deletePlaylistAction(playlist.data.id);

		if (result.status !== 200) {
			return toast.error(result.message, {
				id: "deletePlaylist",
			});
		}

		if (result) {
			toast.success("Playlist deleted successfully!", {
				id: "deletePlaylist",
			});

			router.push("/manager");
			router.refresh();
		}
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
										console.error(error);
										messageUploadImageError();
									}}
									onUpload={(result) => {
										setNewPlaylistImage(
											result.info.secure_url
										);
										messageUploadImageSuccess();
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
										defaultValue={playlist.data?.name}
										name="name"
										required
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
									<div className="song-options">
										<button
											type="button"
											className="btn btn-primary song-options-add"
											onClick={() =>
												setShowAddSongModal(true)
											}
										>
											<AiOutlinePlus size={20} />
											&nbsp;Add song
										</button>
										<button
											type="button"
											className="btn btn-primary song-options-delete"
											onClick={() =>
												setShowDeletePlaylistModal(true)
											}
										>
											<AiFillDelete size={22} />
											&nbsp;Delete Playlist
										</button>
										<hr />
									</div>
								</div>
							</div>
							<div className="row">
								{playlist.data?.Songs &&
									playlist.data?.Songs.map((song) => (
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
			<Modal
				show={showAddSongModal}
				onHide={() => {
					setShowAddSongModal(false);
				}}
				centered
			>
				<form
					action={(songData) => {
						submitAddSong(songData);
					}}
					ref={addSongForm}
				>
					<Modal.Body className="modal-add-song">
						<label htmlFor="newSongName">
							<span>Song name</span>
							<input
								type="text"
								name="title"
								placeholder="Ex. Bohemian Rapsody"
							/>
						</label>
						<label htmlFor="newSongURL">
							<span>Song URL</span>
							<input
								type="text"
								name="songUrl"
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
									console.error(error);
									messageUploadImageError();
								}}
								onUpload={(result) => {
									setNewSongImage(result.info.secure_url);
									messageUploadImageSuccess();
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
							Add song
						</Button>
					</Modal.Footer>
				</form>
			</Modal>
			<Modal
				show={showDeletePlaylistModal}
				onHide={() => setShowDeletePlaylistModal(false)}
				centered
			>
				<Modal.Body className="modal-delete-song">
					<h5>Are you sure?</h5>
					<div className="delete-icon-container">
						<AiFillDelete size={25} />
					</div>
					<h5>{playlist.data?.name}</h5>
					<div>
						By deleting this playlist,{" "}
						<u>
							{playlist.data?.Songs
								? playlist.data?.Songs.length
								: "0"}{" "}
							{playlist.data?.Songs &&
							playlist.data?.Songs.length == 1
								? "song"
								: "songs"}
						</u>{" "}
						will also be deleted.
					</div>
				</Modal.Body>
				<Modal.Footer>
					<Button
						variant="primary"
						onClick={() => setShowDeletePlaylistModal(false)}
					>
						Cancel
					</Button>
					<Button
						variant="secondary"
						onClick={() => {
							setShowDeletePlaylistModal(false);
							deletePlaylist();
						}}
					>
						Delete Playlist
					</Button>
				</Modal.Footer>
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
					console.error(error);
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
