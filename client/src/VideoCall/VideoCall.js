import React, { useState, useEffect, useRef, useCallback } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import { StyledVideo, Video, videoConstraints } from "./videostyle";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import {MoreVert} from "@mui/icons-material"
import {addPeer, createPeer} from "../lib/peer/peers";

// Main handles connection between users and sends those to other pages
const SOCKET_SERVER_URL = "http://localhost:4000";

const NEW_CHAT_MESSAGE_EVENT = "newChatMessage";

const VideoCall = (props) => {
	// let is_ncons location = useLocation();const location = useLocation();const location = useLocation();const location = useLocation();const location = useLocation();ew = true;
	// const location = useLocation();
	// const {groupID, userName}= location.state;
	// const [users, setUsers] = useState([]);
	// const [stream, setStream] = useState();
	// const [peers, setPeers] = useState({});
	// const [isNew, setIsNew] = useState(true);
	// const socket = useRef();
	const userVideo = useRef();

	// excluding chat functions for a second
	// const { chat, sendMessage, removeMessage } = useChat(groupID, userName);
	// const ChatRef = useRef();

	// Set socket connection
	useEffect(() => {
		// socket.current = io.connect(SOCKET_SERVER_URL);
		navigator.mediaDevices
			.getUserMedia({ video: videoConstraints, audio: true })
			.then((stream) => {
				userVideo.current.srcObject = stream;
				Object.values(props.peers).forEach((p) => {
					try {
						p.addStream(stream);
						console.log("get peers", p)
					} catch (error) {
						console.log(error);
					}
				});
			})

			// return () => {
			// 	socket.on("user left", (id) => {
			// 		const peerObj = peersRef.current.find((p) => p.peerID === id);
			// 		console.log("The user left is: ", peerObj.peerName);
			// 		if (peerObj) {
			// 			peerObj.peer.destroy();
			// 		}

			// 		const peers = peersRef.current.filter((p) => p.peerID !== id);
			// 		peersRef.current = peers;
			// 		console.log("current peersRef after user leaving is: ", peers);
			// 		setPeers(peers);
			// 	});
			// }
	}, []);

	
	return (
		<div>
			Room name: {props.groupID}
			User name: {props.userName}
			<Grid container>
				<Grid item style={{ padding: "1.5rem" }}>
					<StyledVideo
						muted
						ref={userVideo}
						autoPlay
						playsInline
						id={props.userName}
					/>
					{console.log("1", props.peers)}
					<Grid container direction="row" justifyContent="space-between">
						<Grid item>
							<Stack direction="row" spacing={2}>
								{/* <Avatar>{props.userName.slice(0, 1).toUpperCase()}</Avatar> */}
								{props.userName}
							</Stack>
						</Grid>
						<Grid item>
							<IconButton onClick={() => console.log("test")}>
								<MoreVert/>
							</IconButton>
						</Grid>
					</Grid>
				</Grid>
				{Object.keys(props.peers).map((key) => {
					return (
						<Grid item key={key}>
							<Video
								peer={props.peers[key]}
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

