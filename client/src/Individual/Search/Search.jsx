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
import {
	faSpinner,
	faMagnifyingGlassLocation,
	faGlobe,
	faImage,
	faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { faYoutube } from "@fortawesome/free-brands-svg-icons";
import ShareVideo from "../../Mapwindow/ShareVideo/ShareVideo";

import { Divider } from "@mui/material";
import { SearchImgResult } from "./SearchResult";
import { useSocket } from "../../lib/socket";

const InputWrapper = styled.div`
	margin: 0 0 0 0;
	width: 100%;
	border-radius: 12px;
	padding: 0 13px;
	background-color: ${(props) => props.theme.color3};
	height: 3vw;
	display: flex;
	flex-direction: row;
	margin: 0 5% 0 0;

	> input {
		border: none;
		width: inherit;
		background-color: ${(props) => props.theme.color3};
	}
	> button {
		padding: 0;
		margin: 0;
	}
`;

const KeyWordWrapper = styled.div`
	padding: 3%;
	.title {
		font-size: 18px;
		font-weight: 700;

		padding: 3%;
		color: ${(props) => props.theme.color1};
	}

	.searchKeyword {
		display: block;
		padding: 7% 3% 0 1%;
		&: hover {
			color: ${(props) => props.theme.color1};
			font-weight: 700;
		}

		&::before {
			background-color: ${(props) => props.theme.color1};
			display: inline-block;
			width: 4px;
			height: 4px;
			content: "";
			margin: 0 10px;
		}
	}

	.spinner {
		text-align: center;
	}
`;

const ResultWrapper = styled.div`
	padding: 0 5% 5% 5%;
	border-left: solid rgba(0, 0, 0, 0.12);
	border-width: 0 1px;

	margin-block-start: 0.5em;
	margin-block-end: 0.5em;

	.title {
		font-size: 18px;
		font-weight: 700;

		padding: 0 0 3%;
		color: #151ca2;
	}
`;

const Search = (props) => {
	const termInput = useInput("");
	const [submit, setSubmit] = useState(false);
	const [videos, setVideos] = useState({
		locInfo: null,
		videoInfo: null,
	});
	const [keyword, setKeyword] = useState();
	const inputRef = useRef();
	const [sharing, setSharing] = useState(false);
	const [share, setShare] = useState({});
	const [imgs, setImgs] = useState([
		{ url: "/1_img.jpeg" },
		{ url: "/2_img.jpeg" },
		{ url: "/3_img.jpg" },
	]);
	const { socket, connected } = useSocket();

	// console.log(props);

	const filterWords = props.value.filter(
		(prop) => prop.name.includes("주차장") === false,
	);

	useMemo(() => filterWords, [props.value]);
	console.log(keyword);

	const onClickFocus = (event) => {
		event.preventDefault();
		inputRef.current.value = event.target.innerText;
		setKeyword(event.target.innerText);
		inputRef.current.focus();
		setSubmit(false);
		// setSubmit(true);

		if (props.share === "host") {
			if (socket && connected) {
				socket.emit("send keyword individual search", event.target.innerText);
			}
		}
	};

	useEffect(() => {
		if (socket && connected) {
			socket.on("receive keyword individual search", async (keyword) => {
				setKeyword(keyword);
				setSubmit(false);
			});
		}
		return () => {
			socket.off("receive keyword individual search");
		};
	}, [socket, connected]);

	useEffect(() => {
		if (socket && connected) {
			if (props.share === "host") {
				if (videos && Object.keys(videos).length > 0) {
					socket.emit("send searched videos", videos, keyword);
				}

				if (share) {
				}
				console.log("host");
			} else if (props.share === "receiver") {
				socket.on("receive searched videos", async (videos, keyword) => {
					// setVideos(videos);
					setKeyword(keyword);
					if (keyword) {
						searchOnYoutube();
					}
				});
			}
		}
		console.log("share", props.share);
		console.log("videos", videos);
	}, [props.share, videos, socket, connected]);

	useEffect(() => {
		if (socket && connected) {
			if (props.share === "host") {
				if (share) {
					socket.emit("start sharevideo", sharing, share);
					console.log("share is :", share);
				}
			} else if (props.share === "receiver") {
				console.log("sharevideo receiver");
				socket.on("receive sharevideo", async (sharing, item) => {
					console.log("received item");
					setSharing(sharing);
					console.log("receiving sharevideo item is:", item);
					setShare(item);
				});
			}
		}

		return () => {
			socket.off("receive sharevideo");
		};
	}, [props.share, share, sharing, socket, connected]);
	async function searchOnYoutube() {
		const API_URL = "https://www.googleapis.com/youtube/v3/search";
		// console.log(inputRef.current.value, keyword);
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
					videoEmbeddable: "true",
					type: "video",
				},
			});
			// if (videos && Object.keys(videos).length > 0) {
			// 	setVideos(null);
			// }
			console.log(items);
			setVideos({
				locInfo: filterWords.filter((i) => i.name.includes(keyword)),
				videoInfo: items,
			});

			setSubmit(true);
			console.log("videos after searchOnYoutube :", videos);
		} catch (err) {
			console.log(err);
		}
	}

	console.log(videos);

	return (
		<Grid container>
			<Grid item>
				<Stack direction="row">
					<InputWrapper>
						<input
							ref={inputRef}
							placeholder="검색"
							onKeyDown={(evt) => {
								if (evt.code === "Enter") {
									searchOnYoutube();
								}
							}}
							onChange={(e) => {
								e.preventDefault();
								setKeyword(e.target.value);
							}}
						/>
						<button variant="contained" onClick={searchOnYoutube}>
							<FontAwesomeIcon icon={faMagnifyingGlass} />
						</button>
					</InputWrapper>
				</Stack>
				<KeyWordWrapper>
					<div className="title">
						<FontAwesomeIcon icon={faMagnifyingGlassLocation} />
						&nbsp; 추천 키워드
					</div>
					<Divider></Divider>
					{filterWords.length > 0 ? (
						filterWords.map((prop, inx) => (
							<button className="searchKeyword" onClick={onClickFocus}>
								{prop.name}
							</button>
						))
					) : (
						<div className="fa-2x spinner">
							<FontAwesomeIcon className="fa-pulse" icon={faSpinner} />
						</div>
					)}
				</KeyWordWrapper>
			</Grid>

			<Grid item xs={6} md={8} alignItems={"baseline"}>
				<ResultWrapper>
					<div className="title">
						<FontAwesomeIcon icon={faGlobe} />
						{submit ? ` 검색 결과: ` + keyword : null}
					</div>
					{sharing && (
						<ShareVideo
							videoName={Object.keys(share)[0]}
							locInfo={videos.locInfo[0]}
						></ShareVideo>
					)}
					{submit && videos.videoInfo.length > 0 ? (
						<div>
							<FontAwesomeIcon icon={faYoutube} />
							&nbsp; Video
							<SearchResult
								share={share}
								sharing={sharing}
								setShare={setShare}
								setSharing={setSharing}
								videos={videos.videoInfo}
							></SearchResult>
						</div>
					) : (
						<div>" 검색어를 입력하여 주세요"</div>
					)}
					{submit && imgs.length && (
						<div>
							<FontAwesomeIcon icon={faImage} /> &nbsp; Image
							<SearchImgResult imgs={imgs}></SearchImgResult>
						</div>
					)}
				</ResultWrapper>
			</Grid>
		</Grid>
	);
};

export default Search;
