import React, { useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Rnd } from "react-rnd";
import youtubePlayImg from "../../Styles/source/youtube_play.png";

const VideoWrapper = styled.div`
	width: 100%;
	aspect-ratio: 16 / 9;
	background-color: ${(props) => props.theme.color4};
	padding: 8px 8px 10px 8px;
	margin-bottom: 5%;
	border-top-right-radius: 16px;
	border-top-left-radius: 16px;
	box-shadow: 0 0 5em -1em black;
`;

// const DeleteVideoButton = styled.div`
// 	position: absolute;
// 	top: -12px;
// 	right: -12px;
// 	width: 36px;
// 	height: 36px;
// 	display: flex;
// 	justify-content: center;
// 	align-items: center;
// 	font-size: 16px;
// 	background-color: #dddddd;
// 	border-radius: 50%;
// 	z-index: 4;
// 	svg {
// 		fill: black;
// 	}
// 	&:hover {
// 		cursor: pointer;
// 	}
// `;

const Cover = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 3;
	display: block;
`;

const YoutubeLogo = styled.img`
	height: 12px;
`;

const VideoCard = ({ info }) => {
	const { id } = Object.values(info)[0];

	return (
		id.videoId && (
			<VideoWrapper>
				<iframe
					title="youtubeTrailer"
					width="100%"
					height="100%"
					src={`https://www.youtube.com/embed/${id.videoId}`}
					frameBorder="0"
					allow="accelerometer; autoplay;"
					allowFullScreen
				/>
				<Cover />
				<YoutubeLogo src={youtubePlayImg} alt="youtubePlay" />
			</VideoWrapper>
		)
	);
};
export default React.memo(VideoCard);

VideoCard.propTypes = {
	video: PropTypes.object.isRequired,
};
