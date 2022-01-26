import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import App from "./App";
import Home from "./Home/Home";
import ChatRoom from "./ChatRoom/ChatRoom";
import Main from "./Main/Main";
import Mapwindow from "./Mapwindow/Mapwindow";
import reportWebVitals from "./reportWebVitals";
import Search from "./Search/Search";

ReactDOM.render(
	<BrowserRouter>
		<Routes>
			<Route exact path="/" element={<Home />} />
			<Route exact path=":roomID" element={<Main />} />
			<Route path=":roomId/map" element={<Mapwindow />} />
			<Route path=":roomId/search" element={<Search />} />
		</Routes>
	</BrowserRouter>,
	document.getElementById("root"),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
