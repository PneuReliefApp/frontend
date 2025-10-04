// frontend/src/services/firebaseConfig.ts
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBP8zixixwSYeYqkO_6TcJ7MNn0VftqQIM",
  authDomain: "project-pneurelief.firebaseapp.com",
  projectId: "project-pneurelief",
  storageBucket: "project-pneurelief.firebasestorage.app",
  messagingSenderId: "149894939350",
  appId: "1:149894939350:web:0f70f0722b65fc1ee0ff77",
  measurementId: "G-13H29TEZM1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };
