/*global Tmapv2*/
// Do not delete above comment

import React, { useState, useEffect } from "react";
import { Divider } from "@mui/material";
import styled from "styled-components";
import Box from "@mui/material/Box";
import point2 from "../../Styles/source/point2.png";

const MenuWrapper = styled.div`
	width: 300px;
	height: 100%;
	overflow-y: scroll;
	margin: 0 0 0 20px;
	background-color: white;
	border-radius: 12px;
	-webkit-box-shadow: 6px 7px 7px 0px rgba(0, 0, 0, 0.47);
	box-shadow: 6px 7px 7px 0px rgba(0, 0, 0, 0.47);
`;

const SubmenuWrapper = styled.div`
	font-weight: 300;
	width: auto;
	> span {
		margin: 20px;
	}
	> div {
		margin: 20px;
		> button {
			padding-left: 2%;
			border: none;
			background: none;
			> img {
				width: 75px;
				height: 75px;

				margin: 0 auto;
			}
		}
	}
`;

const InfoMenu = (props) => {
	const { map, totalDaytime, start, end, keepPlace } = props;

	const onClickKeep = (list) => {
		const { _lat, _long } = list.coords;
		const keepLocation = new Tmapv2.LatLng(_lat, _long);
		const newMarker = new Tmapv2.Marker({
			position: keepLocation,
			icon: point2,
			iconSize: new Tmapv2.Size(24, 24),
			map: map,
			title: list.title,
		});
		newMarker.addListener("mouseenter", function (evt) {
			new Tmapv2.InfoWindow({
				position: keepLocation,
				content: `<img src=${list.url} width="300px" height="auto"></img>`,
				type: 2,
				map: map,
			});
		});

		newMarker.setMap(map);
		map.setCenter(keepLocation);
	};

	const KeepPlaceCard = (props) => {
		const { coords, date, id, title, url, visited } = props.info;
		return (
			<button variant="outlined" onClick={() => onClickKeep(props.info)}>
				<img src={url} width="100%" height="auto"></img>
			</button>
		);
	};

	const SharedPlaceCard = (props) => {
		const { coords, date, id, title, url, visited } = props.info;
		return (
			<button variant="outlined" onClick={() => onClickKeep(props.info)}>
				<img src={url} width="100%" height="auto"></img>
			</button>
		);
	};

	return (
		<MenuWrapper>
			<Box
				component="div"
				style={{ fontWeight: 600, marginLeft: 20, fontSize: "1.7vw" }}
				pt={3}
				pb={3}
			>
				Information
			</Box>
			<Divider></Divider>
			<SubmenuWrapper>
				<Box component="div">
					<li>
						총 거리:{" "}
						{totalDaytime.totalD < 1
							? totalDaytime.totalD * 1000 + "m"
							: totalDaytime.totalD + "km"}
					</li>
					<li>총 시간: {totalDaytime.totalTime} 분</li>
					<li>출발: {start && start.name}</li>
					<li>도착: {end && end.name}</li>
				</Box>
				<Divider></Divider>
				<Box
					component="span"
					style={{ fontWeight: 300, marginLeft: 20, fontSize: "1.3vw" }}
					pt={3}
					pb={3}
				>
					<span role="img" aria-label="Woman Running">
						🏃🏻‍♀️
					</span>{" "}
					Keep Places
					<input type="checkbox" checked="checked"></input>
				</Box>
				<Box component="div">
					{keepPlace.map((list, idx) => (
						<KeepPlaceCard key={idx} info={list}></KeepPlaceCard>
					))}
				</Box>

				<Box
					component="span"
					style={{ fontWeight: 300, marginLeft: 20, fontSize: "1.3vw" }}
					pt={3}
					pb={3}
				>
					<span role="img" aria-label="Beach with Umbrella">
						🏖️
					</span>{" "}
					Shared Places
					<input type="checkbox" checked="checked"></input>
				</Box>
				<Box component="div">
					{keepPlace.map((list, idx) => (
						<SharedPlaceCard key={idx} info={list}></SharedPlaceCard>
					))}
				</Box>
				<Box></Box>
			</SubmenuWrapper>
		</MenuWrapper>
	);
};

export default InfoMenu;
