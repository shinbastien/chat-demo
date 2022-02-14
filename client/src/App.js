import React, { useState, useMemo } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SocketProvider } from "./lib/socket";

import "./index.css";
import './polyfills';
import Home from "./Home/Home";
import Map from "./Pages/Map";
import Main from "./Main";
import ShareVideo from "./Pages/ShareVideo";
import reportWebVitals from "./reportWebVitals";
import Individual from "./Pages/Individual";
import GlobalStyles from "./Styles/globalStyles";

function App() {
	// const [inputs, setInputs] = useState({
	// 	roomname: "참여자",
	// 	username: "aㄴㅇㄹ",
	// });
	// const value = useMemo(() => ({ inputs, setInputs }), [inputs]);

	// console.log(value);
	return (
	<BrowserRouter>
		<GlobalStyles />
		<Routes>
			<Route exact path="/" element={<Home />} />
			<Route exact path=":roomID" element={<Main/>}/>
			{/* <Route exact path=":roomID" element={<Map />} /> */}
			{/* <Route path=":roomId/map" element={<Map />} /> */}
			{/* <Route path=":roomId/search" element={<Individual />} />
			<Route path=":roomID/share" element={<ShareVideo/>} /> */}
		</Routes>
	</BrowserRouter>
	);
}

export default App;
