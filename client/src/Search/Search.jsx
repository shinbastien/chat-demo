//search YouTube video
import React, { useState, useEffect } from "react";
import useInput from "../functions/useInput";
import { SearchResult } from "./SearchResult";
import axios from "axios";
import { Item } from "../Styles/themeSytles";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";

const Search = () => {
	const termInput = useInput("");
	const [submit, setSubmit] = useState(false);
	const [videos, setVideos] = useState([]);
	const [share, setShare] = useState(false);
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
					q: `맛집 | 가볼만한 곳 | 핫플레이스 ` + termInput.value,
				},
			});
			setVideos(items);
			setSubmit(!submit);
		} catch (err) {
			console.log(err);
		}
	}
	return (
		<div>
			<Grid container spacing={2}>
				<Grid item xs={6} md={4}>
					<Stack direction="row">
						<Item
							value={termInput.value}
							onChange={termInput.onChange}
							placeholder="검색"
							onKeyDown={(evt) => {
								if (evt.code === "Enter") {
									searchOnYoutube();
								}
							}}
						></Item>
						<Button variant="contained" onClick={searchOnYoutube}>
							검색
						</Button>
					</Stack>
				</Grid>
				<Grid item xs={6} md={8}>
					<Stack direction={"column"} spacing={2} alignItems={"baseline"}>
						<Button onClick={() => setShare(!share)}>
							{share ? "공유 중지" : "공유하기"}
						</Button>
						{submit ? `검색 결과: ` + termInput.value : null}
						{videos.length > 0 ? (
							<SearchResult videos={videos}></SearchResult>
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
