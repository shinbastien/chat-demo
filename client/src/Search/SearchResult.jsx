import React from "react";
import Grid from "@mui/material/Grid";
import styled from "styled-components";

const VideoWrapper = styled.div`
	aspect-ratio: 16 / 9;
	width: 100%;
`;

export function SearchResult(props) {
	const { videos } = props;
	return (
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
					</VideoWrapper>
				</Grid>
			))}
		</Grid>
	);
}
