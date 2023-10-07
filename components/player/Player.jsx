"use client";

import { Fragment } from "react";
import ReactPlayer from "react-player/lazy";

function Player({
	playerRef,
	playing,
	currentSongUrl,
	volume,
	handleProgress,
	onError,
}) {
	return (
		<Fragment>
			<ReactPlayer
				id="player"
				ref={playerRef}
				playing={playing}
				url={currentSongUrl}
				volume={volume}
				onProgress={handleProgress}
				onError={onError}
			/>
		</Fragment>
	);
}

export default Player;
