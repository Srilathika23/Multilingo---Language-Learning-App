import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCnYQxKQwMERgUMfn59E3-8vgOoJZROzcY",
  authDomain: "multilingo-c1029.firebaseapp.com",
  databaseURL: "https://multilingo-c1029-default-rtdb.firebaseio.com",
  projectId: "multilingo-c1029",
  storageBucket: "multilingo-c1029.firebasestorage.app",
  messagingSenderId: "342636898103",
  appId: "1:342636898103:web:be736acedd871a42c05cb2",
  measurementId: "G-E0PFWHJG1G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const firestore = getFirestore(app);

// Initialize Analytics in production only
// Use a safe access for Vite's import.meta.env typing to avoid TypeScript errors
if ((import.meta as any)?.env?.PROD) {
  try {
    getAnalytics(app);
  } catch (err) {
    // Analytics may not be available in all environments (SSR, non-browser). Ignore failures.
    // eslint-disable-next-line no-console
    console.warn('Failed to initialize Analytics:', err);
  }
}
