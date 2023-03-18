import { Fragment } from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import ImeardlePlayer from "../components/music/ImeardlePlayer";
import "../shared/styles/global.scss";

export const metadata = {
	title: "Imeardle - Guess the song",
};

function App() {
	return (
		<Fragment>
			<ImeardlePlayer />
		</Fragment>
	);
}

export default App;
