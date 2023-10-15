import PlaylistOverview from "../../components/playlist/overview/PlaylistOverview";
import "../../components/playlist/overview/PlaylistOverview.scss";

export const metadata = {
	title: "Imeardle - Playlists",
};

function PlaylistOverviewPage() {
	return (
		<div className="container">
			<div className="row">
				<PlaylistOverview />
			</div>
		</div>
	);
}

export default PlaylistOverviewPage;
