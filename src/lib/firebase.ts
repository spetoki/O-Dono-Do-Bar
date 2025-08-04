// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  projectId: "adegga-cb479",
  appId: "1:235447536219:web:658ec72e01bf70d10c8d7e",
  storageBucket: "adegga-cb479.firebasestorage.app",
  apiKey: "AIzaSyCCw1xG4XvfXea1cfILShTABurIdpw4n2o",
  authDomain: "adegga-cb479.firebaseapp.com",
  messagingSenderId: "235447536219",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
