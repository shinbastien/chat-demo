import React, { useState, useEffect } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import Mapwindow from "../Mapwindow/Mapwindow";
import Main from "../Main/Main";
import Grid from "@mui/material/Grid";
import AppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";
import logo from "../Styles/source/logo.png";

import styled from "styled-components";

const ImgWrapper = styled.img`
	display: block;
	width: 10%;
`;

function Map() {
	return (
		<>
			<AppBar postiion="static">
				<Typography
					variant="h6"
					noWrap
					component="div"
					sx={{ mr: 2, display: { xs: "none", md: "flex" } }}
				>
					<ImgWrapper src={logo}></ImgWrapper>
				</Typography>
			</AppBar>
			<Grid container spacing={2} style={{ marginTop: 60 }}>
				<Grid item xs={6} md={8}>
					<Mapwindow></Mapwindow>
				</Grid>
				<Grid item xs={6} md={4}>
					<Main></Main>
				</Grid>
			</Grid>
		</>
	);
}

export default Map;
