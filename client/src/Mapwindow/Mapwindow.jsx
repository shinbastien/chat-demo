import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import { MenuItem } from "@mui/material";

import { readFromFirebase } from "../functions/firebase";

const Wrapper = styled.div`
	position: relative;
	width: 100%;
`;

const MenuWrapper = styled.div`
	position: absolute;
	z-index: 10;
`;

const MapWrapper = styled.div`
	height: 1000px;
`;

const css =
	"color: white; \
             background-color: blue;\
			 border-radius: 10px;\
			 ";

//이동시마다 받아옴
function UseInterval(callback, delay) {
	const savedCallback = useRef();

	useEffect(() => {
		savedCallback.current = callback;
	});

	useEffect(() => {
		function tick() {
			savedCallback.current();
		}

		let id = setInterval(tick, delay);
		return () => clearInterval(id);
	}, [delay]);
}

export default function Mapwindow(params) {
	const [lat_, setLat] = useState(0);
	const [lng_, setLog] = useState(0);
	const [dest, setDest] = useState(true);
	const [map, setKmap] = useState();

	//'keep' button open > submenu
	const [anchorEl, setAnchorEl] = React.useState(null);
	const open = Boolean(anchorEl);

	const [keep, setKeep] = useState(false);
	const [keeplist, setKeeplist] = useState([]);
	const [keepPlace, setKeepPlace] = useState([
		{
			id: 1,
			name: "place 1",
			coords: {
				lat: 36.368258636020634,
				lng: 127.36385086076758,
			},
		},
		{
			id: 2,
			name: "place 2",
			coords: {
				lat: 36.3737905724698,
				lng: 127.36720858751144,
			},
		},

		{
			id: 3,
			name: "place 3",
			coords: {
				lat: 37.52852967338524,
				lng: 126.96922791179354,
			},
		},
		{
			id: 4,
			name: "place 4",
			coords: {
				lat: 37.42812509478836,
				lng: 126.99524348235616,
			},
		},
		{
			id: 5,
			name: "place 5",
			coords: {
				lat: 37.42887299230859,
				lng: 126.99683648886092,
			},
		},
	]);
	const [share, setShare] = useState(false);
	const [sharePlace, setSharePlace] = useState([
		{
			id: 1,
			name: "place 1",
			coords: {
				lat: 36.368258636020634,
				lng: 127.36385086076758,
			},
		},
		{
			id: 2,
			name: "place 2",
			coords: {
				lat: 36.3737905724698,
				lng: 127.36720858751144,
			},
		},
	]);

	const mapPlace = useRef();
	const infoPlace = useRef();
	const currentLoc = useRef();
	const customLoc = useRef();

	var kakao = window.kakao;

	const locPosition = (lat, lng) => new kakao.maps.LatLng(lat, lng);
	const loadgeocoder = () => new kakao.maps.services.Geocoder();

	const setMap = () => {
		const result = locPosition(lat_, lng_);
		var options = {
			center: result,
			level: 3,
		};
		setKmap(new kakao.maps.Map(mapPlace.current, options));

		const currentMarker = new kakao.maps.Marker({
			position: result,
		});

		currentMarker.setMap(map);
	};

	useEffect(() => {
		navigator.geolocation.getCurrentPosition(function (position) {
			setLat(position.coords.latitude);
			setLog(position.coords.longitude);
		});
		setMap();
	}, [lat_, lng_]);

	//loadkeep
	const onLoadKeep = (e) => {
		setMarker(map);
		setKeep(!keep);
		setAnchorEl(e.currentTarget);
	};

	const setMarker = (map) => {
		for (let i = 0; i < keepPlace.length; i++) {
			const { lat, lng } = keepPlace[i].coords;
			const mark_ = new kakao.maps.LatLng(lat, lng);
			const newMarker = new kakao.maps.Marker({
				position: mark_,
			});
			const customOverlayKeep = new kakao.maps.CustomOverlay({
				position: mark_,
				content: `<div className ="label" style="color:blue; background-color:white;"><span class="left"></span><span class="center">${keepPlace[i].name}</span><span class="right"></span></div>`,
			});
			newMarker.setMap(map);
			customOverlayKeep.setMap(map);
		}
	};

	const onClickKeep = (list) => {
		const keepPlaceResult = keepPlace.find((place) => place.name == list);
		const { lat, lng } = keepPlaceResult.coords;
		const keepLocation = new kakao.maps.LatLng(lat, lng);
		const newMarker = new kakao.maps.Marker({
			map: map,
			position: keepLocation,
		});
		const customOverlayKeep = new kakao.maps.CustomOverlay({
			position: keepLocation,
			content: `<div className ="label" style="color:blue; background-color:white;"><span class="left"></span><span class="center">${list}</span><span class="right"></span></div>`,
		});

		newMarker.setMap(map);
		customOverlayKeep.setMap(map);
		map.setCenter(keepLocation);
	};

	const onClickGeocoder = () => {
		const position = locPosition(lat_, lng_);
		console.log(position);
		searchDetailAddrFromCoords(position, function (result, status) {
			if (status === kakao.maps.services.Status.OK) {
				const detailAddr = !!result[0].address
					? "<div>도로명주소 : " + result[0].address.address_name + "</div>"
					: "";

				console.log(detailAddr);
			} else {
				console.error();
			}
		});
	};

	function searchDetailAddrFromCoords(coords, callback) {
		const geocoder = loadgeocoder();
		geocoder.coord2Address(coords.getLng(), coords.getLat(), callback);
	}

	//load destination
	//TODO: Need to revise
	const onLoadDestination = () => {
		if (dest === true) {
			keepPlace.map((element) => {
				const { lat, lng } = element.coords;
				const mark_ = new kakao.maps.LatLng(lat, lng);
				const newMarker = new kakao.maps.Marker({
					map: map,
					position: mark_,
				});
				newMarker.setPosition(mark_);

				setKeeplist((keeplist) => [...keeplist, element.name]);
			});

			setDest(!dest);
		}
	};

	//TODO: Need to revise
	const onLoadSharePicture = () => {
		if (share === false) {
			sharePlace.forEach((element) => {
				const { lat, lng } = element.coords;
				console.log(element);
				const mark_ = new kakao.maps.LatLng(lat, lng);
				const newMarker = new kakao.maps.Marker({
					map: map,
					position: mark_,
				});
				newMarker.setPosition(mark_);
				setSharePlace((sharelist) => [...sharelist, element.name]);
			});

			setShare(!share);
		}
	};

	const onLoadCurrent = () => {
		const result = locPosition(lat_, lng_);
		const currentMarker = new kakao.maps.Marker({
			position: result,
		});
		currentMarker.setMap(map);
		// console.log("loadding...");

		const customOverlay = new kakao.maps.CustomOverlay({
			position: result,
			content: `<div className ="label" style='${css}'><span class="left"></span><span class="center">${"현재 위치"}</span><span class="right"></span></div>`,
		});
		customOverlay.setMap(map);
		currentLoc.current = currentMarker;
		customLoc.current = customOverlay;
		map.setCenter(result);
	};

	//이동시
	UseInterval(() => {
		if (mapPlace !== null) {
			navigator.geolocation.getCurrentPosition(function (position) {
				currentLoc.current.setPosition(
					new kakao.maps.LatLng(
						position.coords.latitude,
						position.coords.longitude,
					),
				);
				customLoc.current.setPosition(
					new kakao.maps.LatLng(
						position.coords.latitude,
						position.coords.longitude,
					),
				);
			});
			console.log("loadding...");
		}
	}, 5000);

	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<>
			<Wrapper>
				<MenuWrapper>
					<Button onClick={onClickGeocoder}>주변과 관련된 영상 찾아보기</Button>
					<Button
						onClick={onLoadKeep}
						aria-controls={open ? "basic-menu" : undefined}
						aria-haspopup="true"
						aria-expanded={open ? "true" : undefined}
					>
						Keep {keepPlace.length} 개
					</Button>
					<Button onClick={onLoadSharePicture}>
						공유 풍경 {keepPlace.length}
					</Button>
					<Button onClick={onLoadDestination}>목적지</Button>
					<div ref={infoPlace}>
						{keep ? (
							<Menu
								anchorEl={anchorEl}
								open={open}
								MenuListProps={{
									"aria-labelledby": "basic-button",
								}}
								onClose={handleClose}
							>
								{keepPlace.map((list, index) => (
									<MenuItem onClick={() => onClickKeep(list.name)} key={index}>
										{list.name}
									</MenuItem>
								))}
							</Menu>
						) : null}
					</div>
					<Button onClick={onLoadCurrent}>현재 위치</Button>
				</MenuWrapper>
				<MapWrapper className="map" ref={mapPlace}></MapWrapper>
			</Wrapper>
		</>
	);
}
