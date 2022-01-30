// Import the functions you need from the SDKs you need
import * as firebase from "firebase/app";
import "firebase/auth";
import { getDatabase, ref, child, get } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

export function firebaseInstance(element) {
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

	const db = getDatabase();

	firebaseConfig.initializeApp(firebaseConfig);

	const dbRef = ref(getDatabase());
	get(child(dbRef, `users/${element}`))
		.then((snapshot) => {
			if (snapshot.exists()) {
				console.log(snapshot.val());
			} else {
				console.log("No data available");
			}
		})
		.catch((error) => {
			console.error(error);
		});
}
