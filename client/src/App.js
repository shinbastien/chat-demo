import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./index.css";
import Home from "./Home/Home";
import ChatRoom from "./ChatRoom/ChatRoom";
import Mapwindow from "./Mapwindow/Mapwindow";
import GlobalStyles from "./Styles/globalStyles";
import Search from "./Search/Search";

function App() {
	return (
		<>
			<GlobalStyles />
			<Router>
				<Routes>
					<Route path="/" component={Home} />
					<Route path="/:roomname" component={ChatRoom} />
					<Route path="/:roomname/map" component={Mapwindow} />
					<Route path="/:roomname/search" component={Search} />
				</Routes>
			</Router>
		</>
	);
}

export default App;
