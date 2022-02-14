/*global Tmapv2*/
// Do not delete above comment

import React, { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import axios from "axios";
import Button from "@mui/material/Button";
import SearchIcon from "@material-ui/icons/Search";
import IconButton from "@mui/material/IconButton";
import point1 from "../Styles/source/point1.png";
import point2 from "../Styles/source/point2.png";
// import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import GestureIcon from "@material-ui/icons/Gesture";
import EmojiEmotionsIcon from "@material-ui/icons/EmojiEmotions";
import PanToolIcon from "@material-ui/icons/PanTool";
import ImageSearchIcon from "@material-ui/icons/ImageSearch";

import { readFromFirebase, searchOnYoutube } from "../functions/firebase";
import MyLocationIcon from "@material-ui/icons/MyLocation";
import { useSocket } from "../lib/socket";
import Canvas from "./Canvas";
import Picker from "emoji-picker-react";
import { Divider } from "@mui/material";

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
	z-index: 10;
`;

const Wrapper = styled.div`
	position: relative;
	width: 100%;
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

const BoardWrapper = styled.div`
	position: fixed;
	bottom: 0;
	width: 100%;
	display: flex;
	justify-content: center;
	left: -13%;

	> div {
		margin: 0 0 20px 20px;
		width: fit-content;
		background-color: white;
		-webkit-box-shadow: 6px 7px 7px 0px rgba(0, 0, 0, 0.47);
		box-shadow: 6px 7px 7px 0px rgba(0, 0, 0, 0.47);
		border-radius: 12px;

		> div button {
			&:active {
				color: #151ca2;
			}
			&.active {
				color: #151ca2;
			}
		}
	}
`;

const EmojiWrapper = styled.div`
	display: absolute;
	z-index: 11;
`;

ResultList.Item = styled.div`
	display: flex;
	align-items: center;
	&:hover {
		background: #f1f1f5;
	}
`;

const SOCKET_SERVER_URL = "http://localhost:4000";

export default function NewMapwindow() {
	const [map, setMap] = useState(null);
	const [start, setStart] = useState(null);
	const [end, setEnd] = useState(null);
	const [searchKey, setSearchKey] = useState("월평역");
	const [searchResult, setSearchResult] = useState([]);
	const [resultDrawArr, setResultDrawArr] = useState([]);
	const [chktraffic, setChktraffic] = useState([]);
	const [resultMarkerArr, setResultMarkerArr] = useState([]);
	const [markerS, setMarkerS] = useState(null);
	const [markerE, setMarkerE] = useState(null);
	const [markerC, setMarkerC] = useState(null);
	const [searchMarkers, setSearchMarkers] = useState([]);
	const [recvideo, setrecvideo] = useState([]);
	const [keepPlace, setKeepPlace] = useState([]);
	const [recvideoLoc, setrecvideoLoc] = useState([]);
	const [active, setActive] = useState("hand");
	const [totalDaytime, setTotalDaytime] = useState({
		totalD: "",
		totalTime: "",
	});
	const { socket } = useSocket();
	const [chosenEmoji, setChosenEmoji] = useState(null);
	const [drawing, setDrawing] = useState(false);
	const [drawObject, setDrawObject] = useState(null);
	const [openResult, setOpenResult] = useState(true);

	const onEmojiClick = (event, emojiObject) => {
		setChosenEmoji(emojiObject);
	};

	const initMap = () => {
		navigator.geolocation.getCurrentPosition(function (position) {
			const lat = position.coords.latitude;
			const lng = position.coords.longitude;

			socket.emit("start mapwindow", [lat, lng]);
			console.log("send location info to server", [lat, lng]);
			var center = new Tmapv2.LatLng(lat, lng);

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
		initMap();
	}, []);

	//current point
	useEffect(() => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function (position) {
				const lat = position.coords.latitude;
				const lng = position.coords.longitude;

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

		// new Tmapv2.extension.MeasureDistance({
		// 	map: map,
		// });
	}, [map]);

	//이동시
	useEffect(() => {
		const interval = setInterval(() => {
			navigator.geolocation.getCurrentPosition(function (position) {
				const lat = position.coords.latitude;
				const lng = position.coords.longitude;

				if (markerC !== null) {
					markerC.setMap(null);
				}
				setMarkerC(
					new Tmapv2.Marker({
						position: new Tmapv2.LatLng(lat, lng),
						icon: point1,
						iconSize: new Tmapv2.Size(24, 24),
						title: "현재위치",
						map: map,
					}),
				);
			});
		}, 5000);

		loadKeepList();

		return () => {
			clearInterval(interval);
		};
	}, []);

	useMemo(() => {
		if (markerC) {
			markerC.addListener("click", (e) => {
				const { _lat, _lng } = markerC.getPosition();
				// reverseGeoCoding(_lat, _lng);
				loadpointInfo(_lat, _lng);
			});
		}
	}, [markerC]);

	useMemo(async () => {
		if (recvideo.length > 0) {
			for (let i = 0; i < recvideo.length; i++) {
				const video = await searchOnYoutube(recvideo[i].name);
				setrecvideoLoc((recvideoLoc) => [...recvideoLoc, video[0]]);
			}
		}
	}, [recvideo]);

	const getDrawingObject = () => {
		if (drawing) {
			if (drawObject === null) {
				drawObject = new Tmapv2.extension.Drawing({
					map: map, // 지도 객체
					strokeWeight: 4, // 테두리 두께
					strokeColor: "blue", // 테두리 색상
					strokeOpacity: 1, // 테두리 투명도
					fillColor: "red", // 도형 내부 색상
					fillOpacity: 0.2,
				}); // 도형 내부 투명도
			}
		}
	};

	const drawRectangle = () => {
		getDrawingObject().drawRectangle();
	};

	const loadKeepList = async () => {
		const keeplist = await readFromFirebase("photos");
		setKeepPlace(keeplist);
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
					centerLon: lng,
					centerLat: lat,
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

	// const reverseGeoCoding = (lat, lng) => {
	// 	var tData = new Tmapv2.extension.TData();
	// 	const params = {
	// 		onComplete: onComplete, //데이터 로드가 성공적으로 완료 되었을때 실행하는 함수 입니다.
	// 		onProgress: onProgress, //데이터 로드 중에 실행하는 함수 입니다.
	// 		onError: onError, //데이터 로드가 실패했을때 실행하는 함수 입니다.
	// 	};

	// 	const optionObj = {
	// 		coordType: "WGS84GEO",
	// 		addressType: "A04",
	// 	};

	// 	tData.getAddressFromGeoJson(lat, lng, optionObj, params);

	// 	function onComplete() {
	// 		console.log("Complete");
	// 		console.log(this._responseData);

	// 		const loadVideoList = async (loc) => {
	// 			const videoList = await searchOnYoutube(loc);
	// 			setrecvideo(videoList);
	// 		};
	// 	}
	// 	//데이터 로드중 실행하는 함수입니다.
	// 	function onProgress() {
	// 		console.log("onprogress");
	// 	}

	// 	//데이터 로드 중 에러가 발생시 실행하는 함수입니다.
	// 	function onError() {
	// 		console.log("error");
	// 	}
	// };

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
		console.log(totalTime);
		setTotalDaytime({ totalD: totalDistance, totalTime: totalTime });

		setChktraffic(
			resultData
				.filter(({ geometry }) => geometry.type === "LineString")
				.map(({ geometry }) => geometry.traffic),
		);

		const positionBounds = new Tmapv2.LatLngBounds();
		const resultMarkerArr_ = [];
		const resultDrawArr_ = [];
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
				if (pointType == "S") {
					//출발지 마커
					markerImg =
						"http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_s.png";
					pType = "S";
				} else if (pointType == "E") {
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
		setOpenResult(true);

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

		if (chktraffic.length != 0) {
			// 교통정보 혼잡도를 체크
			// strokeColor는 교통 정보상황에 다라서 변화
			// traffic :  0-정보없음, 1-원활, 2-서행, 3-지체, 4-정체  (black, green, yellow, orange, red)
			let lineColor = "";

			if (traffic != "0") {
				if (traffic.length == 0) {
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
	};

	const onLoadCurrent = (e) => {
		const currentPosition = markerC.getPosition();
		if (!markerC.isLoaded()) {
			markerC.setMap(map);
		}
		map.setCenter(currentPosition);
	};

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

	const onHandleClick = (props) => {
		switch (props) {
			case "hand":
				setActive("hand");
				break;
			case "draw":
				setActive("draw");
				break;
			case "search":
				setActive("search");
				break;
			case "emoji":
				setActive("emoji");
				break;
			default:
				break;
		}
	};

	const trackMenu = () => {
		return (
			<div id="searchResult">
				<InputWrapper onSubmit={handleSubmit}>
					<input type="text" value={searchKey} onChange={handleChange} />
					<IconButton variant="contained" type="submit">
						<SearchIcon></SearchIcon>
					</IconButton>
				</InputWrapper>
				<ResultList>
					{searchResult &&
						openResult &&
						searchResult.map((result, idx) => (
							<ResultList.Item>
								<img
									src={`http://tmapapi.sktelecom.com/upload/tmap/marker/pin_b_m_${idx}.png`}
								/>
								{result.name}
								<Button onClick={() => handleStartSetting(result)}>출발</Button>
								<Button onClick={() => handleEndSetting(result)}>도착</Button>
							</ResultList.Item>
						))}
				</ResultList>
			</div>
		);
	};

	const infoMenu = () => {
		return (
			<MenuWrapper>
				<Box
					component="div"
					style={{ fontWeight: 600, marginLeft: 20, fontSize: "1.3vw" }}
					pt={3}
					pb={3}
				>
					Information
				</Box>
				<Divider></Divider>
				<SubmenuWrapper>
					<Box component="div">
						총 거리:{" "}
						{totalDaytime.totalD < 1
							? totalDaytime.totalD * 1000 + "m"
							: totalDaytime.totalD + "km"}
					</Box>
					<Box component="div">총 시간: {totalDaytime.totalTime} 분</Box>
					<Box component="div">출발: {start && start.name}</Box>
					<Box component="div">도착: {end && end.name}</Box>
					<Divider></Divider>
					<Box component="span">
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

					<Box component="span">
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
					<Box>
						{/* {recvideoLoc.length > 0
								? recvideoLoc.map((list, idx) => (
										<img
											key={idx}
											src={list.snippet.thumbnails.medium.url}
											width={list.snippet.thumbnails.medium.width}
											height={list.snippet.thumbnails.medium.height}
										></img>
								  ))
								: "아직 관련된 영상이 없습니다"} */}
					</Box>
				</SubmenuWrapper>
			</MenuWrapper>
		);
	};

	return (
		<React.Fragment>
			<Wrapper>
				<MapButtonWrapper>
					{trackMenu()}
					{infoMenu()}

					<BoardWrapper>
						{/* <Stack direction="row" alignItems="center" justifyContent="center">
						{types.map((type, i) => (
							<Button key={i} onClick={() => setActive(type)}>
								{type}
							</Button>
						))}
					</Stack> */}
						<div>
							<Stack
								direction="row"
								alignItems="center"
								justifyContent="center"
							>
								<IconButton
									className={active === "hand" ? "active" : ""}
									onClick={() => onHandleClick("hand")}
								>
									<PanToolIcon style={{ fontSize: "3vw" }}></PanToolIcon>
								</IconButton>
								<IconButton
									className={active === "draw" ? "active" : ""}
									onClick={() => onHandleClick("draw")}
								>
									<GestureIcon style={{ fontSize: "3vw" }}></GestureIcon>
								</IconButton>
								<IconButton
									className={active === "search" ? "active" : ""}
									onClick={() => onHandleClick("search")}
								>
									<ImageSearchIcon
										style={{ fontSize: "3vw" }}
									></ImageSearchIcon>
								</IconButton>
								<IconButton
									className={active === "emoji" ? "active" : ""}
									onClick={() => onHandleClick("emoji")}
								>
									<EmojiEmotionsIcon
										style={{ fontSize: "3vw" }}
									></EmojiEmotionsIcon>
								</IconButton>
							</Stack>
						</div>
					</BoardWrapper>
					<IconButton onClick={onLoadCurrent}>
						<MyLocationIcon style={{ fontSize: "3vw" }}></MyLocationIcon>
					</IconButton>
					{active === "emoji" ? (
						<EmojiWrapper>
							<Picker
								onEmojiClick={onEmojiClick}
								disableAutoFocus={true}
								groupNames={{ smileys_people: "PEOPLE" }}
								native
							/>
						</EmojiWrapper>
					) : null}
				</MapButtonWrapper>

				{active === "draw" ? (
					<Canvas width={window.innerWidth} height={1000}></Canvas>
				) : null}
				<div id="map_div"></div>
			</Wrapper>
		</React.Fragment>
	);
}
