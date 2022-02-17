import React, { useState, useEffect, useRef } from "react";

import Peer from "simple-peer";
import { StyledVideo, Video, videoConstraints } from "./videostyle";
import { useSocket } from "../lib/socket";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import {createPeer, addPeer} from "../lib/peer/peers";
import {MoreVert} from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import styled from "styled-components";
import { faStream } from "@fortawesome/free-solid-svg-icons";

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
	const [peers, setPeers] = useState({});
	const [isNew, setIsNew] = useState(true);
	// const socket = useRef();
	const {socket, connected} = useSocket();
	console.log("peers is: ", peers);
	const userVideo = useRef();
	const peersRef = useRef([]);
	const roomName = props.roomName;
	const userName = props.userName;
	// excluding chat functions for a second
	// const { chat, sendMessage, removeMessage } = useChat(groupID, userName);
	// const ChatRef = useRef();
	
	
	// Set socket connection
	useEffect(() => {
		navigator.mediaDevices.getUserMedia({ video: videoConstraints, audio: true }).then(stream => {
			const handleJoinParticipants = (participants) => {
				console.log("isnew is", isNew);
				if (isNew) {
					setPeers((peers)=>{
						return createPeer(roomName, userName, participants, socket, stream);
					});
					console.log("create peer for: ", userName);
					setIsNew(false)
				}
				else {
					setPeers((peers) => {
						return addPeer(roomName, userName, participants, peers, socket, stream);
					})
					console.log("add peer for: ", userName);
				}
			}
			userVideo.current.srcObject = stream;
			socket.on("joinResponse", handleJoinParticipants);

		});
		// return () => {
		// 	socket.off("joinResponse", handleJoinParticipants);
		// };
	}, [isNew, socket, connected]);

	useEffect(() => {
		console.log("\n\n\t Test Peers", peers)
	}, [peers])

	return (
		<div>
			현재 접속자 수: {Object.keys(peers).length + 1} 명
			<Grid container>
				<Grid item style={{ padding: "1.5rem" }}>
					<StyledVideo
						muted
						ref={userVideo}
						autoPlay
						playsInline
						id={props.userName}
					/>
					{/* {console.log("1", peers)} */}
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
								<MoreVert></MoreVert>
							</IconButton>
						</Grid>
					</Grid>
				</Grid>
				{Object.keys(peers).map((key) => {
					return (
						<Grid item key={key}>
							<Video
								peer={peers[key]}
								userName={key}
							/>
						</Grid>
					);
				})}
			</Grid>
		</div>
	);
}

export default React.memo(VideoCall);

// Get Chat from Server
//   socket.current.on(NEW_CHAT_MESSAGE_EVENT, ({messageId, body, senderId, senderName, ownedByCurrentUser}) => {
//     const incomingMessage = {
//       ...{messageId, body, senderName, ownedByCurrentUser},
//       ownedByCurrentUser: senderId === socket.current.id,
//     };
//     setChat((chat) => [...chat, incomingMessage]);
//     console.log("2", chat);
//   });
