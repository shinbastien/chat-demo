//search YouTube video
import React, { useState, useRef, useMemo, useEffect } from "react";
import useInput from "../../lib/functions/useInput";
import SearchResult from "./SearchResult";
import axios from "axios";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import {useSocket} from "../../lib/socket"

const KeyWordWrapper = styled.div`
	display: block;
	font-size: 2vw;
	&: active {
		color: blue;
	}
`;

const Search = (props) => {
	const termInput = useInput("");
	const [submit, setSubmit] = useState(false);
	const [videos, setVideos] = useState([]);
	const [keyword, setKeyword] = useState();
	const inputRef = useRef();
	const {socket, connected} = useSocket();

	// console.log(props);

	const filterWords = props.value.filter(
		(prop) => prop.name.includes("주차장") === false,
	);

	console.log(props);

	useMemo(() => filterWords, [props.value]);

	const onClickFocus = (event) => {
		event.preventDefault();
		inputRef.current.value = event.target.innerText;
		setKeyword(event.target.innerText);
		inputRef.current.focus();
		setSubmit(true);

		if (props.share ==="host") {
			if (socket&&connected) {
				socket.emit("send keyword individual search", event.target.innerText);
			}
			
		}
	};

	useEffect(() => {
		if (socket && connected) {
			socket.on("receive keyword individual search", async (keyword) => {
				setKeyword(keyword);
				setSubmit(true);
			})
		}

	}, [socket, connected])

	useEffect(() => {
		if(socket && connected) {
			if (props.share ==="host") {
				if (videos.length > 0) {
					socket.emit("send searched videos", videos);
				}
				console.log("host");
			}
			else if (props.share === "receiver") {
				socket.on("receive searched videos", async (videos) => {
					setVideos(videos);
				})
				console.log("receiver");
			}
		}
		console.log("share", props.share);
		console.log("videos", videos);
	}, [props.share, videos, socket, connected])
	async function searchOnYoutube() {
		const API_URL = "https://www.googleapis.com/youtube/v3/search";
		console.log(inputRef.current.value, keyword)
		try {
			const {
				data: { items },
			} = await axios(API_URL, {
				method: "GET",
				params: {
					key: process.env.REACT_APP_YOUTUBE_API_KEY,
					part: "snippet",
					q:
						`-집 맛집 |가볼만한 곳 ` + inputRef.current.value
							? inputRef.current.value
							: keyword,
				},
			});
			if (videos.length > 0) {
				setVideos([]);
			}
			setVideos(items);
			setSubmit(true);
		} catch (err) {
			console.log(err);
		}
	}
	return (
		<div>
			<Grid container spacing={2}>
				<Grid item xs={6} md={4}>
					<Stack direction="row">
						<input
							ref={inputRef}
							placeholder="검색"
							onKeyDown={(evt) => {
								if (evt.code === "Enter") {
									searchOnYoutube();
								}
							}}
							onChange = {(e) => {
								e.preventDefault()
								setKeyword(e.target.value)
							}}
						/>
						<Button variant="contained" onClick={searchOnYoutube}>
							검색
						</Button>
					</Stack>
					추천 키워드
					<KeyWordWrapper>
						{filterWords.length > 0 ? (
							filterWords.map((prop, inx) => (
								<button onClick={onClickFocus}>{prop.name}</button>
							))
						) : (
							<div className="fa-3x">
								<FontAwesomeIcon className="fa-pulse" icon={faSpinner} />
							</div>
						)}
					</KeyWordWrapper>
				</Grid>
				<Grid item xs={6} md={8}>
					<Stack direction={"column"} spacing={2} alignItems={"baseline"}>
						{submit ? `검색 결과: ` + keyword : null}
						{videos.length > 0 ? (
							<SearchResult videos={videos} share = {props.share}></SearchResult>
						) : (
							"결과가 없습니다"
						)}
					</Stack>
				</Grid>
			</Grid>
		</div>
	);
};

export default Search;
