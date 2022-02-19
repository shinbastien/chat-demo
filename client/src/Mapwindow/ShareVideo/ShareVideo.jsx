/*global YT*/
// Do not delete above comment

import React, { useState, useEffect, useRef } from "react";
import { useSocket } from "../../lib/socket";
import { useLocation, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faPause,
	faPlay,
	faXmark,
	faVolumeHigh,
} from "@fortawesome/free-solid-svg-icons";

import styled from "styled-components";

const Container = styled.div`
	display: flex;
	width: fit-content;

	flex-direction: column;
	// border-radius: 12px;
	// -webkit-box-shadow: 6px 7px 7px 0px rgba(0, 0, 0, 0.47);
	// box-shadow: 6px 7px 7px 0px rgba(0, 0, 0, 0.47);
`;

const BarWrapper = styled.div`
	display: flex;

	> div {
		flex-grow: 10;
	}
	> button {
		padding-right: 2%;
		font-size: 3vw;
	}
`;
const VideoWrapper = styled.div`
	aspect-ratio: 16 / 9;
	width: 100%;
`;

const VideoBarWrapper = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
	padding: 2%;

	> button {
		font-size: 2vw;
		cursor: pointer;
		padding: 3%;
	}
`;

const ProgressBar = styled.span`
	position: relative;
	flex-grow: 10;
	height: 4px;
	background-color: rgb(138, 138, 138);
	cursor: pointer;

	#progress {
		position: absolute;
		width: 1%;
		height: 100%;
		z-index: 999;
		background-color: yellow;
	}
`;

function ShareVideo({ stateChanger, ...rest }) {
	const { socket, connected } = useSocket();
	const youtubePlayer = useRef();
	const userVideo = useRef();
	const [videoID, setVideoID] = useState("");
	const [peers, setPeers] = useState([]);
	const location = useLocation();
	const { GroupID, userName } = location.state;
	const [playing, setPlaying] = useState(false);

	useEffect(() => {
		const tag = document.createElement("script");
		tag.src = "https://www.youtube.com/iframe_api";
		var firstScriptTag = document.getElementsByTagName("script")[0];
		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
		window.onYouTubeIframeAPIReady = loadVideoPlayer;
		console.log("prepare youtube player", window.onYoutubeIframeAPIReady);
	}, []);

	function loadVideoPlayer() {
		const player = new YT.Player("player", {
			height: "400",
			width: "700",
			videoId: "dWZznGbsLbE",
			playerVars: {
				playsinline: 1,
				autoplay: 0,
				controls: 0,
				autohide: 1,
				wmode: "opaque",
				origin: "https://www.youtube.com",
			},
		});
		console.log("player is: ", player);
		youtubePlayer.current = player;
	}

	function handleVideo(data) {
		if (data === "play") {
			console.log("play video");
			socket.emit("play", GroupID);
			youtubePlayer.current.playVideo();
			setPlaying(true);
		} else if (data === "pause") {
			console.log("pause video");
			socket.emit("pause", GroupID);
			youtubePlayer.current.pauseVideo();
			setPlaying(false);
		} else {
			console.log("load video: ", data);
			socket.emit("load", [GroupID, videoID]);
			youtubePlayer.current.loadVideoById(data.split("=")[1]);
		}
	}

	return (
		<>
			<Container>
				{/* <BarWrapper>
					<div></div>
					<button onClick={() => stateChanger(false)}>
						<FontAwesomeIcon icon={faXmark} />
					</button>
				</BarWrapper> */}
				<VideoWrapper>
					<div id="player" ref={youtubePlayer} />
				</VideoWrapper>
				<VideoBarWrapper>
					{playing ? (
						<button onClick={() => handleVideo("pause")}>
							<FontAwesomeIcon icon={faPause} />
						</button>
					) : (
						<button onClick={() => handleVideo("play")}>
							<FontAwesomeIcon icon={faPlay} />
						</button>
					)}
					<ProgressBar>
						<div id="progress" max="100" value="0"></div>
					</ProgressBar>
					<button>
						<FontAwesomeIcon icon={faVolumeHigh} />
					</button>
				</VideoBarWrapper>
			</Container>
		</>
	);
}
export default React.memo(ShareVideo);
