import React, { useState, useEffect, useContext } from "react";
import { useLocation, Link } from "react-router-dom";
import NewMapwindow from "../Mapwindow/NewMapwindowTest";
import VideoCall from "../VideoCall/VideoCall";
import Grid from "@mui/material/Grid";
import AppBar from "@mui/material/AppBar";
import { HostContext } from "../lib/Context/HostContext";

import { useSocket } from "../lib/socket";
import styled from "styled-components";

import Typography from "@mui/material/Typography";
import logoWhite from "../Styles/source/logo_w.png";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";

const ImgWrapper = styled.img`
	display: block;
	width: 10%;
`;

const TextWrapper = styled.span`
	display: flex;
	justify-content: center; /* align horizontal */
	align-items: center; /* align vertical */
`;

function Map() {
	const location = useLocation();
	const [onloading, setonLoading] = useState(false);
	const [hostUser, setHostUser] = useState({
		type: "host",
		userName: "abc",
	});

	const { groupID, userName } = location.state;
	console.log("groupID obtained from Home is: ", groupID);
	console.log("userName obtained from Home is: ", userName);

	const { socket, connected } = useSocket();
	console.log("connected is: ", connected);

	//URL 복사
	const onHandleCopy = (e) => {
		navigator.clipboard.writeText(window.location.href);
		alert("url이 복사되었습니다.");
	};

	useEffect(() => {
		if (socket && connected) {
			console.log("socket id is:", socket.id);
			socket.emit("join", groupID, userName);
			console.log("joining group");
		}
	}, [connected, socket]);

	return (
		<>
			{/* <AppBar style={{ backgroundColor: "#003249" }}>
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
			</AppBar> */}

			<HostContext.Provider value={[hostUser, setHostUser]}>
				<Grid container spacing={2}>
					<Grid item xs={6} md={9}>
						<NewMapwindow userName={userName}></NewMapwindow>
					</Grid>
					<Grid item xs={6} md={3}>
						<VideoCall
							roomName={groupID}
							userName={userName}
							loading={onloading}
						></VideoCall>
					</Grid>
				</Grid>
			</HostContext.Provider>
		</>
	);
}

export default Map;
