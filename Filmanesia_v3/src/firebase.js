import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Firebase is optional for browsing locally. Keep the app renderable when
// credentials have not been configured yet; authentication actions will be
// unavailable until the real values are added to .env.
const hasFirebaseConfig = Object.values(firebaseConfig).some(Boolean);
const localFirebaseConfig = hasFirebaseConfig ? firebaseConfig : {
  apiKey: 'local-development-only',
  authDomain: 'local-development.firebaseapp.com',
  projectId: 'local-development',
  storageBucket: 'local-development.appspot.com',
  messagingSenderId: '000000000000',
  appId: '1:000000000000:web:localdevelopment'
};

// Initialize Firebase
const app = initializeApp(localFirebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
