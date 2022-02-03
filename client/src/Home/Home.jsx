import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";

import "./Home.css";

// function InsertInfo() {
//     const {id} = useParams();
//     const
// }

function Home() {
	const [inputs, setInputs] = useState({
		roomname: "",
		username: "",
	});

	const { roomname, username } = inputs;
	const onChange = (e) => {
		const { value, name } = e.target;
		setInputs({
			...inputs,
			[name]: value,
		});
	};

	return (
		<div className="home-container">
			<input
				type="text"
				name="roomname"
				placeholder="Room"
				value={roomname}
				onChange={onChange}
				className="text-input-field"
			/>
			<input
				type="text"
				name="username"
				placeholder="Name"
				value={username}
				onChange={onChange}
				className="text-input-field"
			/>
			<Link
				to={`/${roomname}/map`}
				state={{
					groupID: roomname,
					userName: username,
				}}
				className="enter-room-button"
			>
				Join room
			</Link>
		</div>
	);
}

export default Home;
