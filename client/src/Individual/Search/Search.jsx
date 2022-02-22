//search YouTube video
import React, { useState, useRef, useMemo } from "react";
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
} from "@fortawesome/free-solid-svg-icons";
import { faYoutube } from "@fortawesome/free-brands-svg-icons";
import ShareVideo from "../../Mapwindow/ShareVideo/ShareVideo";

import { Divider } from "@mui/material";
import { SearchImgResult } from "./SearchResult";

const KeyWordWrapper = styled.div`
	padding: 3%;
	.title {
		font-size: 18px;
		font-weight: 700;

		padding: 3%;
		color: #151ca2;
	}

	.searchKeyword {
		display: block;
		padding: 7% 3% 0 1%;
		&: hover {
			color: #151ca2;
			font-weight: 700;
		}

		&::before {
			background-color: #151ca2;
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
	};

	async function searchOnYoutube() {
		const API_URL = "https://www.googleapis.com/youtube/v3/search";
		try {
			const {
				data: { items },
			} = await axios(API_URL, {
				method: "GET",
				params: {
					key: process.env.REACT_APP_YOUTUBE_API_KEY,
					part: "snippet",
					q: `${keyword ? keyword : termInput.value}`,
					type: "video",
					videoEmbeddable: "true",
				},
			});
			if (videos.length > 0) {
				setVideos(null);
			}
			setVideos({
				locInfo: filterWords.filter((i) => i.name.includes(keyword)),
				videoInfo: items,
			});

			setSubmit(true);
		} catch (err) {
			console.log(err);
		}
	}

	console.log(videos);

	return (
		<div>
			<Grid container>
				<Grid item>
					<Stack direction="row">
						<input
							ref={inputRef}
							placeholder="검색"
							onKeyDown={(evt) => {
								if (evt.code === "Enter") {
									searchOnYoutube();
								}
							}}
						></input>
						<Button variant="contained" onClick={searchOnYoutube}>
							검색
						</Button>
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

				<Grid
					item
					xs={6}
					md={8}
					direction={"column"}
					spacing={2}
					alignItems={"baseline"}
				>
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
		</div>
	);
};

export default Search;
