// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_APIKEY_FIREBASE,
  authDomain: "smart-thrive.firebaseapp.com",
  projectId: "smart-thrive",
  storageBucket: "smart-thrive.appspot.com",
  messagingSenderId: "685033282389",
  appId: "1:685033282389:web:38011af2522bafed3b6ddc",
  measurementId: "G-00ME6LE1RE",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
export { storage };
