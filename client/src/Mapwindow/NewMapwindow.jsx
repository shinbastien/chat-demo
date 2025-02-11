/*global Tmapv2*/
// Do not delete above comment

import React, { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import axios from "axios";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import point1 from "../Styles/source/point1.png";
import Stack from "@mui/material/Stack";
import Draggable from "react-draggable"; // The default
import {
	faHand,
	faVectorSquare,
	faPencil,
	faFaceSmile,
	faLocationDot,
	faMagnifyingGlass,
	faMapLocationDot,
	faEye,
	faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import VideoCard from "./VideoCard/VideoCard";
import { searchOnYoutube } from "../lib/functions/firebase";
import { useSocket } from "../lib/socket";
import Canvas from "./Canvas/Canvas";
import Individual from "../Individual/Individual";
import Picker from "emoji-picker-react";
import InfoMenu from "./Menu/InfoMenu";
import EmojiReaction from "./EmojiReaction/EmojiReaction";
import { useRef } from "react";

const MapWrapper = styled.div`
	z-index: -1000;
`;

const ResultList = styled.div`
	background-color: white;
	width: calc(100% - 20px);
	top: calc(-20px);

	overflow: scroll;
	height: 100px;
	border-radius: 10px;
	padding: 24px;
	margin-left: 20px;
	box-shadow: 0 6px 10px 0 rgba(0, 0, 0, 0.1);
`;

const MapButtonWrapper = styled.div`
	position: absolute;
	z-index: 100;
`;

const SearchForm = styled.div`
	position: relative;
	margin: 20px 0 0 20px;
`;

const InputWrapper = styled.form`
	margin: 0 0 0 20px;
	width: 30vw;
	-webkit-box-shadow: 6px 7px 7px 0px rgba(0, 0, 0, 0.47);
	box-shadow: 6px 7px 7px 0px rgba(0, 0, 0, 0.47);
	border-radius: 12px;
	padding: 7px 8px;
	background-color: white;
	height: 3vw;
	display: flex;
	flex-direction: row;
	> input {
		border: none;
		width: inherit;
	}
	> button {
		padding: 0;
		margin: 0;
	}
`;

const BoardWrapper = styled.div`
	position: fixed;
	bottom: 0;
	width: 100%;
	display: flex;
	justify-content: center;
	left: -13%;
	z-index: 11;

	> div {
		padding: 1.7%;
		margin: 0 0 20px 20px;
		width: fit-content;
		background-color: white;
		-webkit-box-shadow: 6px 7px 7px 0px rgba(0, 0, 0, 0.47);
		box-shadow: 6px 7px 7px 0px rgba(0, 0, 0, 0.47);
		border-radius: 12px;

		> button {
			&:active {
				color: ${(props) => props.theme.primaryColor};
			}
			&.active {
				color: ${(props) => props.theme.primaryColor};
			}
		}
	}
`;

const CurrentLocationWrapper = styled.div`
	position: absolute;
	bottom: 0;
	z-index: 222;
	margin: 0 0 20px 20px;
`;

const ShareWrapper = styled.div`
	position: absolute;
	bottom: 0;
	z-index: 222;
	margin: 0 0 80px 20px;
`;

const ButtonWrapper = styled.button`
	position: absolute;
	z-index: 300;
	font-size: 2vw;

	text-align: center;
	left: 40%;
	transform: translateX(-50%);
	background-color: white;
	padding: 1.5%;
	border-radius: 10px;
	margin: 2%;

	&:active {
		color: white;
		background-color: black;
	}

	&:hover {
		color: white;
		background-color: black;
	}
`;

const IndividualWrapper = styled.div`
	position: absolute;
	bottom: 7%;
	transform: translate(-50%, -50%);
	z-index: 222;
	margin: -25px 0 0 -25px;
	top: 50%;
	left: 50%;
	background-color: white;
	height: 600px;
	width: 50%;
	border-radius: 12px;
	-webkit-box-shadow: 6px 7px 7px 0px rgba(0, 0, 0, 0.47);
	box-shadow: 6px 7px 7px 0px rgba(0, 0, 0, 0.47);
	overflow-y: scroll;
`;

const EmojiWrapper = styled.div`
	position: fixed;
	bottom: 7%;
	display: flex;
	z-index: 222;
	left: 43%;
`;

// const VideoWrapper = styled.div`
// 	position: absolute;
// 	z-index: 300;

// 	left: 40%;
// 	transform: translateX(-50%);
// 	background-color: white;

// 	text-align: center;
// 	margin: 0 auto;
// `;

ResultList.Item = styled.div`
	display: flex;
	align-items: center;
	&:hover {
		background: #f1f1f5;
	}
`;

export default function NewMapwindow(props) {
	//map
	const [map, setMap] = useState(null);
	const [latitude, setLatitude] = useState(0.0);
	const [longtitude, setLongtitude] = useState(0.0);
	const { userName, loading } = props;

	//root-tracking
	const [start, setStart] = useState(null);
	const [end, setEnd] = useState(null);
	const [searchKey, setSearchKey] = useState("신사역");
	const [searchResult, setSearchResult] = useState([]);
	const [resultDrawArr, setResultDrawArr] = useState([]);
	const [pathMetaData, setPathMetaData] = useState([]);
	const [trackSimulationTicker, setTrackSimulationTicker] = useState(0);
	const [chktraffic, setChktraffic] = useState([]);
	const [resultMarkerArr, setResultMarkerArr] = useState([]);
	const [markerS, setMarkerS] = useState(null);
	const [markerE, setMarkerE] = useState(null);
	const [markerC, setMarkerC] = useState(null);

	const [userLocObj, setUserLocObj] = useState({});
	const [searchMarkers, setSearchMarkers] = useState([]);
	const [totalDaytime, setTotalDaytime] = useState({
		totalD: "",
		totalTime: "",
	});
	const [openResult, setOpenResult] = useState(true);
	const [sharing, setSharing] = useState(false);

	//video-list
	const [recvideo, setrecvideo] = useState([]);
	const [recvideoLoc, setrecvideoLoc] = useState([]);
	const [videoID, setVideoID] = useState("dWZznGbsLbE");

	//board
	const [active, setActive] = useState("hand");
	const [chosenEmoji, setChosenEmoji] = useState([]);
	const emojiRef = useRef([]);

	const [searching, setSearching] = useState(false);
	const [drawObject, setDrawObject] = useState(null);

	const [aniemoji, setAniEmoji] = useState(false);

	const [emojiResult, setEmojiResult] = useState(true);
	const [showInfo, setShowInfo] = useState(false);

	const [emojisender, setEmojiSender] = useState(userName);

	const [searchPoint, setSearchPoint] = useState({
		nelat: "",
		nelng: "",
		swlat: "",
		swlng: "",
	});

	// sharingItems
	const [sendShare, setSendShare] = useState(false);
	const [receiveShare, setReceiveShare] = useState(false);
	const [sharingRecVideo, setSharingRecVideo] = useState(false);
	const [sharingIndividual, setSharingIndividual] = useState(false);
	const [sharingLocation, setSharingLocation] = useState(false);

	const [individual, setIndividual] = useState(false);

	const { socket, connected } = useSocket();

	const initMap = () => {
		navigator.geolocation.getCurrentPosition(function (position) {
			const lat = position.coords.latitude;
			const lng = position.coords.longitude;

			socket.emit("start mapwindow", lat, lng);
			console.log("send location info to server", [lat, lng]);
			var center = new Tmapv2.LatLng(lat, lng);

			setLatitude(lat);
			setLongtitude(lng);
			setMap(
				new Tmapv2.Map("map_div", {
					center: center,
					width: "100%",
					height: "100vh",
					zoom: 18,
					zoomControl: true,
					scrollwheel: true,
				}),
			);
		});
	};

	useEffect(() => {
		const handleUserLocation = (data) => {
			const newLocObj = {};
			Object.keys(data)
				.filter((x) => x != userName)
				.map((name) => {
					newLocObj[name] = data[name].location;
				});

			setUserLocObj(newLocObj);
		};

		if (socket && connected) {
			initMap();
			socket.on("bring userLocationInfo", handleUserLocation);
		}
	}, [connected, socket]);

	//current point
	useEffect(() => {
		// if (map !== null) {
		// 	map.addListener("click", onClickMarker);
		// }

		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function (position) {
				const lat = position.coords.latitude;
				const lng = position.coords.longitude;
				console.log("lat is: ", lat);
				console.log("lng is: ", lng);

				setLatitude(lat);
				setLongtitude(lng);

				setMarkerC(
					new Tmapv2.Marker({
						position: new Tmapv2.LatLng(lat, lng),
						icon: point1,
						iconSize: new Tmapv2.Size(24, 24),
						title: "현재위치",
						map: map,
						label:
							"<span style='background-color: #46414E; color:white'>" +
							"현재위치" +
							"</span>",
					}),
				);
			});
		}
	}, [latitude, longtitude, map]);

	useEffect(() => {
		Object.keys(userLocObj).map((x) => {
			// Marker List 만들기
			new Tmapv2.Marker({
				position: new Tmapv2.LatLng(
					userLocObj[x].location[0],
					userLocObj[x].location[1],
				),
				icon: point1,
				iconSize: new Tmapv2.Size(30, 30),
				title: "현재위치",
				map: map,
				label:
					"<span style='background-color: #46414E; color:white'>" +
					"현재위치" +
					"</span>",
			});
		});
	}, [userLocObj]);

	//이동시
	// useEffect(() => {
	// 	const interval = setInterval(() => {
	// 		navigator.geolocation.getCurrentPosition(function (position) {
	// 			const lat = position.coords.latitude;
	// 			const lng = position.coords.longitude;
	// 			if (markerC !== null) {
	// 				markerC.setMap(null);
	// 			}
	// 			setMarkerC(
	// 				new Tmapv2.Marker({
	// 					position: new Tmapv2.LatLng(lat, lng),
	// 					icon: point1,
	// 					iconSize: new Tmapv2.Size(24, 24),
	// 					title: "이동중",
	// 					map: map,
	// 				}),
	// 			);
	// 		});
	// 		console.log("I am moving...");
	// 	}, 5000);
	// 	return () => {
	// 		clearInterval(interval);
	// 	};
	// }, [markerC]);

	// 출발 -- 도착 자동 이동
	useEffect(() => {
		if (pathMetaData.length > 0) {
			const duration = 1;
			const interval = setInterval(() => {
				setTrackSimulationTicker((prevTicker) => {
					const currTick = prevTicker + duration;
					const lastAccTime = pathMetaData[pathMetaData.length - 1].accTime;
					const finishTime = lastAccTime[lastAccTime.length - 1];

					console.log(`I am moving...: ${currTick}`);

					for (let i = 0; i < pathMetaData.length; i++) {
						const { accTime, coordinates } = pathMetaData[i];
						for (let j = 0; j - 1 < accTime.length; j++) {
							if (accTime[j] <= currTick && currTick < accTime[j + 1]) {
								console.log(pathMetaData[i]);
								const timediff = accTime[j + 1] - accTime[j];
								const ratio = (currTick - accTime[j]) / timediff;
								const coord = coordinates[j];
								const coord2 = coordinates[j + 1];
								const latlng = new Tmapv2.Point(
									(coord2[0] - coord[0]) * ratio + coord[0],
									(coord2[1] - coord[1]) * ratio + coord[1],
								);
								const projection =
									new Tmapv2.Projection.convertEPSG3857ToWGS84GEO(latlng);
								const lat = projection._lat;
								const lng = projection._lng;

								// console.log(currTick, accTime[j], accTime[j+1], lat, lng)
								setMarkerC((prevMarker) => {
									console.log(prevMarker);
									prevMarker.setMap(null);
									prevMarker.setVisible(false);
									return getMarkers({
										lat: lat,
										lng: lng,
										markerImage: point1,
										title: `현재위치 ${finishTime - currTick}초 남음`,
									});
								});
							}
						}
					}
					return currTick;
				});
			}, duration * 1000);

			// loadKeepList();

			return () => {
				clearInterval(interval);
				setTrackSimulationTicker(0);
			};
		}
	}, [pathMetaData]);

	// const onClickMarker = (e) => {
	// 	const latlng = e.latLng;
	// 	const marker = new Tmapv2.Marker({
	// 		position: new Tmapv2.LatLng(latlng.lat(), latlng.lng()),
	// 		map: map,
	// 	});

	// 	const buttonWindow = `
	// 			<div>
	// 			<input type="text"/>
	// 				<button onClick={}>Keep 등록</button>
	// 			</div>
	// 		`;
	// 	const infoWindow = new Tmapv2.InfoWindow({
	// 		position: new Tmapv2.LatLng(latlng.lat(), latlng.lng()),
	// 		content: `${buttonWindow}`,
	// 		map: map,
	// 		type: 2,
	// 	});
	// };

	useMemo(() => {
		if (markerC) {
			markerC.addListener("click", (e) => {
				const { _lat, _lng } = markerC.getPosition();
				// setSharing(true);
				// loadpointInfo(_lat, _lng);
				// if (socket && connected) {
				// 	socket.emit("start shareVideo", videoID);
				// }
			});
		}
	}, [markerC, socket, connected]);

	useEffect(() => {
		if (socket && connected) {
			socket.on("start videoplayer", (videoID) => {
				setSharing(true);
				setVideoID(videoID);
			});
		}
	}, [socket, connected]);

	useMemo(async () => {
		let active = true;
		fetchData();
		return () => {
			active = false;
		};

		async function fetchData() {
			if (recvideo.length > 0) {
				for (let i = 0; i < recvideo.length; i++) {
					let video = await searchOnYoutube(recvideo[i].name);

					if (video === undefined) {
						video = {
							id: { kind: null, videoId: null },
						};
					}
					// setrecvideoLoc((recvideoLoc) => [...recvideoLoc, video[0]]);
					setrecvideoLoc((recvideoLoc) => [
						...recvideoLoc,
						{ [recvideo[i].name]: video },
						// { [recvideo[i].name]: video[0] },
					]);
				}

				if (!active) {
					return;
				}
			}
		}
	}, [recvideo]);

	console.log(recvideoLoc);

	useEffect(async () => {
		if (!start || !end) {
			return;
		}

		const res = await axios({
			method: "post",
			url: "https://apis.openapi.sk.com/tmap/routes?version=1&format=json&callback=result",
			params: {
				appKey: process.env.REACT_APP_TMAP_API_KEY,
				startX: start.noorLon,
				startY: start.noorLat,
				endX: end.noorLon,
				endY: end.noorLat,
				reqCoordType: "EPSG3857",
				resCoordType: "EPSG3857",
				searchOption: 0,
				trafficInfo: "Y",
			},
		});

		resettingMap();

		const {
			data: { features: resultData },
		} = res;

		const totalDistance = (
			resultData[0].properties.totalDistance / 1000
		).toFixed(1);

		const totalTime = (resultData[0].properties.totalTime / 60).toFixed(0);

		console.log(
			totalTime,
			resultData
				.filter(({ geometry }) => geometry.type === "LineString")
				.reduce((acc, curr) => {
					return acc + curr.properties.time;
				}, 0),
		);

		setTotalDaytime({ totalD: totalDistance, totalTime: totalTime });

		setChktraffic(
			resultData
				.filter(({ geometry }) => geometry.type === "LineString")
				.map(({ geometry }) => geometry.traffic),
		);

		const positionBounds = new Tmapv2.LatLngBounds();
		const resultMarkerArr_ = [];
		const resultDrawArr_ = [];
		const trackPathTime = resultData
			.filter(({ geometry }) => geometry.type === "LineString")
			.map(({ geometry, properties }) => {
				const { coordinates, traffic } = geometry;
				const { time } = properties;

				const intervalDistance = coordinates.reduce((acc, curr, idx) => {
					if (idx === 0) {
						return [0];
					} else {
						const [c1, c2] = coordinates[idx - 1];
						const dist = Math.sqrt(
							Math.pow(curr[0] - c1, 2) + Math.pow(curr[1] - c2, 2),
						);
						return [...acc, dist];
					}
				}, []);
				const distSum = intervalDistance.reduce((acc, curr) => acc + curr, 0);
				const intervalTime = intervalDistance.map(
					(dist, idx) => (dist / distSum) * time,
				);
				const accTime = intervalTime.reduce((acc, curr, idx) => {
					if (idx === 0) {
						return [0];
					}
					return [...acc, acc[acc.length - 1] + curr];
				}, []);
				accTime[accTime.length - 1] = time; // force sanity check

				return {
					coordinates,
					accTime,
				};
			})
			.reduce((acc, curr, idx) => {
				if (idx === 1) {
					return [curr];
				}
				const { accTime } = acc[acc.length - 1];
				const lastTime = accTime[accTime.length - 1];
				return [
					...acc,
					{
						coordinates: curr.coordinates,
						accTime: curr.accTime.map((time) => time + lastTime),
					},
				];
			});

		setPathMetaData(trackPathTime);
		setTrackSimulationTicker(0);

		resultData.map((item, i) => {
			const { geometry, properties } = item;
			// path information
			console.log(item);

			if (geometry.type === "LineString") {
				const { coordinates, traffic } = geometry;

				const sectionInfos = coordinates.map((coord) => {
					const latlng = new Tmapv2.Point(coord[0], coord[1]);
					return new Tmapv2.Projection.convertEPSG3857ToWGS84GEO(latlng);
				});

				sectionInfos.map(({ _lat, _lng }) => {
					positionBounds.extend(new Tmapv2.LatLng(_lat, _lng));
				});

				resultDrawArr_.push(...drawLine(sectionInfos, traffic));
			} else {
				const { coordinates } = geometry;
				const { pointType } = properties;
				let markerImg = "";
				let pType = "";
				if (pointType === "S") {
					//출발지 마커
					markerImg =
						"http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_s.png";
					pType = "S";
				} else if (pointType === "E") {
					//도착지 마커
					markerImg =
						"http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_e.png";
					pType = "E";
				} else {
					//각 포인트 마커
					markerImg = "http://topopen.tmap.co.kr/imgs/point.png";
					pType = "P";
				}

				// 경로들의 결과값들을 포인트 객체로 변환
				const latlon = new Tmapv2.Point(coordinates[0], coordinates[1]);
				// 포인트 객체를 받아 좌표값으로 다시 변환
				const convertPoint = new Tmapv2.Projection.convertEPSG3857ToWGS84GEO(
					latlon,
				);

				const routeInfoObj = {
					markerImage: markerImg,
					lng: convertPoint._lng,
					lat: convertPoint._lat,
					pointType: pType,
				};
				// 마커 추가
				resultMarkerArr_.push(getMarkers(routeInfoObj));
			}
		});

		setResultMarkerArr(resultMarkerArr_);
		setResultDrawArr(resultDrawArr_);

		map.panToBounds(positionBounds);
	}, [start, end]);

	const resettingMap = () => {
		searchMarkers.map((marker) => marker.setMap(null));
		setSearchMarkers([]);

		resultMarkerArr.map((marker) => {
			marker.setMap(null);
		});

		resultDrawArr.map((draw) => {
			draw.setMap(null);
		});

		markerS.setVisible(false);
		markerE.setVisible(false);

		setResultMarkerArr([]);
		setResultDrawArr([]);
	};

	const getMarkers = (infoObj) => {
		const { pointType, lat, lng, markerImage, title } = infoObj;
		const size =
			pointType === "P" ? new Tmapv2.Size(8, 8) : new Tmapv2.Size(24, 38); //아이콘 크기 설정합니다.

		if (title) {
			var label =
				"<span style='background-color: #46414E;color:white'>" +
				title +
				"</span>";
		}
		return new Tmapv2.Marker({
			position: new Tmapv2.LatLng(lat, lng),
			icon: markerImage,
			iconSize: size,
			map: map,
			title: title,
			label: label,
		});
	};

	const drawLine = (arrPoint, traffic) => {
		const resultDrawArr_ = [];

		if (chktraffic.length !== 0) {
			// 교통정보 혼잡도를 체크
			// strokeColor는 교통 정보상황에 다라서 변화
			// traffic :  0-정보없음, 1-원활, 2-서행, 3-지체, 4-정체  (black, green, yellow, orange, red)
			let lineColor = "";

			if (traffic != "0") {
				if (traffic.length === 0) {
					//length가 0인것은 교통정보가 없으므로 검은색으로 표시
					resultDrawArr_.push(
						new Tmapv2.Polyline({
							path: arrPoint,
							strokeColor: "#06050D",
							strokeWeight: 6,
							map: map,
						}),
					);
				} else {
					//교통정보가 있음

					if (traffic[0][0] !== 0) {
						//교통정보 시작인덱스가 0이 아닌경우
						const tInfo = [];

						for (let z = 0; z < traffic.length; z++) {
							tInfo.push({
								startIndex: traffic[z][0],
								endIndex: traffic[z][1],
								trafficIndex: traffic[z][2],
							});
						}

						const noInfomationPoint = [];

						for (let p = 0; p < tInfo[0].startIndex; p++) {
							noInfomationPoint.push(arrPoint[p]);
						}

						resultDrawArr_.push(
							new Tmapv2.Polyline({
								path: noInfomationPoint,
								strokeColor: "#06050D",
								strokeWeight: 6,
								map: map,
							}),
						);

						for (var x = 0; x < tInfo.length; x++) {
							const sectionPoint = []; //구간선언

							for (var y = tInfo[x].startIndex; y <= tInfo[x].endIndex; y++) {
								sectionPoint.push(arrPoint[y]);
							}

							if (tInfo[x].trafficIndex == 0) {
								lineColor = "#06050D";
							} else if (tInfo[x].trafficIndex == 1) {
								lineColor = "#61AB25";
							} else if (tInfo[x].trafficIndex == 2) {
								lineColor = "#FFFF00";
							} else if (tInfo[x].trafficIndex == 3) {
								lineColor = "#E87506";
							} else if (tInfo[x].trafficIndex == 4) {
								lineColor = "#D61125";
							}

							//라인그리기[E]
							resultDrawArr_.push(
								new Tmapv2.Polyline({
									path: sectionPoint,
									strokeColor: lineColor,
									strokeWeight: 6,
									map: map,
								}),
							);
						}
					} else {
						//0부터 시작하는 경우

						const tInfo = [];

						for (let z = 0; z < traffic.length; z++) {
							tInfo.push({
								startIndex: traffic[z][0],
								endIndex: traffic[z][1],
								trafficIndex: traffic[z][2],
							});
						}

						for (let x = 0; x < tInfo.length; x++) {
							const sectionPoint = []; //구간선언

							for (let y = tInfo[x].startIndex; y <= tInfo[x].endIndex; y++) {
								sectionPoint.push(arrPoint[y]);
							}

							if (tInfo[x].trafficIndex == 0) {
								lineColor = "#06050D";
							} else if (tInfo[x].trafficIndex == 1) {
								lineColor = "#61AB25";
							} else if (tInfo[x].trafficIndex == 2) {
								lineColor = "#FFFF00";
							} else if (tInfo[x].trafficIndex == 3) {
								lineColor = "#E87506";
							} else if (tInfo[x].trafficIndex == 4) {
								lineColor = "#D61125";
							}

							resultDrawArr_.push(
								new Tmapv2.Polyline({
									path: sectionPoint,
									strokeColor: lineColor,
									strokeWeight: 6,
									map: map,
								}),
							);
						}
					}
				}
			} else {
			}
		} else {
			resultDrawArr_.push(
				new Tmapv2.Polyline({
					path: arrPoint,
					strokeColor: "#DD0000",
					strokeWeight: 6,
					map: map,
				}),
			);
		}
		return resultDrawArr_;
	};

	const handleChange = (e) => {
		setSearchKey(e.target.value);
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		searchMarkers.map((marker) => marker.setMap(null));
		setSearchMarkers([]);

		const response = await axios({
			method: "get",
			url: "https://apis.openapi.sk.com/tmap/pois?version=1&format=json&callback=result",
			params: {
				appKey: process.env.REACT_APP_TMAP_API_KEY,
				searchKeyword: searchKey,
				resCoordType: "EPSG3857",
				reqCoordType: "WGS84GEO",
				count: 10,
			},
		});
		const result = response.data.searchPoiInfo.pois.poi;
		setSearchResult(result);
		const positionBounds = new Tmapv2.LatLngBounds();

		setSearchMarkers(
			result.map((data, k) => {
				const name = data.name;
				const markerPosition = getPositionFromData(data);
				const marker = new Tmapv2.Marker({
					position: markerPosition,
					icon: `http://tmapapi.sktelecom.com/upload/tmap/marker/pin_b_m_${k}.png`,
					iconSize: new Tmapv2.Size(24, 38),
					title: name,
					map: map,
				});

				positionBounds.extend(markerPosition);

				return marker;
			}),
		);

		map.panToBounds(positionBounds);
	};

	const handleStartSetting = (data) => {
		setStart(data);
		const markerPosition = getPositionFromData(data);

		if (markerS !== null) {
			markerS.setMap(null);
		}

		setMarkerS(
			new Tmapv2.Marker({
				position: markerPosition,
				icon: "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_s.png",
				iconSize: new Tmapv2.Size(24, 38),
				map: map,
			}),
		);
	};

	const handleEndSetting = (data) => {
		setEnd(data);
		const markerPosition = getPositionFromData(data);

		if (markerE !== null) {
			markerE.setMap(null);
		}

		setMarkerE(
			new Tmapv2.Marker({
				position: markerPosition,
				icon: "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_e.png",
				iconSize: new Tmapv2.Size(24, 38),
				map: map,
			}),
		);

		existSearch();
	};

	useEffect(() => {
		if (searching === true && drawObject !== null) {
			drawObject.drawRectangle();
			map.addListener("click", onTouchDrawing);
		}
	}, [searching, drawObject]);

	const onTouchDrawing = (e) => {
		const { _data } = drawObject;
		if (map && searching === true && drawObject !== null) {
			if (drawObject._data.shapeArray.length > 0) {
				setSearchPoint({
					nelat: _data.shapeArray[0]._shape_data.bounds._ne._lat,
					nelng: _data.shapeArray[0]._shape_data.bounds._ne._lng,
					swlat: _data.shapeArray[0]._shape_data.bounds._sw._lat,
					swlng: _data.shapeArray[0]._shape_data.bounds._sw._lng,
				});

				setShowInfo(true);
			}
		}
	};

	const onSearchedPoint = () => {
		drawObject.clear();
		loadpointInfo(searchPoint);

		setDrawObject(null);
		setShowInfo(false);
	};

	const existSearch = () => {
		setOpenResult(false);
	};

	const loadpointInfo = async (lat, lng) => {
		try {
			const { data: items } = await axios({
				method: "get",
				url: "https://apis.openapi.sk.com/tmap/pois/search/around?version=1&format=json&callback=result",
				params: {
					categories: "카페;음식점;",
					appKey: process.env.REACT_APP_TMAP_API_KEY,
					reqLevel: 15,
					radius: 1,
					centerLon: searchPoint.nelng,
					centerLat: searchPoint.nelat,
					reqCoordType: "WGS84GEO",
					resCoordType: "WGS84GEO",
					count: 5,
				},
			});
			setrecvideo(items.searchPoiInfo.pois.poi);
		} catch (err) {
			console.log(err);
		}
	};

	const onLoadCurrent = (e) => {
		const currentPosition = markerC.getPosition();
		if (!markerC.isLoaded()) {
			markerC.setMap(map);
		}
		map.setCenter(currentPosition);
	};

	const onLoadOtherCurrent = (e) => {
		const currentOtherPosition = markerC.getPosition();
		if (!markerC.isLoaded()) {
			markerC.setMap(map);
		}
		map.setCenter(currentOtherPosition);
	};

	const onShareCurrent = (e) => {
		// clicked share button
		if (socket && connected) {
			if (!sendShare) {
				socket.emit("start sendShare request");
			} else {
				socket.emit("finish sendShare request");
				setSendShare(!sendShare);
				alert("you finished sharing");
			}
		}
	};

	const getPositionFromData = (data) => {
		const noorLat = Number(data.noorLat);
		const noorLon = Number(data.noorLon);

		const pointCng = new Tmapv2.Point(noorLon, noorLat);
		const projectionCng = new Tmapv2.Projection.convertEPSG3857ToWGS84GEO(
			pointCng,
		);
		const lat = projectionCng._lat;
		const lon = projectionCng._lng;

		return new Tmapv2.LatLng(lat, lon);
	};

	const onHandleSearchObject = () => {
		if (drawObject !== null) {
			drawObject.clear();
			setDrawObject(null);
		}
		if (searching) {
			setSearching(false);
			setrecvideoLoc([]);
		}
		if (individual) {
			setIndividual(false);
		}
	};

	const onHandleClick = (props) => {
		switch (props) {
			case "hand":
				setActive("hand");
				onHandleSearchObject();
				break;
			case "draw":
				setActive("draw");
				if (socket && connected) {
					socket.emit("start canvas");
				}
				onHandleSearchObject();
				break;
			case "search":
				setActive("search");
				setSearching(true);
				onHandleSearchObject();
				if (drawObject === null) {
					setDrawObject(
						new Tmapv2.extension.Drawing({
							map: map, // 지도 객체
							strokeWeight: 4, // 테두리 두께
							strokeColor: "blue", // 테두리 색상
							strokeOpacity: 1, // 테두리 투명도
							fillColor: "blue", // 도형 내부 색상
							fillOpacity: 0.1,
						}),
					);
				}

				break;
			case "emoji":
				setActive("emoji");
				setEmojiResult(true);
				onHandleSearchObject();
				break;
			case "individualSearch":
				setActive("individualSearch");
				setIndividual(true);
				onHandleSearchObject();
				break;
			default:
				break;
		}
	};
	console.log(chosenEmoji);

	const onEmojiClick = (event, emojiObject) => {
		const { emoji } = emojiObject;
		emojiRef.current.push(emoji); //setChosenEmoji(emoji);
		setChosenEmoji((chosenEmoji) => [...chosenEmoji, emoji]);
		setEmojiResult(false);
		setEmojiSender(userName);
		if (socket && connected) {
			socket.emit("send emoji", emoji, userName);
		}
	};

	//emoji
	useEffect(() => {
		const handleGetEmoji = (emoji, userName) => {
			// setChosenEmoji(emoji);
			setEmojiSender(userName);
		};
		if (socket && connected) {
			socket.on("get emoji", handleGetEmoji);
		}
		if (chosenEmoji.length > 0) {
			setAniEmoji(true);

			setTimeout(() => {
				setAniEmoji(false);
				emojiRef.current[0] = null;
				setChosenEmoji([]);
			}, 200000);
		}
		return () => {
			if (socket && connected) {
				socket.off("get emoji", handleGetEmoji);
			}
		};
	}, [chosenEmoji, socket, connected]);

	// Open Canvas
	useEffect(() => {
		const handleCanvas = () => {
			setActive("draw");
			console.log("handleCanvas");
		};
		if (socket && connected) {
			socket.on("open canvas", handleCanvas);
			console.log("start canvas", active);
		}
		return () => {
			if (socket && connected) {
				socket.off("open canvas", handleCanvas);
				console.log("active changed", active);
			}
		};
	}, [active, socket, connected]);

	//
	useEffect(() => {
		if (socket && connected) {
			socket.on("sendshare response", (current, user) => {
				if (current != user) {
					alert(`already somebody is sharing:${current}`);
				} else {
					alert("now you are sharing Host");
					setSendShare(!sendShare);
				}
			});
		}
		return () => {
			socket.off("sendshare response");
		};
	}, [sendShare, socket, connected]);

	// Sending Share Mode
	useEffect(() => {
		if (sendShare) {
			if (socket && connected) {
				if (recvideoLoc.length > 0) {
					socket.emit("sendshare videoLoc", recvideoLoc);
				}

				if (individual) {
					socket.emit("sendshare individual");
				}
			}
		} else {
			return;
		}
	}, [sendShare, individual, recvideoLoc, socket, connected]);

	// Receving Share Mode
	useEffect(() => {
		if (socket && connected) {
			socket.on("start sharemode", (user) => {
				alert(`${user} is now sharing!`);
				setReceiveShare(true);
			});

			socket.on("finish sharemode", (user) => {
				setReceiveShare(false);
				alert(`${user} finished sharing`);
			});

			socket.on("receive sharedvideoLoc", (videoLoc) => {
				setrecvideoLoc(videoLoc);
			});

			socket.on("receive share individual", () => {
				setIndividual(true);
			});
		}
		return () => {
			if (socket && connected) {
				socket.off("start sharemode");
				socket.off("receive sharedvideoLoc");
				socket.off("finish sharemode");
				socket.off("receive share individual");
			}
		};
	}, [receiveShare, socket, connected]);

	console.log(recvideoLoc);

	return (
		<React.Fragment>
			{receiveShare
				? recvideoLoc.length > 0 &&
				  recvideoLoc.map((list, idx) => (
						<VideoCard key={idx} info={list}></VideoCard>
				  ))
				: searching &&
				  recvideoLoc.length > 0 &&
				  recvideoLoc.map((list, idx) => (
						<VideoCard key={idx} info={list}></VideoCard>
				  ))}
			{chosenEmoji.length > 0 &&
				chosenEmoji.map((emojiObject, idx) => (
					<EmojiReaction
						key={idx}
						ref={emojiRef[idx]}
						state={aniemoji}
						emoji={emojiObject}
						userName={emojisender}
					></EmojiReaction>
				))}

			{drawObject ? (
				[
					showInfo ? (
						<ButtonWrapper onClick={() => onSearchedPoint()}>
							정보 찾기
						</ButtonWrapper>
					) : (
						<></>
					),
				]
			) : (
				<></>
			)}

			{individual && (
				<IndividualWrapper>
					<Individual
						individual={individual}
						stateChanger={setIndividual}
						host={sendShare ? true : false}
						receiver={receiveShare ? true : false}
					/>
				</IndividualWrapper>
			)}
			<MapButtonWrapper>
				<SearchForm>
					<Draggable>
						<InputWrapper onSubmit={handleSubmit}>
							<input type="text" value={searchKey} onChange={handleChange} />
							<IconButton variant="contained" type="submit">
								<FontAwesomeIcon icon={faMagnifyingGlass} />
							</IconButton>
						</InputWrapper>
					</Draggable>
					{searchResult.length > 0 && openResult && (
						<ResultList>
							{searchResult.map((result, idx) => (
								<ResultList.Item key={idx}>
									<img
										src={`http://tmapapi.sktelecom.com/upload/tmap/marker/pin_b_m_${idx}.png`}
									/>
									{result.name}
									<Button
										style={{ cursor: "pointer" }}
										onClick={() => handleStartSetting(result)}
									>
										출발
									</Button>
									<Button
										style={{ cursor: "pointer" }}
										onClick={() => handleEndSetting(result)}
									>
										도착
									</Button>
								</ResultList.Item>
							))}
						</ResultList>
					)}
				</SearchForm>

				<InfoMenu
					map={map}
					totalDaytime={totalDaytime}
					start={start}
					end={end}
				></InfoMenu>

				<Draggable>
					<BoardWrapper>
						<Stack direction="row" alignItems="center" justifyContent="center">
							<IconButton
								className={active === "hand" ? "active" : ""}
								onClick={() => onHandleClick("hand")}
							>
								<FontAwesomeIcon style={{ fontSize: "3vw" }} icon={faHand} />
							</IconButton>
							<IconButton
								className={active === "draw" ? "active" : ""}
								onClick={() => onHandleClick("draw")}
							>
								<FontAwesomeIcon style={{ fontSize: "3vw" }} icon={faPencil} />
							</IconButton>

							<IconButton
								className={active === "search" ? "active" : ""}
								onClick={() => onHandleClick("search")}
							>
								<FontAwesomeIcon
									style={{ fontSize: "3vw" }}
									icon={faVectorSquare}
								/>
							</IconButton>
							<IconButton
								className={active === "emoji" ? "active" : ""}
								onClick={() => onHandleClick("emoji")}
							>
								<FontAwesomeIcon
									style={{ fontSize: "3vw" }}
									icon={faFaceSmile}
								/>
							</IconButton>
							<IconButton
								className={active === "individualSearch" ? "active" : ""}
								onClick={() => onHandleClick("individualSearch")}
							>
								<FontAwesomeIcon
									style={{ fontSize: "3vw" }}
									icon={faMapLocationDot}
								/>
							</IconButton>
						</Stack>
					</BoardWrapper>
				</Draggable>
			</MapButtonWrapper>
			<CurrentLocationWrapper>
				<IconButton onClick={onLoadCurrent}>
					<FontAwesomeIcon style={{ fontSize: "3vw" }} icon={faLocationDot} />
				</IconButton>

				<IconButton onClick={onLoadOtherCurrent}>
					<FontAwesomeIcon style={{ fontSize: "3vw" }} icon={faLocationDot} />
				</IconButton>
			</CurrentLocationWrapper>

			<ShareWrapper>
				<IconButton onClick={onShareCurrent}>
					<FontAwesomeIcon
						style={{ fontSize: "3vw" }}
						icon={sendShare ? faEyeSlash : faEye}
					/>
				</IconButton>
			</ShareWrapper>
			{active === "emoji" && emojiResult ? (
				<EmojiWrapper>
					<Picker
						onEmojiClick={onEmojiClick}
						disableAutoFocus={true}
						groupNames={{ smileys_people: "PEOPLE" }}
						native
					/>
				</EmojiWrapper>
			) : null}
			{active === "draw" ? <Canvas width={2000} height={1000}></Canvas> : null}
			<MapWrapper id="map_div"></MapWrapper>
		</React.Fragment>
	);
}
