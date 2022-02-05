import React, { useState, useEffect } from "react";
import Search from "../Search/Search";
import Keep from "../Keep/Keep";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";
import logoWhite from "../Styles/source/logo_w.png";
import ShareIcon from "@material-ui/icons/Share";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";

import styled from "styled-components";

const ImgWrapper = styled.img`
	display: block;
	width: 10%;
`;

const TextWrapper = styled.span`
	display: flex;
	justify-content: center; /* align horizontal */
	align-items: center; /* align vertical */
`;

export default function Individual() {
	const types = ["Search", "Keep"];
	const [active, setActive] = useState(types[0]);


	return (
		<>
			<AppBar postiion="static" style={{ backgroundColor: "#151ca2" }}>
				<Typography
					variant="h5"
					noWrap
					component="div"
					sx={{ mr: 2, display: { xs: "none", md: "flex" } }}
				>
					<ImgWrapper src={logoWhite}></ImgWrapper>
					<IconButton style={{ color: "white" }}>
						<ShareIcon></ShareIcon>
					</IconButton>
					<Box sx={{ flexGrow: 1 }}></Box>
					<TextWrapper>개인 화면</TextWrapper>
				</Typography>
			</AppBar>
			<Box sx={{ padding: "2%" }}>
				<Stack direction="row" spacing={2} style={{ marginTop: 60 }}>
					{types.map((type, i) => (
						<Button key={i} onClick={() => setActive(type)}>
							{type}
						</Button>
					))}
				</Stack>
				{active === types[0] ? <Search></Search> : <Keep></Keep>}
			</Box>
		</>
	);
}
