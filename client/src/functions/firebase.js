// Import the functions you need from the SDKs you need
import * as firebase from "firebase/app";
import { initializeApp } from "firebase/app";
import "firebase/auth";
import { getFirestore, addDoc, getDocs, collection } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

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
	const firebaseApp = initializeApp(firebaseConfig);
}

async function readFromFirebase(element) {
	firebaseInstance();
	const db = getFirestore();
	try {
		const docRef = await getDocs(collection(db, element));
		docRef.forEach((element) => {
			console.log(element);
		});
	} catch (error) {
		console.log(error);
	}
}

export { readFromFirebase };

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
