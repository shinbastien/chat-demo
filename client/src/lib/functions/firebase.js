// Import the functions you need from the SDKs you need
// import * as firebase from "firebase/app";
import { initializeApp } from "firebase/app";
import "firebase/auth";
import { getFirestore, getDocs, collection } from "firebase/firestore";
import { getDatabase, ref, set } from "firebase/database";
import data from "../../data";

import axios from "axios";

function firebaseInstance() {
	const firebaseConfig = {
		apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
		authDomain: "hmgproject-bb41b.firebaseapp.com",
		databaseURL:
			"https://hmgproject-bb41b-default-rtdb.asia-southeast1.firebasedatabase.app",
		projectId: "hmgproject-bb41b",
		storageBucket: "hmgproject-bb41b.appspot.com",
		messagingSenderId: "83682231706",
		appId: "1:83682231706:web:c6ac86a66ddad04293e623",
		measurementId: "G-F9L1D0QFS8",
	};

	return initializeApp(firebaseConfig);
}

async function writeToPlaceData(element) {
	const { coords, groupId, userId, placeId } = element;
	const app = firebaseInstance();
	console.log(app);
	const db = getDatabase(app);
	try {
		set(ref(db, "keeps/" + placeId), {
			groupId: groupId,
			coords: coords,
			userId: userId,
			placeId: placeId,
			visited: false,
		});
		console.log("uploaded");
	} catch (error) {
		console.log(error);
	}
}

async function readFromFirebase(element) {
	firebaseInstance();
	const db = getFirestore();
	const dataInstance = [];
	try {
		const docRef = await getDocs(collection(db, element));
		docRef.forEach((doc) => {
			dataInstance.push(doc.data());
		});
		return dataInstance;
	} catch (error) {
		console.log(error);
	}
}

var num = 0;

async function searchOnYoutube(props) {
	const API_URL = "https://www.googleapis.com/youtube/v3/search";

	try {
		// const {
		// 	data: { items },
		// } = await axios(API_URL, {
		// 	method: "GET",
		// 	params: {
		// 		key: process.env.REACT_APP_YOUTUBE_API_KEY,
		// 		part: "snippet",
		// 		q: `대전 유성구` + props,
		// 		maxResults: 1,
		// 	},
		// });
		// return items;

		//add dummy data
		const s = data[num];

		num += 1;
		if (num == 5) {
			num = 0;
		}
		return s;
	} catch (err) {
		console.log(err);
		return data;
	}
}

export { readFromFirebase, writeToPlaceData, searchOnYoutube };

// {
// 	groups: {
// 		memebers: INT,
//		name: String
// 	},
//  photos: [
// 	{
// 		id: String,
// 		title: String,
// 		date: Date,
// 		url: String,
//		coords: [
// 			lat: Float,
// 			lng: Float,
//		]

// 	}
// ]
//	Place: [
// 			{
//		title: String,
//		coords: [
// 			lat: Float,
// 			lng: Float,
//			]
// 		}
//  ]

// }

// {
// 		id: 1,
// 		name: "place 1",
// 		coords: {
// 			lat: 36.368258636020634,
// 			lng: 127.36385086076758,
// 		},
// 	},
// 	{
// 		id: 2,
// 		name: "place 2",
// 		coords: {
// 			lat: 36.3737905724698,
// 			lng: 127.36720858751144,
// 		},
// 	},

// 	{
// 		id: 3,
// 		name: "place 3",
// 		coords: {
// 			lat: 37.52852967338524,
// 			lng: 126.96922791179354,
// 		},
// 	},
// 	{
// 		id: 4,
// 		name: "place 4",
// 		coords: {
// 			lat: 37.42812509478836,
// 			lng: 126.99524348235616,
// 		},
// 	},
// 	{
// 		id: 5,
// 		name: "place 5",
// 		coords: {
// 			lat: 37.42887299230859,
// 			lng: 126.99683648886092,
// 		},
// 	},
