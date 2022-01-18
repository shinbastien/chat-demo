import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./index.css";
import Home from "./Home/Home";
import ChatRoom from "./ChatRoom/ChatRoom";
import Mapwindow from "./Mapwindow/Mapwindow";

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" component={Home} />
				<Route path="/:roomname" component={ChatRoom} />
				<Route path="/:roomname/map" component={Mapwindow} />
			</Routes>
		</Router>
	);
}

export default App;
