import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/functions";
import "firebase/storage";
import 'firebase/analytics';

const firebaseConfig = {
	apiKey: "AIzaSyBoOofxiy-1Qf7bdnQutRGd4RF203mzASA",
	authDomain: "onepage-9981b.firebaseapp.com",
	projectId: "onepage-9981b",
	storageBucket: "onepage-9981b.appspot.com",
	messagingSenderId: "455499687509",
	appId: "1:455499687509:web:f8a7cff1288910636956dc",
	measurementId: "G-7WRQKNC9CW"
  };

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const db = firebase.firestore();
export const functions = firebase.functions();
export const storage = firebase.storage();
export const fb = firebase;
export const FirebaseTimestamp = firebase.firestore.Timestamp;

