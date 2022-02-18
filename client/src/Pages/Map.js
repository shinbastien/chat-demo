import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import NewMapwindow from "../Mapwindow/NewMapwindow";
import VideoCall from "../VideoCall/VideoCall";
import Grid from "@mui/material/Grid";
import AppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";
import logoWhite from "../Styles/source/logo_w.png";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";

import { readFromFirebase, searchOnYoutube } from "../lib/functions/firebase";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { useSocket } from "../lib/socket";
import styled from "styled-components";

const ImgWrapper = styled.img`
	display: block;
	width: 10%;
`;
const SOCKET_SERVER_URL = "http://localhost:4000";

const TextWrapper = styled.span`
	display: flex;
	justify-content: center; /* align horizontal */
	align-items: center; /* align vertical */
`;

function Map() {
	const location = useLocation();
	const [keepPlace, setKeepPlace] = useState([]);
	const [loading, setLoading] = useState(false);

	const { groupID, userName } = location.state;
	console.log("groupID obtained from Home is: ", groupID);
	console.log("userName obtained from Home is: ", userName);

	const { socket, connected } = useSocket();
	console.log("connected is: ", connected);

	const onHandleCopy = (e) => {
		navigator.clipboard.writeText(window.location.href);
		alert("url이 복사되었습니다.");
	};

	useEffect(() => loadKeepList(), []);

	useEffect(() => {
		if (socket && connected) {
			console.log("socket id is:", socket.id);
			socket.emit("join", groupID, userName);
			console.log("joining group");
		}
	}, [connected, socket]);

	const loadKeepList = async () => {
		setLoading(true);
		readFromFirebase("photos")
			.then((data) => {
				setKeepPlace(data);
				setLoading(false);
			})
			.catch((error) => {
				setLoading(false);
			});

		console.log("i am loaded");
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
					<IconButton style={{ color: "white" }} onClick={onHandleCopy}>
						<FontAwesomeIcon icon={faArrowUpRightFromSquare} />
					</IconButton>
					<Box sx={{ flexGrow: 1 }}></Box>

					<TextWrapper>{groupID}&nbsp; 그룹 화면</TextWrapper>
				</Typography>
			</AppBar>
			<Grid container spacing={2} style={{ marginTop: 40 }}>
				<Grid item xs={6} md={9}>
					<NewMapwindow
						userName={userName}
						keepPlace={keepPlace}
					></NewMapwindow>
				</Grid>
				<Grid item xs={6} md={3}>
					<VideoCall
						roomName={groupID}
						userName={userName}
						loading={loading}
					></VideoCall>
				</Grid>
			</Grid>
		</>
	);
}

export default Map;
