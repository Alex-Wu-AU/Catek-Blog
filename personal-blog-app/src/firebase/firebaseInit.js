// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import firebase from "firebase/app";
import "firebase/firestore";

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyC5_p9wL-kvDCBTYHmDirniJUne8Kj5mz0",
  authDomain: "personalblogvue3.firebaseapp.com",
  projectId: "personalblogvue3",
  storageBucket: "personalblogvue3.appspot.com",
  messagingSenderId: "79595712237",
  appId: "1:79595712237:web:17861e31cdc40a53d2e6e4",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const timestamp = firebase.firestore.FieldValue.serverTimestamp;
// Initialize Firebase
export { timestamp };
// const app = initializeApp(firebaseConfig);
export default firebaseApp.firestore();
