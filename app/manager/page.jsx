import PlaylistAdd from "../../components/playlist/add/PlaylistAdd";
import MyPlaylist from "../../components/playlist/my-playlists/myPlaylist";

import "./page.scss";

function ManagerPage() {
	return (
		<div className="manager">
			<div className="container-fluid">
				<div className="row">
					<div className="col-lg-6 col-xl-4 column-left">
						<PlaylistAdd />
					</div>
					<div className="col-lg-6 col-xl-8  column-right">
						<MyPlaylist />
					</div>
				</div>
			</div>
		</div>
	);
}

export default ManagerPage;
