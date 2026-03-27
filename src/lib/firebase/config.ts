// src/lib/firebase/config.ts - Browser-safe Client Firebase with Emulator support
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'demo-key-oversite',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'overscite-global.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'overscite-global',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'overscite-global.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '000000000000',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:000000000000:web:0000000000000000000000',
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

// Connect to emulators if in development or if explicitly requested
if (process.env.NODE_ENV === 'development' || typeof window !== 'undefined') {
  // We check for localhost to avoid accidental connection to production if env is dev
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
     // Optional: check if already connected to avoid errors on hot reload
     try {
       connectFirestoreEmulator(db, 'localhost', 8080);
       connectAuthEmulator(auth, 'http://localhost:9099');
       console.log('[FIREBASE] Connected to Emulators');
     } catch (e) {
       // Ignore "already connected" errors
     }
  }
}

export { app, db, auth };
