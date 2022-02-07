import React, { useState, useEffect, useRef, useCallback } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import { StyledVideo, Video, videoConstraints } from "./videostyle";
import { useSocket } from "../lib/socket";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import IconButton from "@mui/material/IconButton";
import styled from "styled-components";

// Main handles connection between users and sends those to other pages
const SOCKET_SERVER_URL = "http://localhost:4000";

const NEW_CHAT_MESSAGE_EVENT = "newChatMessage";

const TextWrapper = styled.span`
	display: flex;
	justify-content: center; /* align horizontal */
	align-items: center; /* align vertical */
`;

function VideoCall(props) {
	// let is_ncons location = useLocation();const location = useLocation();const location = useLocation();const location = useLocation();const location = useLocation();ew = true;
	// const location = useLocation();
	// const {groupID, userName}= location.state;
	// const [users, setUsers] = useState([]);
	// const [stream, setStream] = useState();
	const [peers, setPeers] = useState([]);

	// const socket = useRef();
	const { socket } = useSocket();
	// const {socket, error} = useSocket();
	const userVideo = useRef();
	const peersRef = useRef([]);

	// excluding chat functions for a second
	// const { chat, sendMessage, removeMessage } = useChat(groupID, userName);
	// const ChatRef = useRef();

	// Set socket connection
	useEffect(() => {
		navigator.mediaDevices
			.getUserMedia({ video: videoConstraints, audio: true })
			.then((stream) => {
				userVideo.current.srcObject = stream;
				socket.emit("start videocall", props.groupID);
				socket.on("bring all users in group for videocall", (users) => {
					const peers = [];
					console.log("get users from server", users);

					Object.keys(users)
						.filter((user) => users[user].userName !== props.userName)
						.forEach((user) => {
							console.log("gained user name: ", users[user].userName);
							const peer = createPeer(
								users[user].userID,
								users[user].userName,
								socket.id,
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
				socket.on("user joined", (payload) => {
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
				socket.on("receiving returned signal", (payload) => {
					const item = peersRef.current.find(
						(p) => p.peerID === payload.callerID,
					);
					console.log(
						"receive returning signal from the peer: ",
						payload.callerName,
					);
					item.peer.signal(payload.signal);
				});

				socket.on("user left", (id) => {
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
			})
			.catch(function onError() {
				alert("There has been a problem retrieving the streams");
			});

		return () => {
			socket.on("user left", (id) => {
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
		};
	}, [socket]);

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
			socket.emit("sending signal", {
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
			socket.emit("returning signal", { signal, callerID, callerName });
		});
		console.log("addPeer from: ", callerName);
		peer.signal(incomingSignal);

		return peer;
	}
	return (
		<div>
			현재 접속자 수: {peers.length} 명
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
							<IconButton onClick={() => console.log("test")}>
								<MoreVertIcon></MoreVertIcon>
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
		</div>
	);
}

export default VideoCall;

// Get Chat from Server
//   socket.current.on(NEW_CHAT_MESSAGE_EVENT, ({messageId, body, senderId, senderName, ownedByCurrentUser}) => {
//     const incomingMessage = {
//       ...{messageId, body, senderName, ownedByCurrentUser},
//       ownedByCurrentUser: senderId === socket.current.id,
//     };
//     setChat((chat) => [...chat, incomingMessage]);
//     console.log("2", chat);
//   });
