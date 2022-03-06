import React from "react";
import VideoCardBoard from "./VideoCardBoard";

const VideoBoardWrapper = (props) => {
	const { receiveShare, recvideoLoc, searching, pixelPath } = props;

	console.log(recvideoLoc);

	return (
		<>
			<VideoCardBoard
				receiveShare={receiveShare}
				recvideoLoc={recvideoLoc}
				searching={searching}
				pixelPath={pixelPath ? pixelPath[0] : null}
				name={"카페"}
			></VideoCardBoard>
			<VideoCardBoard
				receiveShare={receiveShare}
				recvideoLoc={recvideoLoc}
				searching={searching}
				pixelPath={pixelPath ? pixelPath[1] : null}
				name={"음식점"}
			></VideoCardBoard>
		</>
	);
};

export default VideoBoardWrapper;
