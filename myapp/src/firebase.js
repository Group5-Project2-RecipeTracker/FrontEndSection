// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAH_7vplv9H8QxlOhk7lLZqABo-dNzP8kk",
  authDomain: "meal-tracker-9af9d.firebaseapp.com",
  projectId: "meal-tracker-9af9d",
  storageBucket: "meal-tracker-9af9d.firebasestorage.app",
  messagingSenderId: "26164934242",
  appId: "1:26164934242:web:2e8dc2bc1c18139dba033b",
  measurementId: "G-023DNE297M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);