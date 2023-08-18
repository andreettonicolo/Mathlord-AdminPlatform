// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD2l3VoJn79Oq7eJsHqlqOhiY0qY6gY_BU",
  authDomain: "mathlord-db1.firebaseapp.com",
  databaseURL: "https://mathlord-db1-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "mathlord-db1",
  storageBucket: "mathlord-db1.appspot.com",
  messagingSenderId: "435808282640",
  appId: "1:435808282640:web:cc7b6f04e3635df65d8295",
  measurementId: "G-PD18LE3ZWZ"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);