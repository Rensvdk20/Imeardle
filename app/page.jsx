"use client";

import { useSearchParams } from "next/navigation";

import ImeardlePlayer from "../components/player/ImeardlePlayer";

import "./page.scss";

export const metadata = {
	title: "Imeardle - Guess the song",
};

function App() {
	const searchParams = useSearchParams();
	const playlistId = searchParams.get("playlistId");

	return (
		<div className="playerContainer">
			<ImeardlePlayer playlistId={playlistId} />
		</div>
	);
}

export default App;
