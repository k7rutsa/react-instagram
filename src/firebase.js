import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: "react-instagram-29205.firebaseapp.com",
  projectId: "react-instagram-29205",
  storageBucket: "react-instagram-29205.appspot.com",
  messagingSenderId: "1040268836028",
  appId: "1:1040268836028:web:3796431022519087e3e4b9",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
