import React, { useState, useEffect, useRef } from "react";
import { useSocket } from "../lib/socket";
import { useLocation, Link } from "react-router-dom";
import VideoCall from "../VideoCall/VideoCall";
import Peer from "simple-peer";
import styled from "styled-components";
import { StyledVideo, Video, videoConstraints } from "../VideoCall/videostyle";
import AppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";
import logoWhite from "../Styles/source/logo_w.png";
import ShareIcon from "@material-ui/icons/Share";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import { MenuItem } from "@mui/material";

const ImgWrapper = styled.img`
	display: block;
	width: 10%;
`;

const TextWrapper = styled.span`
	display: flex;
	justify-content: center; /* align horizontal */
	align-items: center; /* align vertical */
`;

const Container = styled.div`
	display: flex;
	width: 100%;
	height: 100vh;
	flex-direction: row;
`;

const LeftRow = styled.div`
	width: 40%;
	height: 100%;
`;

const RightRow = styled.div`
	flex: 1;
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
`;

// const Video = styled.video`
//     height: 50%;
//     width: 100%;
//     border: 1px solid black;
// `;

function ShareVideo() {
	const { socket, connected } = useSocket();
	const youtubePlayer = useRef();
	const userVideo = useRef();
	const [videoID, setVideoID] = useState("");
	const [peers, setPeers] = useState([]);
	const location = useLocation();
	const { GroupID, userName } = location.state;
	console.log("groupID obtained from Home is: ", GroupID);
	console.log("userName obtained from Home is: ", userName);
	const [anchorEl, setAnchorEl] = React.useState(null);

	const open = Boolean(anchorEl);

	useEffect(() => {
		const tag = document.createElement("script");
		tag.src = "https://www.youtube.com/iframe_api";
		var firstScriptTag = document.getElementsByTagName("script")[0];
		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
		window.onYouTubeIframeAPIReady = loadVideoPlayer;
		console.log("prepare youtube player", window.onYoutubeIframeAPIReady);
	}, []);

	useEffect(() => {
		if (connected) {
			socket.emit("join group", { GroupID: GroupID, userName: userName });
			console.log("joining group in ShareVideo");
		}

		socket.emit("start shareVideo", GroupID);
		socket.on("ShareVideoAction", (data) => {
			handleVideo(data);
		});
	}, [socket]);

	function loadVideoPlayer() {
		const player = new window.YT.Player("player", {
			height: "390",
			width: "640",
			playerVars: {
				playsinline: 1,
				autoplay: 1,
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
	}

	function playVideo() {
		// peersRef.current.forEach((item) => {
		//     item.peer.send(JSON.stringify({type: "play"}));
		// })
		socket.emit("play", GroupID);
		youtubePlayer.current.playVideo();
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

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	return (
		<>
			<AppBar postiion="static" style={{ backgroundColor: "#151ca2" }}>
				<Typography
					variant="h5"
					noWrap
					component="div"
					sx={{ mr: 2, display: { xs: "none", md: "flex" } }}
				>
					<ImgWrapper src={logoWhite}></ImgWrapper>
					<IconButton style={{ color: "white" }}>
						<ShareIcon></ShareIcon>
					</IconButton>
					<Box sx={{ flexGrow: 1 }}></Box>

					<Button
						id="basic-button"
						aria-controls={open ? "basic-menu" : undefined}
						aria-haspopup="true"
						aria-expanded={open ? "true" : undefined}
						onClick={handleClick}
						style={{ color: "white" }}
					>
						<TextWrapper>{GroupID}&nbsp; 공유 화면</TextWrapper>
					</Button>
					<Menu
						anchorEl={anchorEl}
						open={open}
						MenuListProps={{
							"aria-labelledby": "basic-button",
						}}
						onClose={handleClose}
					>
						<MenuItem>
							<Link
								to={`/${GroupID}/search`}
								state={{
									groupID: GroupID,
									userName: userName,
								}}
							>
								<TextWrapper>{GroupID}&nbsp; 개인 화면</TextWrapper>
							</Link>
						</MenuItem>

						<MenuItem>
							<Link
								to={`/${GroupID}`}
								state={{
									groupID: GroupID,
									userName: userName,
								}}
							>
								<TextWrapper>{GroupID}&nbsp; 그룹 화면</TextWrapper>
							</Link>
						</MenuItem>
					</Menu>
				</Typography>
			</AppBar>
			<Container>
				<LeftRow>
					<VideoCall groupID={GroupID} userName={userName}>
						{" "}
					</VideoCall>
				</LeftRow>

				<RightRow>
					<div id="player" />
					<button onClick={stopVideo}>Stop Video</button>
					<button onClick={playVideo}>Play Video</button>
					<input
						type="text"
						placeholder="video link"
						value={videoID}
						onChange={(e) => setVideoID(e.target.value)}
					/>
					<button onClick={loadVideo}>Load video</button>
				</RightRow>
			</Container>
		</>
	);
}
export default ShareVideo;
