import { getServerSession } from "next-auth";
import { authOptions } from "../../../../pages/api/auth/[...nextauth]";
import { redirect } from "next/navigation";

import PlaylistEdit from "../../../../components/playlist/edit/PlaylistEdit.jsx";
import "../../../../components/playlist/edit/playlistEdit.scss";
import { isPlaylistOwner } from "../../../../components/playlist/actions";

async function editPlaylistPage({ params }) {
	const session = await getServerSession(authOptions);
	if (!session) redirect("/api/auth/signin?callbackUrl=/manager");

	if(!await isPlaylistOwner(params.id)) redirect("/manager");

	return (
		<div className="container">
			<PlaylistEdit playlistId={params.id} />
		</div>
	);
}

export default editPlaylistPage;
