import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import App from "./App";
import Home from "./Home/Home";
import ChatRoom from "./ChatRoom/ChatRoom";
// import Main from "./Main/Main";
import Map from "./Pages/Map";
import reportWebVitals from "./reportWebVitals";
import Individual from "./Pages/Individual";
import GlobalStyles from "./Styles/globalStyles";

ReactDOM.render(
	<BrowserRouter>
		<GlobalStyles />
		<Routes>
			<Route exact path="/" element={<Home />} />
			<Route exact path=":roomID" element={<Map />} />
			{/* <Route path=":roomId/map" element={<Map />} /> */}
			<Route path=":roomId/search" element={<Individual />} />
		</Routes>
	</BrowserRouter>,
	document.getElementById("root"),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
