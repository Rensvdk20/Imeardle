"use client";

import { useState, useEffect, useRef, useCallback } from "react";

import {
	BsPlayCircle,
	BsPauseCircle,
	BsMusicNoteBeamed,
	BsGithub,
	BsFillSkipForwardFill,
} from "react-icons/bs";

import ReactCanvasConfetti from "react-canvas-confetti";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import "./ImeardlePlayer.scss";

import dynamic from "next/dynamic";
const Player = dynamic(() => import("../../components/music/Player"), {
	ssr: false,
});

let songs = [];

const state = {
	playing: false,
	volume: 1,
	playedInSeconds: 0,
	played: 0,
	loaded: false,
};

const canvasStyles = {
	position: "fixed",
	pointerEvents: "none",
	width: "100%",
	height: "100%",
	top: 0,
	left: 0,
};

const ImeardlePlayer = () => {
	// ##### Imeardle player #####
	const playerRef = useRef(null);
	// const [songs, setSongs] = useState([]);
	const [playerState, setPlayerState] = useState(state);
	const { playing, volume, playedInSeconds } = playerState;

	const [modalMessageState, setModalMessageState] = useState("");
	const [randomizeButtonCooldown, setRandomizeButtonCooldown] =
		useState(false);

	const [guessed, setGuessedState] = useState(false);

	// Current song
	const [currentSong, setCurrentSong] = useState({
		songUrl: "",
		title: "",
		coverUrl: "",
	});

	// Guess states
	const guessStates = [2, 4, 8, 13, 20];
	const [guessState, setGuessState] = useState(guessStates[0]);
	const [guessesLeft, setGuessesLeft] = useState(guessStates.length);

	// User input
	const [userInput, setUserInput] = useState("");

	// Selected dropdownbox
	const [dropDownIndex, setDropDownIndex] = useState(0);

	useEffect(() => {
		//Get all songs
		loadAllSongs();

		document.addEventListener("keydown", function (e) {
			if (e.keyCode === "179") {
				e.preventDefault();
			}
		});
	}, []);

	//Load all the songs async from the database
	const loadAllSongs = async () => {
		const res = await fetch(
			"http://localhost:3000/api/playlist/clg8fn9ez0002vels65dz3l8k"
		);
		const data = await res.json();

		console.log(data.Songs);
		songs = data.Songs;

		// Randomize a song at the start
		randomizeSong();

		//Pause the player after the first song has been loaded
		setPlayerState({
			...state,
			playing: false,
			loaded: true,
		});
	};

	// Randomize a song from the given songs array
	const randomizeSong = (play = true) => {
		// Cooldown for the randomize button
		setRandomizeButtonCooldown(true);
		setTimeout(() => {
			setRandomizeButtonCooldown(false);
		}, 1000);

		// Reset guess state
		setGuessState(guessStates[0]);
		setGuessesLeft(guessStates.length);

		//Set guessed to false
		setGuessedState(false);

		// Set the song to the beginning
		handleStartFromBeginning();

		if (play) {
			handlePlay();
		}

		const randomSong = songs[Math.floor(Math.random() * songs.length)];
		setCurrentSong(randomSong);
		console.log(randomSong);
	};

	// ##### User input handlers #####
	const userInputHandler = (e) => {
		let lowerCaseInput = e.target.value.toLowerCase();
		setUserInput(lowerCaseInput);
	};

	const filteredSongs = songs
		.filter((song) => {
			if (userInput.input === "") {
				return song;
			} else {
				return song.title.toLowerCase().includes(userInput);
			}
		})
		.slice(0, 5);

	const handleGuessOnClick = (e) => {
		handleGuess(e.target.getAttribute("data-title"));
	};

	const handleGuess = (song) => {
		if (song === currentSong.title) {
			handleCorrectGuess();
		} else {
			// Check if input is empty
			if (userInput === "") {
				return;
			}

			handleIncorrectGuess();
		}
	};

	const handleCorrectGuess = () => {
		// Correct answer
		setModalMessageState("Congrats!");

		// View the song
		openModal();

		setGuessedState(true);

		// Empty user input & Set select dropdown item to 0
		setUserInput("");
		setDropDownIndex(0);

		// Put the song at the beginning
		handleStartFromBeginning();

		//Make the song fully play
		// setGuessState(guessStates[guessStates.length - 1]);
		setGuessState(29);

		// Play the song
		handlePlay();
	};

	const handleIncorrectGuess = () => {
		setUserInput("");
		setGuessesLeft(
			guessStates.length - guessStates.indexOf(guessState) - 1
		);
		if (guessState < 20) {
			increaseGuessState();
		} else {
			// No more guesses left
			setModalMessageState("Unlucky, try again!");
			openModal();
		}
	};

	const closeModalAndRandomizeNewSong = () => {
		//Close modal
		closeModal();

		//Wait for the modal to close
		setTimeout(() => {
			//Get a new song
			randomizeSong();
		}, 150);
	};

	const handleDropdownArrowKeys = (e) => {
		if (filteredSongs.length === 0) return;

		if (e.keyCode === 13) {
			return handleGuess(filteredSongs[dropDownIndex].title);
		}

		if (e.keyCode === 38) {
			if (dropDownIndex > 0) {
				return setDropDownIndex(dropDownIndex - 1);
			}

			return setDropDownIndex(filteredSongs.length - 1);
		}

		if (e.keyCode === 40) {
			if (dropDownIndex < filteredSongs.length - 1) {
				return setDropDownIndex(dropDownIndex + 1);
			}

			return setDropDownIndex(0);
		}

		if (e.key === "Tab") {
			e.preventDefault();
			return setUserInput(filteredSongs[dropDownIndex].title);
		}
	};

	// ##### Player handlers #####
	const handleProgress = (e) => {
		setPlayerState({
			...playerState,
			playedInSeconds: e.playedSeconds,
			played: e.played,
		});

		console.log("guessState", guessState);
		if (e.playedSeconds > guessState) {
			handleStartFromBeginning();
		}

		console.log(playerState);
	};

	// ##### Player controls #####

	const handlePlayPause = () => {
		setPlayerState({
			...playerState,
			playing: !playerState.playing,
		});
		console.log(playerState);
	};

	const handlePlay = () => {
		setPlayerState({
			...playerState,
			playing: true,
		});
	};

	const handleStartFromBeginning = () => {
		setPlayerState({
			...playerState,
			playing: false,
			playedInSeconds: 0,
			played: 0,
		});

		playerRef?.current?.seekTo(0);
	};

	// Game functions

	const increaseGuessState = () => {
		handleStartFromBeginning();
		setGuessState(guessStates[guessStates.indexOf(guessState) + 1]);
	};

	// ##### Confetti #####
	const refAnimationInstance = useRef(null);

	const getInstance = useCallback((instance) => {
		refAnimationInstance.current = instance;
	}, []);

	const makeShot = useCallback((particleRatio, opts) => {
		refAnimationInstance.current &&
			refAnimationInstance.current({
				...opts,
				origin: { y: 0.7 },
				particleCount: Math.floor(200 * particleRatio),
			});
	}, []);

	const fire = useCallback(() => {
		makeShot(0.25, {
			spread: 26,
			startVelocity: 55,
		});

		makeShot(0.2, {
			spread: 60,
		});

		makeShot(0.35, {
			spread: 100,
			decay: 0.91,
			scalar: 0.8,
		});

		makeShot(0.1, {
			spread: 120,
			startVelocity: 25,
			decay: 0.92,
			scalar: 1.2,
		});

		makeShot(0.1, {
			spread: 120,
			startVelocity: 45,
		});
	}, [makeShot]);

	// ##### Modal #####
	const [show, setShow] = useState(false);

	const closeModal = () => setShow(false);
	const openModal = () => {
		setShow(true);
		setTimeout(() => {
			fire();
		}, 500);
	};

	return (
		<div className="row player">
			<div className="col-12 col-sm-8 col-pps col-md-8 col-lg-6 col-xl-6 col-xxl-4">
				<div className="player-container">
					<div className="row">
						<div className="col-12 col-progress-bar">
							<div
								className="progress-bar"
								data-currenttime={
									playedInSeconds.toFixed(0) < 10
										? "0:0" + playedInSeconds.toFixed(0)
										: "0:" + playedInSeconds.toFixed(0)
								}
							>
								<div
									className={
										"progress-bar-container " +
										(playing ? "playing" : "")
									}
									style={{
										width: playedInSeconds * 3.5 + "%",
									}}
								>
									{guessStates.map((guessState, index) => (
										<div
											className="progress-bar-line"
											style={{
												width: guessState * 1.05 + "vw",
											}}
										></div>
									))}
								</div>
							</div>

							<p className="guesses-left">
								Guesses left: {guessesLeft}
							</p>
						</div>
						<div className="col-12 col-controls">
							<button
								className="btn btn-controls btn-play-pause"
								onClick={handlePlayPause}
								disabled={!playerState.loaded}
							>
								{playerState.playing ? (
									<BsPauseCircle size={40} />
								) : playerState.loaded ? (
									<BsPlayCircle size={40} />
								) : (
									<img
										className="loader"
										src="img/loader.svg"
										width={40}
									/>
								)}
							</button>
							<button
								className="btn btn-controls btn-randomize"
								onClick={randomizeSong}
								disabled={randomizeButtonCooldown}
							>
								<BsMusicNoteBeamed size={40} />
							</button>
						</div>
						<div className="col-12 col-search-box">
							<div className="search-box">
								<button
									className="btn btn-skip"
									onClick={handleIncorrectGuess}
								>
									<BsFillSkipForwardFill />
								</button>
								<input
									type="text"
									value={userInput}
									onChange={userInputHandler}
									onKeyDown={handleDropdownArrowKeys}
									placeholder={
										guessed
											? "Randomize a new song"
											: "Guess the song..."
									}
									disabled={guessed ? true : false}
								/>
								<ul
									className={
										userInput.length === 0 ? "hide" : ""
									}
								>
									{filteredSongs.map((song, index) => (
										<li
											key={index}
											data-title={song.title}
											onClick={handleGuessOnClick}
											className={
												index === dropDownIndex
													? "active"
													: ""
											}
										>
											{song.title}
										</li>
									))}
								</ul>
							</div>
						</div>
					</div>

					<Player
						id="player"
						playerRef={playerRef}
						playing={playing}
						currentSongUrl={currentSong ? currentSong.songUrl : ""}
						volume={volume}
						handleProgress={handleProgress}
					/>

					<Modal show={show} onHide={closeModal} centered>
						<Modal.Body>
							<img
								src={currentSong ? currentSong.coverUrl : ""}
								alt="album cover"
							/>
							<h1>{currentSong ? currentSong.title : ""}</h1>
							<h2>{modalMessageState}</h2>
						</Modal.Body>
						<Modal.Footer>
							<Button variant="secondary" onClick={closeModal}>
								Close
							</Button>
							<Button
								variant="primary"
								onClick={closeModalAndRandomizeNewSong}
							>
								New Song
							</Button>
						</Modal.Footer>

						<ReactCanvasConfetti
							refConfetti={getInstance}
							style={canvasStyles}
						/>
					</Modal>
				</div>
				<a
					href="https://github.com/Rensvdk20"
					rel="noreferrer"
					target="_blank"
				>
					<BsGithub size={20} id="github" />
				</a>
			</div>
		</div>
	);
};

export default ImeardlePlayer;
