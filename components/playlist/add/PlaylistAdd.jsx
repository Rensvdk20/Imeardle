"use client";

import { addPlaylistAction } from "../actions.jsx";
import toast, { Toaster } from "react-hot-toast";

import "./playlistAdd.scss";
import { useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image.js";

function PlaylistAdd() {
	const [newPlaylistImage, setPlaylistImage] = useState(
		"/img/placeholder.jpeg"
	);

	const messageUploadImageError = () => toast.error("Error uploading image");
	const messageUploadImageSuccess = () =>
		toast.success("Image uploaded successfully");
	const messageNameTooShort = () =>
		toast.error("Name must be at least 3 characters long");
	const messageNoImageSelected = () => toast.error("No image selected");

	async function addPlaylist(playlist) {
		const name = playlist.get("name");
		const coverUrl = newPlaylistImage;

		if (name.length < 3) return messageNameTooShort();
		if (newPlaylistImage.length < 1) return messageNoImageSelected();

		toast.loading("Adding playlist...", {
			id: "message",
		});

		const result = await addPlaylistAction({
			name,
			coverUrl,
		});

		if (result.status !== 201) {
			return toast.error(result.message, {
				id: "message",
			});
		}

		return toast.success(`Playlist ${name} added!`, {
			id: "message",
		});
	}

	return (
		<div className="playlistAdd">
			<form
				action={(formData) => {
					addPlaylist(formData);
				}}
			>
				<h2>Add playlist</h2>
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
							setPlaylistImage(result.info.secure_url);
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
							name="name"
							id="name"
						/>
					</label>
				</div>
				<button className="btn btn-secondary" type="submit">
					Submit
				</button>
			</form>
			<Toaster
				position="top-right"
				toastOptions={{
					className: "toaster",
				}}
			/>
		</div>
	);
}

export default PlaylistAdd;
