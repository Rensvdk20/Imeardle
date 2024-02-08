"use client";

import { useSearchParams } from "next/navigation";

import ImeardlePlayer from "../components/player/ImeardlePlayer";

import { BsGithub } from "react-icons/bs";
import { SiKofi } from "react-icons/si";

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
					<a
						href="https://github.com/Rensvdk20"
						aria-label="Github"
						target="_blank"
					>
						<BsGithub size={20} />
					</a>
				</div>
				<div className="footer-divider">|</div>
				<div className="footer-item">
					<a
						href="https://ko-fi.com/rensvdk"
						aria-label="Kofi"
						target="_blank"
					>
						<SiKofi size={22} />
					</a>
				</div>
			</div>
		</div>
	);
}

export default App;
