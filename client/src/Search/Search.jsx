//search YouTube video
import React, { useState, useEffect } from "react";
import axios from "axios";

const Search = () => {
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
					q: `//`,
				},
			});
		} catch (err) {
			console.log(err);
		}
	}
	return <div></div>;
};

export default Search;
