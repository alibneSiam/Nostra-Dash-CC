// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBnDmeJs6ZQ8DyFzEwpFjmJhI6cbuD3pLg",
  authDomain: "nostradash.firebaseapp.com",
  projectId: "nostradash",
  storageBucket: "nostradash.firebasestorage.app",
  messagingSenderId: "851089225030",
  appId: "1:851089225030:web:e886d69d64bca276cfe147"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;