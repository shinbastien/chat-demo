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

	socket.on("join", (roomName, userName) => {
		socket.join(roomName);
		if (!users[roomName]) {
		users[roomName] = {participants: {}, youtubeLink: ""};
	  	}
		socket.roomName = roomName;
		socket.userName = userName;
		users[roomName].participants[userName] = {socket: socket.id, location: [0, 0]}
		console.log("current users after join: ", Object.keys(users[roomName].participants));
		console.log(users[roomName].participants);
		io.to(roomName).emit("joinResponse", users[roomName].participants);
		console.log("server sends joinResponse");
	});

	// socket.on("start videocall", (GroupID) => {
	// 	console.log("groupID in videocall is: ", GroupID);
	// 	console.log("socket id is: ", socket.id);
	// 	console.log("current users is: ", users[GroupID]);
	// 	console.log("starting videocall for room");

	// 	// send list of group members to each member
	// 	socket.emit("bring all users in group for videocall", users[GroupID]);
	// });

	// --------------------PEERCONNECTION-------------------
	// when a peer is created from newbie, the created peer sends a signal by socket and socket sends the signal to existing peers
	socket.on("RTC_offer", (signal, caller, receiver, roomName) => {
		try {
		  io.to(roomName).emit("RTC_answer", caller, receiver, signal);
		  console.log("signal sended from newbie: ", caller);
		  console.log("to: ", receiver);
  
		} catch(error) {
		  console.log(error);
		}  
	  })

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
	socket.on("start mapwindow", (lat, lng) => {
		console.log("latitude is: ", lat);
		console.log("longitude is: ", lng);
		users[socket.roomName].participants[socket.userName].location = [lat, lng];
		console.log(
			"updated user info of current socket: ",
			users[socket.roomName].participants[socket.userName],
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
		console.log("socket disconnected");
		console.log("current socket is: ", socket.id);
		console.log("current socket room is: ", socket.roomName);
		console.log("current socket userName is: ", socket.userName);
		if (socket.roomName && socket.userName) {
		  delete users[socket.roomName].participants[socket.userName];
		  if (Object.keys(users[socket.roomName].participants).length === 0) {
			delete users[socket.roomName];
		  } else {
			io.in(socket.roomName).emit(
			  "disconnectResponse",
			  users[socket.roomName].participants,
			  socket.userName
			);
			io.in(socket.roomName).emit(
				"disconnectPeer",
				socket.userName
			)
		  }
		}
		console.log("current users: ", users[socket.roomName]);
	  });
});

server.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`);
});
