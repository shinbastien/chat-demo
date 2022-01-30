import React, { useState, useEffect } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import Mapwindow from "../Mapwindow/Mapwindow";

function Map() {
	return (
		<div>
			<Mapwindow></Mapwindow>
		</div>
	);
}

export default Map;
