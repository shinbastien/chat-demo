import React, { useEffect, useRef, useState } from "react";
import Peer from "simple-peer";
import styled from "styled-components";

const Container = styled.div`
	// padding: 20px;
	// display: flex;
	// height: 100vh;
	// width: 90%;
	// margin: auto;
	// flex-wrap: wrap;
`;

const StyledVideo = styled.video`
	// height: 40%;
	width: 100%;
	border-radius: 25px;
	overflow: hidden;
`;

const Video = (props) => {
	const ref = useRef();

	useEffect(() => {
		props.peer.on("stream", (stream) => {
			ref.current.srcObject = stream;
		});
	}, []);

	return <StyledVideo playsInline autoPlay ref={ref} id={props.userName} />;
};

const videoConstraints = {
	height: window.innerHeight / 2,
	width: window.innerWidth / 2,
};

// function MakePeerConnection(
//     groupID,
//     userName,
//     socket,
//     participants,
//     is_new,
// ) {

//     return (
//         <Container>
//             <StyledVideo muted ref = {userVideo} autoPlay playsInline />
//             {peers.map ((peer, index) => {
//                 return (
//                     <Video key = {index} peer = {peer} />
//                 )
//             })}
//         </Container>
//     )
// }

const MakePeerConnection = (
	groupID,
	stream,
	userName,
	socket,
	users,
	is_new,
	receivedPeer,
) => {
	const [peers, setPeers] = useState([]);
	const userVideo = useRef();
	const peersRef = useRef();

	useEffect(() => {
		userVideo.current.srcObject = stream;

		if (is_new) {
			users.forEach((otheruser) => {
				const peer = createPeer(otheruser, userName, stream, socket);
				peersRef.current.push({
					peerID: otheruser,
					peer,
				});
				peers.push(peer);
			});
			setPeers(peers);
		}

		socket.current.on("user joined", (payload) => {
			const peer = addPeer(payload.signal, payload.callerName, stream, socket);
			peersRef.current.push({
				peerID: payload.callerName,
				peer,
			});

			setPeers((users) => [...users, peer]);
		});

		socket.current.on("receiving returned signal", (payload) => {
			const item = peersRef.current.find(
				(p) => p.peerID === payload.callerName,
			);
			item.peer.signal(payload.signal);
		});
	}, []);

	return peers;
};

function createPeer(userToSignal, callerName, stream, socket) {
	const peer = new Peer({
		initiator: true,
		trickle: false,
		stream,
	});

	peer.on("signal", (signal) => {
		socket.current.emit("sending signal", { userToSignal, callerName, signal });
	});

	return peer;
}

function addPeer(incomingSignal, callerName, stream, socket) {
	const peer = new Peer({
		initiator: false,
		trickle: false,
		stream,
	});

	peer.on("signal", (signal) => {
		socket.current.emit("returning signal", { signal, callerName });
	});

	peer.signal(incomingSignal);

	return peer;
}

export default MakePeerConnection;
export { Video, videoConstraints, Container, StyledVideo };
