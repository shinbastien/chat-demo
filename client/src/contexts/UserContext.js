import React, { useState } from "react";

export const userContext = React.createContext({
	inputs: {
		roomname: "",
		username: "",
	},
	setInputs: () => {},
});
