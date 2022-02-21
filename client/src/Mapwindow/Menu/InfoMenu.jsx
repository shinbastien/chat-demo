/*global Tmapv2*/
// Do not delete above comment

import React, { useState, useEffect, useMemo } from "react";
import { Divider } from "@mui/material";
import styled from "styled-components";
import point2 from "../../Styles/source/point2.png";
import {
	faAngleDown,
	faAngleUp,
	faCircleInfo,
	faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Draggable from "react-draggable"; // The default

const MenuWrapper = styled.div`
	width: 300px;
	height: 100%;
	overflow-y: scroll;
	margin: 20px 0 0 40px;
	padding: 3%;
	background-color: #f6f9fa;
	border-radius: 12px;
	-webkit-box-shadow: 6px 7px 7px 0px rgba(0, 0, 0, 0.47);
	box-shadow: 6px 7px 7px 0px rgba(0, 0, 0, 0.47);

	.title {
		font-weight: 600;
		color: #151ca1;
		margin: 20px;
	}
`;

const SubmenuWrapper = styled.div`
	font-weight: 300;
	width: auto;

	.info {
		font-size: 17px;
		margin: 20px;
		color: #707070;
	}
`;

const SubsubmenuWrapper = styled.div`
	> span {
		display: flex;
		justify-content: space-between;
		font-size: 1vw;
		font-weight: 700;
	}
	.badge {
		display: inline-block;
		font-size: 13px;
		font-weight: 700;
		letter-spacing: 0;
		color: white;
		min-width: 6px;
		padding: 0 6px;
		border-radius: 18px;
		background: #2b5876; /* fallback for old browsers */
		background: -webkit-linear-gradient(
			to right,
			#2b5876,
			#4e4376
		); /* Chrome 10-25, Safari 5.1-6 */
		background: linear-gradient(
			to right,
			#2b5876,
			#4e4376
		); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
	}
	> div {
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		width: 100%;

		> button {
			display: inline-block;
			padding-left: 2%;

			> img {
				padding: 5%;
				width: 75px;
				height: 75px;
			}
		}
	}
`;

const VisitedWrapper = styled.div`
	width: 10px;
	height: 10px;
	border-radius: 50px;
	background-color: ${(props) => (props.visited === true ? "red" : "blue")};
`;

const KeepPlaceCard = (props) => {
	const { coords, date, id, title, url, visited } = props.info;
	const { map } = props;

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

	return (
		<button variant="outlined" onClick={() => onClickKeep(props.info)}>
			<img src={url} width="100%" height="auto"></img>
			<VisitedWrapper visited={visited}></VisitedWrapper>
		</button>
	);
};

// const SharedPlaceCard = (props) => {
// 	const { coords, date, id, title, url, visited } = props.info;
// 	const { map } = props;

// 	const onClickKeep = (list) => {
// 		const { _lat, _long } = list.coords;
// 		const keepLocation = new Tmapv2.LatLng(_lat, _long);
// 		const newMarker = new Tmapv2.Marker({
// 			position: keepLocation,
// 			icon: point2,
// 			iconSize: new Tmapv2.Size(24, 24),
// 			map: map,
// 			title: list.title,
// 		});
// 		newMarker.addListener("mouseenter", function (evt) {
// 			new Tmapv2.InfoWindow({
// 				position: keepLocation,
// 				content: `<img src=${list.url} width="300px" height="auto"></img>`,
// 				type: 2,
// 				map: map,
// 			});
// 		});

// 		newMarker.setMap(map);
// 		map.setCenter(keepLocation);
// 	};
// 	return (
// 		<button variant="outlined" onClick={() => onClickKeep(props.info)}>
// 			<img src={url} width="100%" height="auto"></img>
// 			<VisitedWrapper visited={visited}></VisitedWrapper>
// 		</button>
// 	);
// };

const InfoMenu = (props) => {
	const { map, totalDaytime, start, end, keepPlace } = props;
	console.log("I am rendering");

	const [keepOpen, setKeepOpen] = useState(true);
	const [shareOpen, setShareOpen] = useState(true);
	const [savePlace, setSavePlace] = useState();

	useMemo(() => {
		setSavePlace(keepPlace);
	}, [keepPlace]);

	return (
		<Draggable>
			<MenuWrapper>
				<div className="title">
					<FontAwesomeIcon icon={faCircleInfo} />
					&nbsp;Information
				</div>
				<Divider></Divider>
				<SubmenuWrapper>
					{start || end ? (
						<div className="info result">
							<li>출발: {start ? start.name : "출발지를 정해주세요"}</li>
							<li>도착: {end ? end.name : "도착지를 정해주세요"}</li>
							<Divider></Divider>
						</div>
					) : (
						<div className="info destination">
							<FontAwesomeIcon icon={faLocationDot} />
							&nbsp;목적지를 정해주세요
						</div>
					)}
					{totalDaytime.totalD ? (
						<div>
							<li>
								총 거리:{" "}
								{totalDaytime.totalD < 1
									? totalDaytime.totalD * 1000 + "m"
									: totalDaytime.totalD + "km"}
							</li>
							<li>총 시간: {totalDaytime.totalTime} 분</li>
						</div>
					) : null}
					<Divider></Divider>
					<SubsubmenuWrapper>
						<span pt={3} pb={3}>
							<div className="info">
								<span role="img" aria-label="Woman Running">
									🏃🏻‍♀️
								</span>{" "}
								Keep&nbsp;{" "}
								<div className="badge">{savePlace && savePlace.length}</div>
							</div>
							<button onClick={() => setKeepOpen(!keepOpen)}>
								<FontAwesomeIcon icon={keepOpen ? faAngleUp : faAngleDown} />
							</button>
						</span>
						<div style={{ display: keepOpen ? "none" : "inline-block" }}>
							{savePlace &&
								savePlace.map((list, idx) => (
									<KeepPlaceCard
										key={idx}
										map={map}
										info={list}
									></KeepPlaceCard>
								))}
						</div>
					</SubsubmenuWrapper>
					{/* <SubsubmenuWrapper>
						<span
							style={{ fontWeight: 300, marginLeft: 20, fontSize: "1.3vw" }}
							pt={3}
							pb={3}
						>
							<span role="img" aria-label="Beach with Umbrella">
								🏖️
							</span>{" "}
							Shared Places&nbsp;
							<div className="badge">{savePlace && savePlace.length}</div>
							<button onClick={() => setShareOpen(!shareOpen)}>
								<FontAwesomeIcon icon={shareOpen ? faAngleUp : faAngleDown} />
							</button>
						</span>
						<div style={{ display: shareOpen ? "none" : "inline-block" }}>
							{savePlace &&
								savePlace.map((list, idx) => (
									<SharedPlaceCard
										key={idx}
										map={map}
										info={list}
									></SharedPlaceCard>
								))}
						</div>
						<Box></Box>
					</SubsubmenuWrapper> */}
				</SubmenuWrapper>
			</MenuWrapper>
		</Draggable>
	);
};

export default React.memo(InfoMenu);
