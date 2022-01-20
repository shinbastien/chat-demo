import React, { useState, useEffect, useRef, useCallback } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
	width: 1000px;
	height: 500px;
`;

const MenuWrapper = styled.div``;

export default function Mapwindow(params) {
	const [lat, setLat] = useState(0);
	const [log, setLog] = useState(0);
	const [keep, setKeep] = useState(false);

	const [keepPlace, setKeepPlace] = useState([
		{
			id: 1,
			place: "place 1",
			coords: {
				lat: 36.368258636020634,
				lng: 127.36385086076758,
			},
		},
		{
			id: 2,
			place: "place 2",
			coords: {
				lat: 36.3737905724698,
				lng: 127.36720858751144,
			},
		},
	]);

	const mapPlace = useRef();
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
			kakao.maps.event.addListener(map, `click`, (mouseEvent) => {
				const latlng = mouseEvent.latLng;
				const keepMarker = new kakao.maps.Marker({
					position: latlng,
				});
				console.log(latlng);
				keepMarker.setMap(map);
				keepMarker.setPosition(latlng);
				// const message =
				// 	`클릭한 위치의 경도는` +
				// 	latlng.getLat() +
				// 	`클릭한 위치의 위도는 ` +
				// 	latlng.getLng();
				// console.log(message);
			});
		}
	}, [lat, log]);

	//load destination
	const onLoadDestination = () => {};

	//loadkeep
	const onLoadKeep = () => {
		if (keep === false) {
			keepPlace.forEach((element) => {
				const mark_ = new kakao.maps.LatLng(
					element.coords.lat,
					element.coords.lng,
				);
				const newMarker = new kakao.maps.Marker({
					map: map,
					position: mark_,
				});
				newMarker.setPosition(mark_);
			});
			console.log("I am loading");

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
					<button onClick={onClickEvent}>지도 불러오기</button>
					<button onClick={onLoadKeep}>Load Keep</button>
					<button onClick={onLoadDestination}>Destination</button>
				</MenuWrapper>
			</div>
		</div>
	);
}
