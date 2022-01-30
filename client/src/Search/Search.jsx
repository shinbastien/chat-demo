//search YouTube video
import React, { useState, useEffect } from "react";
import useInput from "../functions/useInput";
import { SearchResult } from "./SearchResult";
import axios from "axios";

const Search = () => {
	const termInput = useInput("");
	const [submit, setSubmit] = useState(false);
	const [videos, setVideos] = useState([]);
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
			<input
				value={termInput.value}
				onChange={termInput.onChange}
				placeholder="친구와 가고 싶은 곳을 검색해보세요"
				onKeyDown={(evt) => {
					if (evt.code === "Enter") {
						searchOnYoutube();
					}
				}}
			></input>
			<button onClick={searchOnYoutube}>검색</button>
			{submit ? `검색 결과: ` + termInput.value : null}
			{videos.length > 0 ? (
				<SearchResult videos={videos}></SearchResult>
			) : (
				"결과가 없습니다"
			)}
		</div>
	);
};

export default Search;
