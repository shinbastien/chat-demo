import { internal_resolveProps } from "@mui/utils";
import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import "./EmojiReaction.css";

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
`;

const BouncyDiv = styled.div`
	animation: ${bounceAnimation} 2s;
	animation-delay: 1s;
	animation-fill-mode: both;
`;

const EmojiReaction = (props) => {
	const { state, emoji, userName } = props;

	return (
		state && (
			<EmojiDisplayWrapper>
				<BouncyDiv className="emoji-username">
					<div className="part-emoji">{emoji}</div>
					<div className="part-username">{userName}</div>
				</BouncyDiv>
			</EmojiDisplayWrapper>
		)
	);
};

export default EmojiReaction;
