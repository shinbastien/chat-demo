import React, { useState, useEffect } from "react";
import Search from "../Search/Search";
import Keep from "../Keep/Keep";
import Box from "@mui/material/Box";

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

			{active === types[0] ? <Search></Search> : <Keep></Keep>}
		</>
	);
}
