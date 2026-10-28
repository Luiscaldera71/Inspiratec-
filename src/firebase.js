import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Por defecto, usa variables de entorno de Vite
// En producción, estas deben configurarse en .env o en el panel de hosting
const env = (typeof import.meta !== 'undefined' && import.meta.env) 
  ? import.meta.env 
  : (typeof process !== 'undefined' && process.env) 
    ? process.env 
    : {};

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || "dummy_api_key",
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || "inspiratec.firebaseapp.com",
  projectId: env.VITE_FIREBASE_PROJECT_ID || "inspiratec-demo",
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || "inspiratec.appspot.com",
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1234567890",
  appId: env.VITE_FIREBASE_APP_ID || "1:1234567890:web:abcdef"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
