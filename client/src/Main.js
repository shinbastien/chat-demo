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

const Main= () => {
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

    // build socket connection
	useEffect(() => {
		console.log("groupID obtained from Home is: ", roomName);
		console.log("userName obtained from Home is: ", userName);
		socket.current = io(SOCKET_SERVER_URL, { query : 
			{
			groupID : roomName,
			userName: userName,
			}
		});
	
		socket.current.emit("join", roomName, userName)
	}, [])
	useEffect(() => {
		const handleJoinParticipants = participants => {
			console.log("isnew is", isNew);
			if (isNew) {
				setPeers((peers)=>{
					return createPeer(roomName, userName, participants, peers, peerStreams, socket)
				});
				console.log("create peer for: ", userName);
				setIsNew(false)
			}
			else {
				setPeers((peers) => {
					return addPeer(roomName, userName, participants, peers, peerStreams, socket)
				})
				console.log("add peer for: ", userName);
			}
			// setIsNew not working right now ...
			
			// setTimeout(100000);
			// console.log("changed isnew", isNew);
			setParticipants(participants)
		}
		socket.current.on("joinResponse", handleJoinParticipants)
		return () => {
			socket.current.off("joinResponse", handleJoinParticipants)
			
		}
	}, [isNew])

	useEffect(() => {
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

		return () => {
			// 함수를 반환하자 => 다음 useEffect가 실행되기 전에 이 부분이 실행되고 윗 부분이 실행된다. 
		}
	}, [])

	useEffect(()=>{
		console.log("\n\n\t Test Peers", peers)
	}, [peers])

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
export default React.memo(Main);