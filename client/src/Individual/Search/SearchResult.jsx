import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import styled from "styled-components";

const VideoWrapper = styled.div`
	aspect-ratio: 16 / 9;
	width: 100%;

	> div {
		display: flex;
		justify-content: flex-end;

		> button {
			display: flex;
			&:active {
				color: #151ca2;
			}
			&.active {
				color: #151ca2;
			}
		}
	}
`;

export const SearchImgResult = ({ imgs }) => {
	return (
		<>
			<Grid container spacing={2}>
				{imgs.map((img, idx) => (
					<Grid item xs={6}>
						<VideoWrapper>
							<img
								key={idx}
								src={process.env.PUBLIC_URL + img.url}
								width="100%"
							></img>
							<div>
								<button>공유하기</button>
							</div>
						</VideoWrapper>
					</Grid>
				))}
			</Grid>
		</>
	);
};

const SearchResult = ({ share, setShare, setSharing, videos }) => {
	function onClickShare(element) {
		const { etag, id, snippet } = element;
		setShare((share) => ({ [id.videoId]: true }));
		setSharing(true);
	}

	return (
		<>
			<Grid container spacing={2}>
				{videos.map((video) => (
					<Grid item xs={6} key={video.id.videoId}>
						<VideoWrapper>
							<iframe
								title="youtubeTrailer"
								width="100%"
								height="100%"
								src={`https://www.youtube.com/embed/${video.id.videoId}`}
								frameBorder="0"
								allow="accelerometer; autoplay;"
							/>
							<div>
								<button
									className={
										share &&
										Object.keys(share)[0] === video.id.videoId &&
										"active"
									}
									onClick={() => onClickShare(video)}
								>
									{share && Object.keys(share)[0] === video.id.videoId
										? "공유 중지"
										: "공유하기"}
								</button>
							</div>
						</VideoWrapper>
					</Grid>
				))}
			</Grid>
		</>
	);
};

export default React.memo(SearchResult);
