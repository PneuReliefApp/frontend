// frontend/src/services/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBP8zixixwSYeYqkO_6TcJ7MNn0VftqQIM",
  authDomain: "project-pneurelief.firebaseapp.com",
  projectId: "project-pneurelief",
  storageBucket: "project-pneurelief.firebasestorage.app",
  messagingSenderId: "149894939350",
  appId: "1:149894939350:web:6f70f0722b65fc1ee0ff77",
  measurementId: "G-13H29TEZM1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Analytics is optional (only works on web)
isSupported().then((yes) => {
  if (yes) getAnalytics(app);
});

export default app;

