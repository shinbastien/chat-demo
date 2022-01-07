import { useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";

const NEW_CHAT_MESSAGE_EVENT = "newChatMessage";
const SOCKET_SERVER_URL = "http://localhost:4000";

const useChat = (roomId, userName) => {
  const [chat, setChat] = useState([]);
  console.log(chat);
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = socketIOClient(SOCKET_SERVER_URL, {
      query: { 
        room: roomId,
        name: userName,
      },
    });

    socketRef.current.on(NEW_CHAT_MESSAGE_EVENT, ({body, senderId, senderName, ownedByCurrentUser}) => {
      const incomingMessage = {
        ...{body, senderName, ownedByCurrentUser},
        ownedByCurrentUser: senderId === socketRef.current.id,
      };
      setChat((chat) => [...chat, incomingMessage]);
      console.log(chat);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [roomId]);


  const sendMessage = (messageBody, userName) => {
    socketRef.current.emit(NEW_CHAT_MESSAGE_EVENT, {
      body: messageBody,
      senderId: socketRef.current.id,
      senderName: userName,
      ownedByCurrentUser: true,
    });
    console.log("send socket info");
  };

  console.log(chat);
  return {chat, sendMessage};
};

export default useChat;
