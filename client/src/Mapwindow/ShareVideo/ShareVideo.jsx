/*global YT*/
// Do not delete above comment

import React, { useState, useEffect, useRef } from "react";
import { useSocket } from "../../lib/socket";
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faPause,
	faPlay,
	faVolumeHigh,
	faEllipsisVertical,
} from "@fortawesome/free-solid-svg-icons";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Emoji from "./Emoji";

import styled from "styled-components";
import { writeToPlaceData } from "../../lib/functions/firebase";

const Container = styled.div`
	display: flex;
	width: 100%;

	flex-direction: column;
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

const EmojiWrapper = styled.div`
	display: flex;
	justify-content: space-between;
	font-size: 4vw;
	align-items: center;
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

function ShareVideo({ stateChanger, userName, videoName }) {
	const { socket, connected } = useSocket();
	const youtubePlayer = useRef();
	const userVideo = useRef();
	// console.log("videoName is: ", videoName);
	const [videoID, setVideoID] = useState(videoName);
	const [peers, setPeers] = useState([]);
	const location = useLocation();
	const [playing, setPlaying] = useState(false);
	const [nextPlaying, setNextPlaying] = useState(false);

	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);

	const [data, setData] = useState({
		groupId: "a",
		coords: "a",
		userId: "a",
		placeId: "a",
		visited: false,
	});

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = async () => {
		setAnchorEl(null);
		console.log(data);
		await writeToPlaceData(data);
	};

	useEffect(() => {
		if (!window.YT) {
			const tag = document.createElement("script");
			tag.src = "https://www.youtube.com/iframe_api";
			var firstScriptTag = document.getElementsByTagName("script")[0];
			firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

			window.onYouTubeIframeAPIReady = loadVideoPlayer;
			console.log("prepare youtube player", window.onYoutubeIframeAPIReady);
		} else {
			loadVideoPlayer();
			console.log("prepare youtube player", window.onYoutubeIframeAPIReady);
		}
	}, []);

	useEffect(() => {
		const handleVideoSocket = (data) => {
			if (data === "play") {
				console.log("play video");
				youtubePlayer.current.playVideo();
				setPlaying(true);
			} else if (data === "pause") {

				console.log("pause video");
				youtubePlayer.current.pauseVideo();
				setPlaying(false);
			} else {
				console.log("load video: ", data);
				youtubePlayer.current.loadVideoById(data.split("=")[1]);
			}
		};


		if (socket && connected) {
			socket.on("ShareVideoAction", handleVideoSocket);
		}
		return () => {
			if (socket && connected) {
				socket.off("ShareVideoAction", handleVideoSocket);
			}
		};
	}, [socket, connected]);

	function loadVideoPlayer() {
		const player = new YT.Player("player", {
			height: "100%",
			width: "100%",
			videoId: videoID,
			playerVars: {
				playsinline: 1,
				autoplay: 0,
				controls: 0,
				autohide: 1,
				wmode: "opaque",
				origin: "https://www.youtube.com",
			},
		});
		setNextPlaying(true);

		console.log("player is: ", player);
		youtubePlayer.current = player;
	}

	function handleVideo(data) {
		if (data === "play") {
			console.log("play video");
			socket.emit("play", userName);
			youtubePlayer.current.playVideo();
			setPlaying(true);
		} else if (data === "pause") {
			console.log("pause video");
			socket.emit("pause", userName);
			youtubePlayer.current.pauseVideo();
			setPlaying(false);
		} else {
			console.log("load video: ", data);
			socket.emit("load", (userName, videoID));
			youtubePlayer.current.loadVideoById(data.split("=")[1]);
			setPlaying(false);
		}
	}

	return (
		<>
			<Container>
				공유중
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

					<IconButton
						aria-controls={open ? "basic-menu" : undefined}
						aria-haspopup="true"
						aria-expanded={open ? "true" : undefined}
						onClick={handleClick}
					>
						<FontAwesomeIcon icon={faEllipsisVertical} />
					</IconButton>
					<Menu
						id="basic-menu"
						anchorEl={anchorEl}
						open={open}
						onClose={handleClose}
						MenuListProps={{
							"aria-labelledby": "basic-button",
						}}
					>
						<MenuItem onClick={handleClose}>🏃🏻‍♀️ Save to Keep</MenuItem>
					</Menu>
				</VideoBarWrapper>
				{/* <EmojiWrapper>
					<Emoji symbol="😍" label="love" />
					<Emoji symbol="🤔" label="hmm" />
					<Emoji symbol="😱" label="euo" />
					<Emoji symbol="🤗" label="yes" />
				</EmojiWrapper> */}
			</Container>
		</>
	);
}
export default React.memo(ShareVideo);
