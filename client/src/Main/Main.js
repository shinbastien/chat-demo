import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import useChat from "../useChat";
import io from "socket.io-client";
import Peer from "simple-peer";
import { StyledVideo, Video, videoConstraints } from "../VideoCall/video";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";

import styled from "styled-components";

// Main handles connection between users and sends those to other pages
const SOCKET_SERVER_URL = "https://social-moving.herokuapp.com/";

const NEW_CHAT_MESSAGE_EVENT = "newChatMessage";

const TextWrapper = styled.span`
	display: flex;
	justify-content: center; /* align horizontal */
	align-items: center; /* align vertical */
`;

function Main(props) {
	// let is_ncons location = useLocation();const location = useLocation();const location = useLocation();const location = useLocation();const location = useLocation();ew = true;
	// const location = useLocation();
	// const {groupID, userName}= location.state;
	// const [users, setUsers] = useState([]);
	const [stream, setStream] = useState();
	const [peers, setPeers] = useState([]);

	const socket = useRef();
	const userVideo = useRef();
	const peersRef = useRef([]);

	// excluding chat functions for a second
	// const { chat, sendMessage, removeMessage } = useChat(groupID, userName);
	// const ChatRef = useRef();

	// Set socket connection
	useEffect(() => {
		socket.current = io(SOCKET_SERVER_URL, {
			query: {
				GroupID: props.groupID,
				userName: props.userName,
				userLocation: props.userLocation,
			},
		});

		navigator.mediaDevices
			.getUserMedia({ video: videoConstraints, audio: true })
			.then((stream) => {
				userVideo.current.srcObject = stream;
				socket.current.emit("join group", props.groupID);
				socket.current.on("all users in group", (users) => {
					const peers = [];
					console.log("get users from server", users);

					Object.keys(users)
						.filter((user) => users[user].userName !== props.userName)
						.forEach((user) => {
							console.log("gained user name: ", users[user].userName);
							const peer = createPeer(
								users[user].userID,
								users[user].userName,
								socket.current.id,
								props.userName,
								stream,
							);
							peersRef.current.push({
								peerID: users[user].userID,
								peerName: users[user].userName,
								peer: peer,
							});
							peers.push({
								peerID: users[user].userID,
								peerName: users[user].userName,
								peer,
							});
						});
					setPeers(peers);
					// console.log("current PeersRef is: " ,peersRef.current);
				});

				// When a new member joined, and I'm an existing member
				socket.current.on("user joined", (payload) => {
					const peer = addPeer(
						payload.signal,
						payload.callerID,
						payload.callerName,
						stream,
					);
					peersRef.current.push({
						peerID: payload.callerID,
						peerName: payload.callerName,
						peer: peer,
					});

					console.log("received socket message from new member");
					console.log("current PeersRef is: ", peersRef.current);
					setPeers([...peersRef.current]);
				});

				// receive the returned signal the newbie gets from the existing peers
				socket.current.on("receiving returned signal", (payload) => {
					const item = peersRef.current.find(
						(p) => p.peerID === payload.callerID,
					);
					console.log(
						"receive returning signal from the peer: ",
						payload.callerName,
					);
					item.peer.signal(payload.signal);
				});

				socket.current.on("user left", (id) => {
					const peerObj = peersRef.current.find((p) => p.peerID === id);
					console.log("The user left is: ", peerObj.peerName);
					if (peerObj) {
						peerObj.peer.destroy();
					}

					const peers = peersRef.current.filter((p) => p.peerID !== id);
					peersRef.current = peers;
					console.log("current peersRef after user leaving is: ", peers);
					setPeers(peers);
				});
			});
	}, []);

	function createPeer(
		userIDToSignal,
		userNameToSignal,
		callerID,
		callerName,
		stream,
	) {
		const peer = new Peer({
			initiator: true,
			trickle: false,
			stream,
		});
		console.log(peer);

		peer.on("signal", (signal) => {
			socket.current.emit("sending signal", {
				userIDToSignal,
				userNameToSignal,
				callerID,
				callerName,
				signal,
			});
		});
		console.log("create Peer of: ", userNameToSignal);
		return peer;
	}

	function addPeer(incomingSignal, callerID, callerName, stream) {
		const peer = new Peer({
			initiator: false,
			trickle: false,
			stream,
		});

		// send returning signal from: existing to: newbie
		peer.on("signal", (signal) => {
			socket.current.emit("returning signal", { signal, callerID, callerName });
		});
		console.log("addPeer from: ", callerName);
		peer.signal(incomingSignal);

		return peer;
	}
	return (
		<Box component={"div"} style={{ padding: "1.5rem" }}>
			현재 접속자 수: {peers.length + 1} 명
			<Grid container>
				<Grid item style={{ padding: "1.5rem" }}>
					<StyledVideo
						muted
						ref={userVideo}
						autoPlay
						playsInline
						id={props.userName}
					/>
					{console.log("1", peers)}
					<Grid container direction="row" justifyContent="space-between">
						<Grid item>
							<Stack direction="row" spacing={2}>
								<Avatar sx={{ bgcolor: "#ff4e6c" }}>
									{props.userName.slice(0, 1).toUpperCase()}
								</Avatar>
								<TextWrapper>
									{props.userName} &nbsp; &nbsp;
									<span style={{ color: "red" }}>나</span>
								</TextWrapper>
							</Stack>
						</Grid>
						<Grid item>
							<IconButton
								style={{ cursor: "pointer" }}
								onClick={() => console.log("test")}
							>
								{/* <MoreVertIcon></MoreVertIcon> */}
							</IconButton>
						</Grid>
					</Grid>
				</Grid>
				{peers.map((peerObj, idx) => {
					return (
						<Grid item key={idx}>
							<Video
								key={peerObj.peerID}
								peer={peerObj.peer}
								userName={peerObj.peerName}
							/>
						</Grid>
					);
				})}
			</Grid>
		</Box>
	);
}

export default Main;

// Get Chat from Server
//   socket.current.on(NEW_CHAT_MESSAGE_EVENT, ({messageId, body, senderId, senderName, ownedByCurrentUser}) => {
//     const incomingMessage = {
//       ...{messageId, body, senderName, ownedByCurrentUser},
//       ownedByCurrentUser: senderId === socket.current.id,
//     };
//     setChat((chat) => [...chat, incomingMessage]);
//     console.log("2", chat);
//   });
