//search YouTube video
import React, { useState, useEffect } from "react";
// import useInput from "../Hook/useInput";
import axios from "axios";

const Search = () => {
	// const termInput = useInput("");
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
					q: `맛집 | 가볼만한 곳 | 핫플레이스`,
				},
			});
			setVideos(items);
		} catch (err) {
			console.log(err);
		}
	}
	return (
		<div>
			{/* <input
				value={termInput.value}
				onChange={termInput.onChange}
				placeholder="친구와 가고 싶은 곳을 검색해보세요"
				onKeyDown={(evt) => {
					if (evt.code === "Enter") {
						searchOnYoutube();
					}
				}}
			></input>
			<button onClick={searchOnYoutube}>검색</button> */}
			<iframe
				width="420"
				height="315"
				src="https://www.youtube.com/embed"
				frameborder="0"
				allowfullscreen
			></iframe>
		</div>
	);
};

export default Search;
