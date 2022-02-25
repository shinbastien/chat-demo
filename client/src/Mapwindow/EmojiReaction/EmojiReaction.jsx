import { internal_resolveProps } from "@mui/utils";
import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";

const bounceAnimation = keyframes`
  0% {
    transform: translateY(0);
    animation-timing-function: ease-out;
  }
  50% {
    transform: translateY(-300px);
  }
   100% {
	transform: translateY(-300px);
   opacity: 0;
   display: none;
  }
`;

const EmojiDisplayWrapper = styled.div`
	bottom: 0;
	font-size: 5vw;
	position: absolute;
	z-index: 300;

	> div {
		animation: ${bounceAnimation} 2s;
		animation-delay: 1s;
		animation-fill-mode: both;

		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		> div {
			padding: 0.4vw;
			font-size: 1.8vw;
			color: white;
			background-color: ${(props) => (props.color ? props.color : "#FF4E6C")};
			border-radius: 4px;
			margin-top: -20%;
		}
	}
`;

const EmojiReaction = (props) => {
	const { state, emoji, userName } = props;

	return (
		state && (
			<EmojiDisplayWrapper style={{ left: 50 + Math.random() * 10 + "%" }}>
				<div>
					{emoji}
					<div>{userName}</div>
				</div>
			</EmojiDisplayWrapper>
		)
	);
};

export default EmojiReaction;
