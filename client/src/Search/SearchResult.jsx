import React from "react";

export function SearchResult(props) {
	const { videos } = props;
	return (
		<div>
			{videos.map((video, idx) => (
				<div key={video.id.videoId}>
					<iframe
						title="youtubeTrailer"
						width="100%"
						height="100%"
						src={`https://www.youtube.com/embed/${video.id.videoId}`}
						frameBorder="0"
						allow="accelerometer; autoplay;"
					/>
					{/* <img
						src={video.snippet.thumbnails.medium.url}
						width={video.snippet.thumbnails.medium.width}
						height={video.snippet.thumbnails.medium.height}
					></img> */}
				</div>
			))}
		</div>
	);
}
