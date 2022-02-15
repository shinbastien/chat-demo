/*global YT*/
// Do not delete above comment

import React, { useState, useEffect, useRef } from "react";
import { useSocket } from "../lib/socket";
import { useLocation, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPause, faPlay } from "@fortawesome/free-solid-svg-icons";

import styled from "styled-components";

const Container = styled.div`
	display: flex;
	width: fit-content;

	flex-direction: column;

	> div {
		/* center */
		margin-left: auto;
		margin-right: auto;
		left: 0;
	}
`;
const VideoWrapper = styled.div``;

const VideoBarWrapper = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
	padding: 2%;

	> button {
		font-size: 2.5vw;
		cursor: pointer;
	}
`;

const ProgressBar = styled.span`
	position: relative;
	flex-grow: 10;
	height: 4px;
	background-color: rgb(138, 138, 138);

	#progress {
		position: absolute;
		width: 1%;
		height: 100%;
		z-index: 999;
		background-color: yellow;
	}
`;

function ShareVideo() {
	const { socket, connected } = useSocket();
	const youtubePlayer = useRef();
	const userVideo = useRef();
	const [videoID, setVideoID] = useState("");
	const [peers, setPeers] = useState([]);
	const location = useLocation();
	const { GroupID, userName } = location.state;
	const [playing, setPlaying] = useState(false);

	// console.log("groupID obtained from Home is: ", GroupID);
	// console.log("userName obtained from Home is: ", userName);

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
			height: "390",
			width: "640",
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

	function stopVideo() {
		// peersRef.current.forEach((item) => {
		//     item.peer.send(JSON.stringify({type: "pause"}));
		// })
		socket.emit("pause", GroupID);
		youtubePlayer.current.pauseVideo();
		setPlaying(false);
	}

	function playVideo() {
		// peersRef.current.forEach((item) => {
		//     item.peer.send(JSON.stringify({type: "play"}));
		// })
		socket.emit("play", GroupID);
		youtubePlayer.current.playVideo();
		setPlaying(true);
	}

	function loadVideo() {
		// peersRef.current.forEach((item) => {
		//     item.peer.send(JSON.stringify({type: "newVideo", data: videoID}));
		// })
		socket.emit("load", [GroupID, videoID]);
		youtubePlayer.current.loadVideoById(videoID.split("=")[1]);
	}

	function handleVideo(data) {
		if (data === "play") {
			console.log("play video");
			youtubePlayer.current.playVideo();
		} else if (data === "pause") {
			console.log("pause video");
			youtubePlayer.current.pauseVideo();
		} else {
			console.log("load video: ", data);
			youtubePlayer.current.loadVideoById(data.split("=")[1]);
		}
	}

	return (
		<>
			<Container>
				<VideoWrapper>
					<div id="player" ref={youtubePlayer} />
				</VideoWrapper>
				<VideoBarWrapper>
					{playing ? (
						<button onClick={stopVideo}>
							<FontAwesomeIcon icon={faPause} />
						</button>
					) : (
						<button onClick={playVideo}>
							<FontAwesomeIcon icon={faPlay} />
						</button>
					)}
					<ProgressBar>
						<div id="progress"></div>
					</ProgressBar>

					{/* <input
						type="text"
						placeholder="video link"
						value={videoID}
						onChange={(e) => setVideoID(e.target.value)}
					/> */}
					{/* <button onClick={loadVideo}>Load video</button> */}
				</VideoBarWrapper>
			</Container>
		</>
	);
}
export default ShareVideo;
