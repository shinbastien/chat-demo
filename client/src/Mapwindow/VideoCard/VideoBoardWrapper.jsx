import React from "react";
import VideoCardBoard from "./VideoCardBoard";

const VideoBoardWrapper = (props) => {
	const { receiveShare, recvideoLoc, searching, pixelPath } = props;

	return (
		<>
			<VideoCardBoard
				receiveShare={receiveShare}
				recvideoLoc={recvideoLoc}
				searching={searching}
				pixelPath={pixelPath[0]}
				name={"카페"}
			></VideoCardBoard>
			<VideoCardBoard
				receiveShare={receiveShare}
				recvideoLoc={recvideoLoc}
				searching={searching}
				pixelPath={pixelPath[1]}
				name={"음식점"}
			></VideoCardBoard>
		</>
	);
};

export default VideoBoardWrapper;
