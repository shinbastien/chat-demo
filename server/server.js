const express = require("express");
const app = express();
const server = require("http").Server(app);
const { v4: uuidv4 } = require("uuid");

const io = require("socket.io")(server, {
	cors: {
		origin: "*",
	},
});

const PORT = 4000;
const NEW_CHAT_MESSAGE_EVENT = "newChatMessage";
const REMOVE_CHAT = "removeChat";

const users = {};

// Socket.io connection for Chatting
io.on("connection", (socket) => {
	// Join a conversation
	const { GroupID, userName } = socket.handshake.query;
	console.log("1", GroupID);
	console.log("2", userName);

	socket.on("join group", (GroupID) => {
		if (users[GroupID] && !users[GroupID].includes(userName)) {
			users[GroupID].push({ userName: userName, userID: socket.id });
			console.log("user pushed in users in server");
		} else {
			users[GroupID] = [{ userName: userName, userID: socket.id }];
		}

		console.log("users in room", users[GroupID]);

		// send list of group members to each member
		socket.emit("all users in group", users[GroupID]);
	});

	// when a peer is created from newbie, the created peer sends a signal by socket and socket sends the signal to existing peers
	socket.on("sending signal", (payload) => {
		io.to(payload.userIDToSignal).emit("user joined", {
			signal: payload.signal,
			callerID: payload.callerID,
			callerName: payload.callerName,
		});
		console.log("signal sended from newbie: ", payload.callerName);
		console.log("to: ", payload.userNameToSignal);
		console.log("to ID: ", payload.userIDToSignal);
	});

	socket.on("returning signal", (payload) => {
		io.to(payload.callerID).emit("receiving returned signal", {
			signal: payload.signal,
			callerID: socket.id,
			callerName: userName,
		});
		console.log("returning signal to : ", payload.callerName);
	});

	// Listen for new messages
	socket.on(
		NEW_CHAT_MESSAGE_EVENT,
		({ body, senderId, senderName, ownedByCurrentUser }) => {
			io.in(GroupID).emit(NEW_CHAT_MESSAGE_EVENT, {
				body,
				senderId,
				senderName,
				ownedByCurrentUser,
			});
		},
	);

	// Listen for remove message
	socket.on(REMOVE_CHAT, (id) => {
		io.in(GroupID).emit(REMOVE_CHAT, id);
	});

	// Leave the room if the user closes the socket
	socket.on("disconnect", () => {
		delete users[userName];
		socket.leave(GroupID);
	});
});

server.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`);
});
