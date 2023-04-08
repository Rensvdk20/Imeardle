import { Fragment } from "react";

import ImeardlePlayer from "../components/music/ImeardlePlayer";

import "./page.scss";

export const metadata = {
	title: "Imeardle - Guess the song",
};

function App() {
	return (
		<div className="playerContainer">
			<ImeardlePlayer />
		</div>
	);
}

export default App;
