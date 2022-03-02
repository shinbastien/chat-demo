import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import NewMapwindow from "../Mapwindow/NewMapwindowTest";
import VideoCall from "../VideoCall/VideoCall";
import Grid from "@mui/material/Grid";
import { HostContext } from "../lib/Context/HostContext";
import Snackbar from "@mui/material/Snackbar";

import { useSocket } from "../lib/socket";
import styled from "styled-components";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
	return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function Map() {
	const location = useLocation();
	const [onloading, setonLoading] = useState(false);
	// const [hostUser, setHostUser] = useState({
	// 	type: "host",
	// 	userName: "abc",
	// });
	const [sendShare, setSendShare] = useState(false);
	const [open, setOpen] = useState(false);

	const { groupID, userName } = location.state;
	console.log("groupID obtained from Home is: ", groupID);
	console.log("userName obtained from Home is: ", userName);

	const { socket, connected } = useSocket();
	console.log("connected is: ", connected);
	const randomColor = "#"+ Math.floor(Math.random()*16777215).toString(16);

	useEffect(() => {
		if (socket && connected) {
			console.log("socket id is:", socket.id);
			
			socket.emit("join", groupID, userName, randomColor);
			console.log("joining group");
		}
	}, [connected, socket]);

	const handleClose = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}
		setOpen(false);
	};

	return (
		<>
			<HostContext.Provider
				value={([sendShare, setSendShare], [open, setOpen])}
			>
				<Grid container spacing={2}>
					<Grid item xs={6} md={9}>
						<NewMapwindow userName={userName} color={randomColor}></NewMapwindow>
					</Grid>
					<Grid item xs={6} md={3}>
						<VideoCall
							roomName={groupID}
							userName={userName}
							userColor={randomColor}
							loading={onloading}
						></VideoCall>
					</Grid>
				</Grid>
				<Snackbar
					anchorOrigin={{ vertical: "top", horizontal: "center" }}
					open={open}
					onClose={handleClose}
				>
					<Alert onClose={handleClose} severity="info" sx={{ width: "100%" }}>
						You are sharing Host
					</Alert>
				</Snackbar>
			</HostContext.Provider>
		</>
	);
}

export default Map;
