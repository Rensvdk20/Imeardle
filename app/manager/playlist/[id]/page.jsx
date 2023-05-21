import PlaylistEdit from "../../../../components/playlist/edit/PlaylistEdit.jsx";
import "../../../../components/playlist/edit/playlistEdit.scss";

function editPlaylistPage({ params }) {
	return (
		<div className="container">
			<PlaylistEdit playlistId={params.id} />
		</div>
	);
}

export default editPlaylistPage;
