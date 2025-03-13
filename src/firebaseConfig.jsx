// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDrsJ-mDWWpLUkKccHEpAI_9bUeVmFom9g",
  authDomain: "megamovies-e485e.firebaseapp.com",
  projectId: "megamovies-e485e",
  storageBucket: "megamovies-e485e.firebasestorage.app",
  messagingSenderId: "526404456696",
  appId: "1:526404456696:web:c371e5d65021350a666b0d",
  measurementId: "G-1M3C2XQ36J"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword , sendPasswordResetEmail};
