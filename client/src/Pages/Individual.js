import React, { useState, useEffect } from "react";
import Search from "../Search/Search";
import Keep from "../Keep/Keep";
import Navbar from "../Navbar/Navbar";

export default function Individual() {
	const types = ["Search", "Keep"];
	const [active, setActive] = useState(types[0]);

	return (
		<>
			{types.map((type, i) => (
				<button key={i} onClick={() => setActive(type)}>
					{type}
				</button>
			))}
			<button>공유하기</button>
			{active === types[0] ? <Search></Search> : <Keep></Keep>}
		</>
	);
}
