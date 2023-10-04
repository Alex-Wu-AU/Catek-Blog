import { initializeApp } from "firebase/app";
import { serverTimestamp } from "firebase/firestore";
// import { serverTimestamp } from "firebase/firestore";
// import firebase from "firebase/app";
// import "firebase/firestore";

//Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyC5_p9wL-kvDCBTYHmDirniJUne8Kj5mz0",
  authDomain: "personalblogvue3.firebaseapp.com",
  projectId: "personalblogvue3",
  storageBucket: "personalblogvue3.appspot.com",
  messagingSenderId: "79595712237",
  appId: "1:79595712237:web:17861e31cdc40a53d2e6e4",
};

const firebaseApp = initializeApp(firebaseConfig);
const timestamp = serverTimestamp();
export { timestamp };
export default firebaseApp;
