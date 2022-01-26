import React, { useState, useEffect, useRef, useCallback } from "react";
import styled from "styled-components";
import Peer from "simple-peer";

const Wrapper = styled.div`
	width: 1000px;
	height: 500px;
`;

const MenuWrapper = styled.div``;

const videoImg = () => {};

export default function Mapwindow(params) {
	const [lat, setLat] = useState(0);
	const [log, setLog] = useState(0);

	const [keep, setKeep] = useState(false);
	const [dest, setDest] = useState(true);

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
	]);

	const mapPlace = useRef();
	const infoPlace = useRef();
	const firstUpdate = useRef(true);

	var kakao = window.kakao;
	var map;

	const getMap = useCallback(() => {
		var locPosition = new kakao.maps.LatLng(lat, log);
		var options = {
			center: locPosition,
			level: 3,
		};
		map = new kakao.maps.Map(mapPlace.current, options);

		if (lat !== 0 && log !== 0) {
			const currentMarker = new kakao.maps.Marker({
				position: locPosition,
			});
			currentMarker.setMap(map);

			// kakao.maps.event.addListener(map, `click`, (e) => {
			// 	const latlng = e.latLng;
			// 	const destMarker = new kakao.maps.Marker({
			// 		position: latlng,
			// 	});

			// 	destMarker.setMap(map);

			// 	setDest((dest) => destMarker);
			// 	console.log(dest);
			// });
		}
	}, [lat, log]);

	//load destination
	//TODO: Need to revise

	const onLoadDestination = () => {
		if (dest === true) {
			keepPlace.forEach((element) => {
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
		if (keep === false) {
			keepPlace.forEach((element) => {
				const { lat, lng } = element.coords;
				console.log(element);
				const mark_ = new kakao.maps.LatLng(lat, lng);
				const newMarker = new kakao.maps.Marker({
					map: map,
					position: mark_,
				});
				newMarker.setPosition(mark_);
				setKeeplist((keeplist) => [...keeplist, element.name]);
			});

			setKeep(!keep);
		}
	};

	//loadkeep
	const onLoadKeep = () => {
		if (keep === false) {
			keepPlace.forEach((element) => {
				const { lat, lng } = element.coords;
				console.log(element);
				const mark_ = new kakao.maps.LatLng(lat, lng);
				const newMarker = new kakao.maps.Marker({
					map: map,
					position: mark_,
				});
				newMarker.setPosition(mark_);
				setKeeplist((keeplist) => [...keeplist, element.name]);
			});

			setKeep(!keep);
		}
	};

	useEffect(() => {
		if (firstUpdate.current) {
			firstUpdate.current = false;
			return;
		}
		getMap();
	}, [getMap, mapPlace]);

	//load location
	const getLocation = () => {
		navigator.geolocation.getCurrentPosition(function (position) {
			setLat(position.coords.latitude);
			setLog(position.coords.longitude);
		});
	};

	//load map
	const onClickEvent = (e) => {
		//confirm location
		if ("geolocation" in navigator) {
			console.log("Available");
		} else {
			console.log("Not Available");
		}
		getLocation();
		e.preventDefault();
	};

	return (
		<div>
			<div>
				<Wrapper className="map" ref={mapPlace}></Wrapper>

				<MenuWrapper>
					<button onClick={onClickEvent}>Load Map</button>
					<button onClick={onLoadKeep}>Keep</button>
					<button onClick={onLoadDestination}>목적지</button>
					<button onClick={onLoadSharePicture}>공유 풍경</button>

					<div ref={infoPlace}>
						{keeplist.map((list, index) => (
							<div key={index}>{list}</div>
						))}
					</div>
				</MenuWrapper>
			</div>
		</div>
	);
}
