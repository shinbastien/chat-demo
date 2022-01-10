import React, {useState} from "react";
import { useParams, useLocation } from "react-router-dom";
import "./ChatRoom.css";
import useChat from "../useChat";




function ChatRoom() {
    // const { roomId } = useParams();
    console.log("rendered");
    const location = useLocation();
    const {roomId, userName}= location.state;
    //  console.log(roomId);
    // console.log(userName);
    const { chat, sendMessage } = useChat(roomId, userName);
    const [newMessage, setNewMessage] = useState({message: "", name: ""});
    // console.log(JSON.stringify(newMessage));
    console.log("newMessage", newMessage);
    console.log("messages", chat);

  

    const handleNewMessageChange = (event) => {
        // console.log(event);
    setNewMessage({message: event.target.value, name: userName});
    };

    const handleSendMessage = () => {
        const {message, name} = newMessage;
        console.log(message);
        console.log(name);
        sendMessage(message, name);
        setNewMessage({message: "", name: userName});
    };

    return (
    <div className="chat-room-container">
        <h1 className="room-name">Room: {roomId}</h1>
        <div className="messages-container">
        <ol className="messages-list">
            {chat && chat.map((message, i) => (
            <li key = {i}>
            <div
                className={`message-item ${
                message.ownedByCurrentUser ? "my-message" : "received-message"
                }`}
            >  
            {message.ownedByCurrentUser ? "Me" : message.name}
            </div> 

            <div
                className={`message-item ${
                message.ownedByCurrentUser ? "my-message" : "received-message"
                }`}
            >
                
                {message.body}
            </div>
            </li>
            ))}
        </ol>
        </div>
        <textarea
        value={newMessage.message}
        onChange={handleNewMessageChange}
        placeholder="Write message..."
        className="new-message-input-field"
        />
        <button onClick={handleSendMessage} className="send-message-button">
        Send
        </button>
    </div>
    );
};

export default ChatRoom;