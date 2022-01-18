import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import App from "./App";
import Home from "./Home/Home";
import ChatRoom from "./ChatRoom/ChatRoom";
import reportWebVitals from "./reportWebVitals";
import Mapwindow from "./Mapwindow/Mapwindow";

ReactDOM.render(
	<BrowserRouter>
		<Routes>
			<Route exact path="/" element={<Home />} />
			<Route path="/:roomId" element={<ChatRoom />} />
			<Route path="/:roomId/map" element={<Mapwindow />} />
		</Routes>
	</BrowserRouter>,
	document.getElementById("root"),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
