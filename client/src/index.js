import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SocketProvider } from "./lib/socket";
// import "./index.css";
import Home from "./Home/Home";
// import Main from "./Main/Main";
import Map from "./Pages/Map";
import ShareVideo from "./Pages/ShareVideo";
import reportWebVitals from "./reportWebVitals";
import Individual from "./Pages/Individual";
import GlobalStyles from "./Styles/globalStyles";

ReactDOM.render(
	<BrowserRouter>
		<GlobalStyles />
		<SocketProvider url="http://localhost:4000">
			<Routes>
				<Route exact path="/" element={<Home />} />
				<Route exact path=":roomID" element={<Map />} />
				<Route path=":roomId/search" element={<Individual />} />
				<Route path=":roomID/share" element={<ShareVideo />} />
			</Routes>
		</SocketProvider>
	</BrowserRouter>,
	document.getElementById("root"),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
