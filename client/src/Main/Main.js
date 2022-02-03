import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
// import "./Main.css";
import useChat from "../useChat";
import io from "socket.io-client";
import Peer from "simple-peer";
import { StyledVideo, Video, videoConstraints } from "../VideoCall/video";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import IconButton from "@mui/material/IconButton";

// Main handles connection between users and sends those to other pages
const SOCKET_SERVER_URL = "http://localhost:4000";

const NEW_CHAT_MESSAGE_EVENT = "newChatMessage";

function Main() {
	// let is_new = true;
	const location = useLocation();
	const { groupID, userName } = location.state;
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
				GroupID: groupID,
				userName: userName,
			},
		});

		navigator.mediaDevices
			.getUserMedia({ video: videoConstraints, audio: true })
			.then((stream) => {
				userVideo.current.srcObject = stream;
				socket.current.emit("join group", groupID);
				socket.current.on("all users in group", (users) => {
					const peers = [];
					console.log("get users from server", users);

					users
						.filter((user) => user.userName != userName)
						.forEach((user) => {
							// create Peers of the existing members for the newbie
							console.log("gained user name: ", user.userName);
							const peer = createPeer(
								user.userID,
								user.userName,
								socket.current.id,
								userName,
								stream,
							);
							peersRef.current.push({
								peerID: user.userID,
								peerName: user.userName,
								peer,
							});
							peers.push(peer);
						});
					setPeers(peers);
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
						peer,
					});
					console.log("received socket message from new member");
					setPeers((users) => [...users, peer]);
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
		<div>
			{groupID}
			<Grid container>
				<Grid item style={{ padding: "1.5rem" }}>
					<StyledVideo muted ref={userVideo} autoPlay playsInline />
					<Grid container direction="row" justifyContent="space-between">
						<Grid item>
							<Stack direction="row" spacing={2}>
								<Avatar>{userName.slice(0, 1).toUpperCase()}</Avatar>
								{userName}
							</Stack>
						</Grid>
						<Grid item>
							<IconButton onClick={() => console.log("test")}>
								<MoreVertIcon></MoreVertIcon>
							</IconButton>
						</Grid>
					</Grid>
				</Grid>
				{peers.map((peer, index) => {
					return (
						<Grid item key={index}>
							<Video peer={peer} />
						</Grid>
					);
				})}
			</Grid>
		</div>
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
