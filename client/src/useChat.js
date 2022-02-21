import { useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";

let id = 0;
const NEW_CHAT_MESSAGE_EVENT = "newChatMessage";
const CHAT_FINISHED = "chatFinished";
const REMOVE_CHAT = "removeChat";
const SOCKET_SERVER_URL = "https://social-moving.herokuapp.com/";

const useChat = (roomId, userName) => {
	const [chat, setChat] = useState([]);
	console.log("1", chat);
	const socketRef = useRef();

	useEffect(() => {
		socketRef.current = socketIOClient(SOCKET_SERVER_URL, {
			query: {
				room: roomId,
				name: userName,
			},
		});

		socketRef.current.on(
			NEW_CHAT_MESSAGE_EVENT,
			({ messageId, body, senderId, senderName, ownedByCurrentUser }) => {
				const incomingMessage = {
					...{ messageId, body, senderName, ownedByCurrentUser },
					ownedByCurrentUser: senderId === socketRef.current.id,
				};
				setChat((chat) => [...chat, incomingMessage]);
				console.log("2", chat);
			},
		);

		socketRef.current.on(REMOVE_CHAT, (id) => {
			setChat(chat.filter((message) => message.messageId !== id));
			console.log("check removed", chat);
		});

		return () => {
			socketRef.current.disconnect();
		};
	}, [roomId, chat, userName]);

	const sendMessage = (messageBody, userName) => {
		socketRef.current.emit(NEW_CHAT_MESSAGE_EVENT, {
			messageId: id,
			body: messageBody,
			senderId: socketRef.current.id,
			senderName: userName,
			ownedByCurrentUser: true,
		});
		id += 1;
		console.log(id);
		console.log("send socket info");
	};

	const removeMessage = (id) => {
		socketRef.current.emit(REMOVE_CHAT, {
			messageId: id,
		});
		console.log("send socket remove chat");
	};

	console.log("3", chat);
	return { chat, sendMessage, removeMessage };
};

export default useChat;
