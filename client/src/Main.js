import React, { useState, useRef, useEffect } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import io from "socket.io-client";
import {addPeer, createPeer, disconnectPeer} from "./lib/peer/peers";
import Peer from "simple-peer";
import Grid from "@mui/material/Grid";
import AppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";
import logoWhite from "./Styles/source/logo_w.png";
import styled from "styled-components";
import NewMapwindow from "./Mapwindow/NewMapwindow";
import VideoCall from "./VideoCall/VideoCall";
import { StyledVideo, Video, videoConstraints } from "./VideoCall/videostyle";

const ImgWrapper = styled.img`
	display: block;
	width: 10%;
`;

const SOCKET_SERVER_URL = "http://localhost:4000";
const delay = require("delay");

function Main() {
    const [peers, setPeers] = useState({});
	const [participants, setParticipants] = useState([]);
	const [isNew, setIsNew] = useState(true);
	const [stream, setStream] = useState(null);
	const [peerStreams, setPeerStreams] = useState({});
	const socket = useRef();
	const userVideo = useRef();
	const peersRef = useRef([]);


    const location = useLocation();
	const {roomName, userName}= location.state;
	console.log("groupID obtained from Home is: ", roomName);
	console.log("userName obtained from Home is: ", userName);

    // build socket connection
	useEffect(() => {
		socket.current = io(SOCKET_SERVER_URL, { query : 
			{
			groupID : roomName,
			userName: userName,
			}
		});


	
		socket.current.emit("join", roomName, userName)

		socket.current.on("joinResponse", participants => {
			if (isNew) {
				const peerlist = createPeer(roomName, userName, participants, peers, peerStreams, socket);
				setPeers(peerlist);
				console.log(peerlist);
			}
			else {
				const peerlist = addPeer(roomName, userName, participants, peers, peerStreams, socket);
				setPeers(peerlist);
				console.log(peerlist);
			}
			// setIsNew not working right now ...
			setIsNew(false);
			console.log("changed isnew", isNew);
			setParticipants(participants)
		})

		socket.current.on("RTC_answer", async(offerer, receiver, data) => {
			try {
				if (receiver === userName) {
					while(!Object.keys(peers).includes(offerer)) {
						await delay(100);
					}
					peers[offerer].signal(data);
				}
			} catch (error) {
				console.log(error);
			}
		})

		socket.current.on("disconnectResponse", (participants, userName) => {
			setParticipants(participants);
			const peerlist = disconnectPeer(peers, userName);
			setPeers(peerlist);

		})

		navigator.mediaDevices
		.getUserMedia({ video: videoConstraints, audio: true })
		.then((stream) => {
			if(stream) {
				console.log("stream is okay");
			}
			if (userVideo.current) {
				userVideo.current.srcObject = stream;
				console.log("uservideo okay");
			}
			
			setStream(stream);
			Object.values(peers).forEach((p) => {
				try {
					p.addStream(stream);
				} catch (error) {
					console.log(error);
				}
			});
		})

	}, [socket])

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
				<NewMapwindow socket={socket}></NewMapwindow>
			</Grid>
			<Grid item xs={6} md={4}>
				<VideoCall groupID = {roomName} userName={userName} peers = {peers} peerStreams={peerStreams}></VideoCall>
			</Grid>
		</Grid>
	</>
	)
}
export default Main;