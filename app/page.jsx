"use client";

import { useSearchParams } from "next/navigation";

import ImeardlePlayer from "../components/player/ImeardlePlayer";

import { BsGithub } from "react-icons/bs";

import "./page.scss";

function App() {
	const searchParams = useSearchParams();
	const playlistId = searchParams.get("playlistId");

	return (
		<div>
			<div className="playerContainer">
				<ImeardlePlayer playlistId={playlistId} />
			</div>
			<div className="footer">
				<div className="footer-item">
					<a href="https://github.com/Rensvdk20" target="_blank">
						<BsGithub size={20} />
					</a>
				</div>
				<div className="footer-divider">|</div>
				<div className="footer-item">
					<a href="/privacy-policy.html" target="_blank">
						Privacy Policy
					</a>
				</div>
			</div>
		</div>
	);
}

export default App;
