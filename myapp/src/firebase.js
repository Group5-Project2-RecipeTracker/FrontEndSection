import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAH_7vplv9H8QxlOhk7lLZqABo-dNzP8kk",
  authDomain: "meal-tracker-9af9d.firebaseapp.com",
  projectId: "meal-tracker-9af9d",
  storageBucket: "meal-tracker-9af9d.firebasestorage.app",
  messagingSenderId: "26164934242",
  appId: "1:26164934242:web:11fc9c1a70fca583ba033b",
  measurementId: "G-9LH4Z2SHJS"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();