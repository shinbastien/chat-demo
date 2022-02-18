/*global Tmapv2*/
// Do not delete above comment

import React, { useState, useEffect } from "react";
import Search from "./Search/Search";
import Keep from "../Keep/Keep";
import Box from "@mui/material/Box";

import Typography from "@mui/material/Typography";

import { useLocation, Link } from "react-router-dom";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
`;

const BarWrapper = styled.div`
	display: flex;

	> div {
		flex-grow: 10;
	}
	> button {
		padding-right: 2%;
		font-size: 3vw;
	}
`;

function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box sx={{ p: 3 }}>
					<Typography>{children}</Typography>
				</Box>
			)}
		</div>
	);
}

export default function Individual({ stateChanger, ...props }) {
	const { data } = props;

	const location = useLocation();

	const [recvideo, setrecvideo] = useState([]);

	const { groupID, userName } = location.state;
	const [value, setValue] = React.useState(0);

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	useEffect(() => {
		navigator.geolocation.getCurrentPosition(function (position) {
			const lat = position.coords.latitude;
			const lng = position.coords.longitude;

			loadpointInfo(lat, lng);
		});
	}, []);

	const loadpointInfo = async (lat, lng) => {
		try {
			const { data: items } = await axios({
				method: "get",
				url: "https://apis.openapi.sk.com/tmap/pois/search/around?version=1&format=json&callback=result",
				params: {
					categories: "카페;",
					appKey: process.env.REACT_APP_TMAP_API_KEY,
					reqLevel: 15,
					radius: 3,
					centerLon: lng,
					centerLat: lat,
					reqCoordType: "WGS84GEO",
					resCoordType: "WGS84GEO",
					count: 10,
				},
			});
			setrecvideo(items.searchPoiInfo.pois.poi);
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<Wrapper>
			<BarWrapper>
				<div></div>
				<button onClick={() => stateChanger(false)}>
					<FontAwesomeIcon icon={faXmark} />
				</button>
			</BarWrapper>
			Search
			<TabPanel value={value} index={0}>
				<Search value={recvideo}></Search>
			</TabPanel>
		</Wrapper>
	);
}
