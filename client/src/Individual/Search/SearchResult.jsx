import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import styled from "styled-components";
import ShareVideo from "../../Mapwindow/ShareVideo/ShareVideo";

const VideoWrapper = styled.div`
	aspect-ratio: 16 / 9;
	width: 100%;
`;

const SearchResult = (props) => {
	const { videos } = props;
	const [share, setShare] = useState({});
	const [sharing, setSharing] = useState(false);

	const onClickShare = (element) => {
		const { etag, id, snippet } = element;
		setShare((share) => ({ [id.videoId]: true }));
		setSharing(true);
	};

	return (
		<>
			<Grid container spacing={2}>
				{sharing && (
					<VideoWrapper>
						<ShareVideo
							url={Object.keys(share)[0]}
							stateChanger={setSharing}
						></ShareVideo>
					</VideoWrapper>
				)}

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
						<button onClick={() => onClickShare(video)}>
							{share && Object.keys(share)[0] === video.id.videoId
								? "공유 중지"
								: "공유하기"}
						</button>
					</Grid>
				))}
			</Grid>
		</>
	);
};

export default React.memo(SearchResult);
