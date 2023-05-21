import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

import "./playlistAdd.scss";

async function addPlaylist(playlist) {
	"use server";

	await fetch(`${process.env.WEBSITE_URL}/api/playlist/`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			name: playlist.get("name"),
			coverUrl: playlist.get("coverUrl"),
		}),
	});

	revalidateTag(["playlists"]);
	revalidatePath("/manager");
}

function PlaylistAdd() {
	return (
		<div className="playlistAdd">
			<form action={addPlaylist}>
				<h2>Add playlist</h2>
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
				<div className="form-item">
					<label>
						<span>Cover url:</span>
						<input
							type="text"
							placeholder="Ex. https://i.imgur.com/GHkIb4B.jpg"
							name="coverUrl"
							id="coverUrl"
						/>
					</label>
				</div>
				<button className="btn btn-secondary" type="submit">
					Submit
				</button>
			</form>
		</div>
	);
}

export default PlaylistAdd;
