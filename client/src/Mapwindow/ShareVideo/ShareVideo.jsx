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
	faBookmark,
} from "@fortawesome/free-solid-svg-icons";
import IconButton from "@mui/material/IconButton";

import styled from "styled-components";
import { writeToPlaceData } from "../../lib/functions/firebase";
import { useMemo } from "react";
import axios from "axios";

const Container = styled.div`
	display: flex;
	width: 100%;
	padding: 3% 0 3% 0;

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
	pointer-events: none;
`;

const VideoBarWrapper = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
	padding: 2% 0 2% 0;

	&:hover {
		background-color: #f5f5f5;
	}

	> button {
		font-size: 1vw;
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

function ShareVideo({ stateChanger, userName, videoName }) {
	const { socket, connected } = useSocket();
	const youtubePlayer = useRef();

	const userVideo = useRef();
	const [videoID, setVideoID] = useState(videoName);
	const [peers, setPeers] = useState([]);
	const location = useLocation();
	const [playing, setPlaying] = useState(false);
	const [nextPlaying, setNextPlaying] = useState(false);
	const [saveActive, setSaveActive] = useState(false);
	const [videoContent, setVideoContent] = useState(null);

	const [data, setData] = useState({
		groupId: "abcde",
		coords: {
			lng: null,
			lat: null,
		},
		userId: "abcde",
		placeId: "abcde",
		poiId: "abcde",
		visited: false,
	});

	const handleClick = async (event) => {
		setSaveActive(!saveActive);
	};
	useEffect(async () => {
		if (saveActive) {
			await writeToPlaceData(data);
		}
	}, [saveActive]);

	// console.log("videoName is: ", videoID);

	useMemo(() => {
		setVideoID(videoName);
	}, [videoName]);

	useEffect(() => {
		if (!window.YT) {
			const tag = document.createElement("script");
			tag.src = "https://www.youtube.com/iframe_api";
			var firstScriptTag = document.getElementsByTagName("script")[0];
			firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

			window.onYouTubeIframeAPIReady = loadVideoPlayer;
			// console.log("prepare youtube player", window.onYoutubeIframeAPIReady);
		} else {
			loadVideoPlayer();
			// console.log("prepare youtube player", window.onYoutubeIframeAPIReady);
		}
	}, []);

	useEffect(() => {
		if (nextPlaying) {
			youtubePlayer.current.cueVideoByUrl(
				`http://www.youtube.com/v/${videoID}?version=3`,
			);
		}

		async function loadVideoOnYouTube(videoID) {
			const API_URL = "https://www.googleapis.com/youtube/v3/videos";
			try {
				const {
					data: { items },
				} = await axios(API_URL, {
					method: "GET",
					params: {
						key: process.env.REACT_APP_YOUTUBE_API_KEY,
						part: ["contentDetails"],
						id: videoID,
					},
				});

				return items;
			} catch (err) {
				console.log(err);
			}
		}

		loadVideoOnYouTube(videoID).then((obj) => {
			setVideoContent(obj[0]);
		});
	}, [videoID]);

	console.log(videoContent);

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

		// console.log("player is: ", player);
		youtubePlayer.current = player;
	}

	// function moveProgressBar() {
	// 	const totalTime = videoPlayer.duration;
	// 	const rate = 100 / totalTime;
	// 	console.log("totalTime: ", rate);

	// 	if (i === 0) {
	// 		i = 1;
	// 		var width = 1;
	// 		var id = setInterval(frame, 1000);

	// 		function frame() {
	// 			if (width * rate >= 100) {
	// 				clearInterval(id);

	// 				width = 0;
	// 				progressBar.style.width = "0%";
	// 				videoPlayer.autoplay = true;
	// 			} else {
	// 				width++;
	// 				progressBar.style.width = width * rate + "%";
	// 			}
	// 		}
	// 	}
	// }

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

					<IconButton onClick={handleClick}>
						<FontAwesomeIcon
							style={{ color: saveActive ? "red" : "#7B7B7B" }}
							icon={faBookmark}
						/>
					</IconButton>
				</VideoBarWrapper>
			</Container>
		</>
	);
}
export default React.memo(ShareVideo);
