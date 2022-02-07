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
const userInfo = {};

// Socket.io connection for Chatting
io.on("connection", (socket) => {
	// Join a conversation
	// console.log(socket.handshake.query);
	// const {GroupID, userName} = socket.handshake.query;
	// console.log("1", GroupID);
	// console.log("2", userName);
	// socket.join(GroupID);

	socket.on("join group", (data) => {
		console.log(data);
		var GroupID = data.GroupID;
		var userName = data.userName;
		console.log("groupID is: ", GroupID);
		console.log("socket id is: ", socket.id);
		if (!users[GroupID]) {
			users[GroupID] = {};
		}
		socket.join(GroupID);
		socket.groupID = GroupID;
		socket.userName = userName;
		users[GroupID][socket.id] = {
			userName: userName,
			userID: socket.id,
			location: [0, 0],
		};
		console.log("new user joined in room to server", userName);

		console.log("users in room", users[GroupID]);
	});

	socket.on("start videocall", (GroupID) => {
		console.log("groupID in videocall is: ", GroupID);
		console.log("socket id is: ", socket.id);
		console.log("current users is: ", users[GroupID]);
		console.log("starting videocall for room");

		// send list of group members to each member
		socket.emit("bring all users in group for videocall", users[GroupID]);
	});

	// --------------------PEERCONNECTION-------------------
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
			callerName: socket.userName,
		});
		console.log("returning signal to : ", payload.callerName);
	});

	//  ---------------------------SHAREVIDEO----------------------
	socket.on("start sharevideo", (GroupID) => {
		console.log("starting sharevideo for room");
		socket.emit("bring all users in group for shareVideo", users[GroupID]);
	});

	socket.on("play", (GroupID) => {
		console.log("play video of groupID: ", GroupID);
		socket.broadcast.to(GroupID).emit("ShareVideoAction", "play");
	});

	socket.on("pause", (GroupID) => {
		console.log("pause video of groupID: ", GroupID);
		socket.broadcast.to(GroupID).emit("ShareVideoAction", "pause");
	});

	socket.on("load", (data) => {
		const { GroupID, videoID } = data;
		console.log("load video of groupID: ", GroupID);
		console.log("video Link is : ", videoID);
		socket.broadcast.to(GroupID).emit("ShareVideoAction", videoID);
	});

	// ------------------------MAP----------------------

	// socket connection for MapWindow
	socket.on("start mapwindow", (loc) => {
		const { lat, lng } = loc;
		console.log("latitude is: ", lat);
		console.log("longitude is: ", lng);
		users[socket.groupID][socket.id].location = [lat, lng];
		console.log(
			"updated user info of current socket: ",
			users[socket.groupID][socket.id],
		);
	});

	// // Listen for new messages
	// socket.on(NEW_CHAT_MESSAGE_EVENT, ({body, senderId, senderName, ownedByCurrentUser}) => {
	//   io.in(GroupID).emit(NEW_CHAT_MESSAGE_EVENT, {body, senderId, senderName, ownedByCurrentUser});
	// });

	// // Listen for remove message
	// socket.on(REMOVE_CHAT, (id) => {
	//   io.in(GroupID).emit(REMOVE_CHAT, id);
	// });

	// Leave the room if the user closes the socket
	socket.on("disconnect", () => {
		Object.keys(users).filter((user) => users[user]);
		delete users[socket.groupID][socket.id];
		socket.broadcast.emit("user left", socket.id);
		socket.leave(socket.groupID);
		console.log("current users: ", users[socket.groupID]);
	});
});

server.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`);
});
