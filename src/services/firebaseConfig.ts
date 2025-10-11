// frontend/src/services/firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';
import {
  AUTH_FIREBASE_API_KEY,
  AUTH_FIREBASE_AUTH_DOMAIN,
  AUTH_FIREBASE_PROJECT_ID,
  AUTH_FIREBASE_STORAGE_BUCKET,
  AUTH_FIREBASE_MESSAGING_SENDER_ID,
  AUTH_FIREBASE_APP_ID,
  AUTH_FIREBASE_MEASUREMENT_ID,}
 from "../config"

const firebaseConfig = {
  apiKey: AUTH_FIREBASE_API_KEY,
  authDomain: AUTH_FIREBASE_AUTH_DOMAIN,
  projectId: AUTH_FIREBASE_PROJECT_ID,
  storageBucket:AUTH_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: AUTH_FIREBASE_MESSAGING_SENDER_ID,
  appId: AUTH_FIREBASE_APP_ID,
  measurementId: AUTH_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Optional: Analytics (only works in web)
isSupported().then((supported) => {
  if (supported) getAnalytics(app);
});

export default app;




