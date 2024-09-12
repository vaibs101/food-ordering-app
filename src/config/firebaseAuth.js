import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth/web-extension";

const firebaseConfig = JSON.parse(import.meta.env.VITE_KEY);

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth=getAuth(app);

export const provider=new GoogleAuthProvider();

