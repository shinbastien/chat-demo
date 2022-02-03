//search YouTube video
import React, { useState, useEffect } from "react";
import useInput from "../functions/useInput";
import axios from "axios";
import { readFromFirebase } from "../functions/firebase";

const Keep = () => {
	const [keep, setKeep] = useState(false);
	const [keeplist, setKeeplist] = useState([]);
	const [keepPlace, setKeepPlace] = useState([]);

	useEffect(async () => {
		const photos = await readFromFirebase("photos");
		await setKeepPlace([...keepPlace, photos]);
		await photos.forEach((photo) => {
			setKeepPlace([...keepPlace, photo.data()]);
			console.log(keepPlace);
		});
	}, []);

	return (
		<div>
			{keepPlace.length > 0
				? keepPlace.map((list, index) => <div key={index}>{list.title}</div>)
				: null}
		</div>
	);
};

export default Keep;
