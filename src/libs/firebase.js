import { initializeApp, getApps } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// Firebase configuration
// Note: Use NEXT_PUBLIC_ prefix for client-side environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "mock-key-for-build",
  authDomain: "luyari-55dcd.firebaseapp.com",
  projectId: "luyari-55dcd",
  storageBucket: "luyari-55dcd.appspot.com",
  messagingSenderId: "69869400567",
  appId: "1:69869400567:web:9253a25411578776d97ef2"
};

// Initialize Firebase only once (prevent duplicate app initialization)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const storage = getStorage(app);
const auth = getAuth(app);

export { storage, auth };
