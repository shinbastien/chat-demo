import React, { useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Rnd } from "react-rnd";

const VideoWrapper = styled.div`
	width: 100%;
	height: 100%;
	background-color: white;
	padding: 12px;
	border-top-right-radius: 16px;
	border-top-left-radius: 16px;
	box-shadow: 0 0 5em -1em black;
`;

const YoutubeBorder = styled.div`
	width: 100%;
	height: 100%;
	overflow: hidden;
	border-radius: 16px;
`;

const DeleteVideoButton = styled.div`
	position: absolute;
	top: -12px;
	right: -12px;
	width: 36px;
	height: 36px;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 16px;
	background-color: #dddddd;
	border-radius: 50%;
	z-index: 4;
	svg {
		fill: black;
	}
	&:hover {
		cursor: pointer;
	}
`;

const Cover = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 3;
`;

const Tags = styled.div`
	width: 100%;
	display: flex;
	flex-wrap: wrap;
	gap: 8px;
	margin-bottom: 24px;
	padding: 4px 16px 16px 16px;
	border-bottom-right-radius: 16px;
	border-bottom-left-radius: 16px;
	background-color: ${(props) => (props.tagDragging ? "#86e3ce" : "white")};
	transition: background-color 0.2s ease-in;
`;

const Tag = styled.div`
	position: relative;
	height: 24px;
	display: flex;
	justify-content: center;
	align-items: center;
	background: linear-gradient(135deg, #86e3ce, #d0e6a5);
	color: white;
	font-size: 16px;
	gap: 16px;
	padding: 0px 12px;
	border-radius: 4px;
	&:hover {
		cursor: pointer;
	}
`;

const YoutubeLogo = styled.img`
	height: 24px;
`;

const DeleteTagButton = styled.div`
	position: absolute;
	top: -8px;
	right: -8px;
	width: 24px;
	height: 24px;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 16px;
	background-color: #dddddd;
	border-radius: 50%;
	svg {
		fill: black;
	}
`;

const VideoCard = (props) => {
	// const { url, width, height } = props.info;
	const [loading, setLoading] = useState(true);
	const { url, width, height } = Object.values(props.info)[0];
	const [info, setInfo] = useState({
		x: window.innerWidth / 6 + Math.floor(Math.random() * 70) * 8,
		y: window.innerHeight / 6 + Math.floor(Math.random() * 70) * 8,
		width: 320,
		height: 180,
	});
	const [hover, setHover] = useState(false);

	return (
		loading && (
			<Rnd
				style={{ zIndex: 9 }}
				default={info}
				lockAspectRatio={16 / 9}
				enableResizing={{
					top: false,
					right: false,
					bottom: false,
					left: false,
					topRight: false,
					bottomRight: true,
					bottomLeft: false,
					topLeft: false,
				}}
			>
				<VideoWrapper
					onMouseEnter={() => setHover(true)}
					onMouseLeave={() => setHover(false)}
				>
					{/* <iframe
				title="youtubeTrailer"
				width="100%"
				height="100%"
				src={`https://www.youtube.com/embed/${id}`}
				frameBorder="0"
				allow="accelerometer; autoplay;"
				allowFullScreen
			/> */}
					<Cover />
					<img
						src={process.env.PUBLIC_URL + url}
						width="100%"
						height="100%"
					></img>
					{hover && (
						<DeleteVideoButton onClick={() => setLoading(false)}>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="8"
								height="8"
								viewBox="0 0 24 24"
							>
								<path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z" />
							</svg>
						</DeleteVideoButton>
					)}
				</VideoWrapper>
			</Rnd>
		)
	);
};
export default React.memo(VideoCard);

VideoCard.propTypes = {
	video: PropTypes.object.isRequired,
};
