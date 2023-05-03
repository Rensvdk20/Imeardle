import PlaylistDetail from "../../../components/playlist/detail/PlaylistDetail";
import "../../../components/playlist/detail/playlistDetail.scss";

async function PlaylistDetailPage({ params }) {
	return (
		<div className="container">
			<div className="row">
				<PlaylistDetail params={params} />
			</div>
		</div>
	);
}

export default PlaylistDetailPage;
