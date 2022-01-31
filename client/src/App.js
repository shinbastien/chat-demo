import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./index.css";
import Home from "./Home/Home";
import ChatRoom from "./ChatRoom/ChatRoom";
import Map from "./Pages/Map";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/system";
import { customTheme } from "./Styles/themeSytles";

function App() {
	return (
		<>
			<CssBaseline />
			<ThemeProvider theme={customTheme}>
				<Router>
					<Routes>
						<Route path="/" component={Home} />
						<Route path="/:roomname" component={ChatRoom} />
						<Route path="/:roomname/map" component={Map} />
						{/* <Route path="/:roomname/search" component={Search} /> */}
					</Routes>
				</Router>
			</ThemeProvider>
		</>
	);
}

export default App;
