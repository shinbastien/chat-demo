import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
	width: 100vw;
	height: 100vw;
`;

const MenuWrapper = styled.div``;

const destination = [
	{
		id: 1,
		name: "KAIST N1",
		coords: [],
	},
];

export default function Mapwindow(params) {
	const [lat, setLat] = useState(0);
	const [log, setLog] = useState(0);
	const mapPlace = useRef();
	const firstUpdate = useRef(true);

	const getMap = () => {
		const kakao = window.kakao;
		console.log(kakao);
		const locPosition = new kakao.maps.LatLng(lat, log);
		const options = {
			center: locPosition,
			level: 3,
		};
		const map = new kakao.maps.Map(mapPlace.current, options);
		if (lat !== 0 && log !== 0) {
			const marker = new kakao.maps.Marker({
				position: locPosition,
			});
			marker.setMap(map);
		}
	};

	useEffect(() => {
		if (firstUpdate.current) {
			firstUpdate.current = false;
			return;
		}
		getMap();
	}, [getMap, mapPlace]);

	const getLocation = () => {
		navigator.geolocation.getCurrentPosition(function (position) {
			setLat(position.coords.latitude);
			setLog(position.coords.longitude);
		});
	};

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
				<MenuWrapper>
					<button>Keep</button>
					<button>공유 풍경</button>
					<button>목적지</button>
				</MenuWrapper>

				<Wrapper className="map" ref={mapPlace}></Wrapper>
				<button onClick={onClickEvent}>지도 불러오기</button>
			</div>
		</div>
	);
}
