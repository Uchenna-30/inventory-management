// src/firebase.js
// import { initializeApp } from "firebase/app";
// import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
// import { getFirestore, doc, setDoc } from "firebase/firestore";

// // Replace with your Firebase project config
// const firebaseConfig = {
//   apiKey: "your-api-key",
//   authDomain: "your-auth-domain",
//   projectId: "your-project-id",
//   storageBucket: "your-storage-bucket",
//   messagingSenderId: "your-messaging-sender-id",
//   appId: "your-app-id",
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app);
// export const db = getFirestore(app);
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyBP9iAMwmfbQdBozy08NuSYdoyaOFQUPeI",
  authDomain: "inventory-management-e832e.firebaseapp.com",
  projectId: "inventory-management-e832e",
  storageBucket: "inventory-management-e832e.appspot.com",
  messagingSenderId: "183399238982",
  appId: "1:183399238982:web:6a790f592b6f872f422947"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
