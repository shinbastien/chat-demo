import React, { useState, useEffect } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import NewMapwindow from "../Mapwindow/NewMapwindow";
import VideoCall from "../VideoCall/VideoCall";
import Grid from "@mui/material/Grid";
import AppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";
import logoWhite from "../Styles/source/logo_w.png";

import { useSocket } from "../lib/socket";
import styled from "styled-components";

const ImgWrapper = styled.img`
	display: block;
	width: 10%;
`;
const SOCKET_SERVER_URL = "http://localhost:4000";

function Map() {

	const location = useLocation();
	const {groupID, userName}= location.state;
	console.log("groupID obtained from Home is: ", groupID);
	console.log("userName obtained from Home is: ", userName);

	const {socket, connected} = useSocket();
	console.log("check socket: ", socket.id);
	console.log("check connected: " ,connected);
	
	useEffect(() => {
		if (connected) {
			socket.emit("join group", {GroupID: groupID, userName: userName});
			console.log("joining group");
		}
	}, [])
	


	return (
		<>
			<AppBar postiion="static" style={{ backgroundColor: "#151ca2" }}>
				<Typography
					variant="h6"
					noWrap
					component="div"
					sx={{ mr: 2, display: { xs: "none", md: "flex" } }}
				>
					<ImgWrapper src={logoWhite}></ImgWrapper>
				</Typography>
			</AppBar>
			<Grid container spacing={2} style={{ marginTop: 60 }}>
				<Grid item xs={6} md={8}>
					<NewMapwindow></NewMapwindow>
				</Grid>
				<Grid item xs={6} md={4}>
					<VideoCall groupID = {groupID} userName={userName}></VideoCall>
				</Grid>
			</Grid>
		</>
	);
}

export default Map;
