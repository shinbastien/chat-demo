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
   opacity: 0;
   display: none;
  }
`;

const EmojiDisplayWrapper = styled.div`
	bottom: 0;
	left: 50%;
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

		font-size: 2vw;
		margin-top: -20%;
	}
`;

const EmojiReaction = (props) => {
	const { state, emoji, userName } = props;

	return (
		state && (
			<EmojiDisplayWrapper>
				<div>{emoji}</div>
				<div>{userName}</div>
			</EmojiDisplayWrapper>
		)
	);
};

export default EmojiReaction;
