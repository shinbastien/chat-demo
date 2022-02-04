//search YouTube video
import React, { useState, useEffect } from "react";
import useInput from "../functions/useInput";
import axios from "axios";
import { readFromFirebase } from "../functions/firebase";
import KeepCard from "./KeepCard";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";

const Keep = () => {
	const [keep, setKeep] = useState(false);
	const [keeplist, setKeeplist] = useState([]);
	const [keepPlace, setKeepPlace] = useState([]);

	useEffect(async () => {
		const photos = await readFromFirebase("photos");
		setKeepPlace(photos);
	}, []);

	return (
		<div>
			<Typography variant="h3" component="span">
				Keep
			</Typography>
			<Grid item container>
				<Typography variant="h5" component="span">
					오늘 방문한 장소
				</Typography>
				<Typography variant="h5" component="span">
					과거 방문할 장소
				</Typography>
				{keepPlace.length > 0
					? keepPlace.map((list, index) => (
							<KeepCard key={index} place={list.title}></KeepCard>
					  ))
					: null}
			</Grid>
		</div>
	);
};

export default Keep;
