import React, { useState, useEffect } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import NewMapwindow from "../Mapwindow/NewMapwindow";
import Main from "../Main/Main";
import Grid from "@mui/material/Grid";
import AppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";
import logoWhite from "../Styles/source/logo_w.png";

import styled from "styled-components";

const ImgWrapper = styled.img`
	display: block;
	width: 10%;
`;

function Map() {

	const location = useLocation();
	const {groupID, userName}= location.state;
	return (
		<>
			<AppBar postiion="static" style={{ backgroundColor: "#151ca2" }}>
				<Typography
					variant="h6"
					noWrap
					component="div"
					sx={{ mr: 2, display: { xs: "none", md: "flex" } }}
				>
					<ImgWrapper src={logoWhite}></ImgWrapper>
				</Typography>
			</AppBar>
			<Grid container spacing={2} style={{ marginTop: 60 }}>
				<Grid item xs={6} md={8}>
					<NewMapwindow></NewMapwindow>
				</Grid>
				<Grid item xs={6} md={4}>
					<Main groupID = {groupID} userName={userName} userLocation={""}></Main>
				</Grid>
			</Grid>
		</>
	);
}

export default Map;
