
'use client';

import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getFunctions, type Functions } from 'firebase/functions';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;
let functions: Functions | undefined;
let storage: FirebaseStorage | undefined;

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

function getFirebaseApp(): FirebaseApp {
    if (typeof window === 'undefined') {
        throw new Error('FirebaseApp can only be accessed on the client-side.');
    }
    if (app) return app;

    const apps = getApps();
    if (apps.length > 0) {
        app = apps[0];
        return app;
    }
    
    if (!firebaseConfig.apiKey || firebaseConfig.apiKey.includes("Your_Key_Here")) {
        throw new Error('Firebase API key is not configured. Please check your .env.local file.');
    }
    
    try {
        app = initializeApp(firebaseConfig);
        return app;
    } catch (error) {
        console.error("Firebase initialization error:", error);
        throw error;
    }
}


function getFirebaseAuth(): Auth {
    const firebaseApp = getFirebaseApp();
    if (auth) return auth;
    auth = getAuth(firebaseApp);
    return auth;
}

function getDb(): Firestore {
    const firebaseApp = getFirebaseApp();
    if (db) return db;
    db = getFirestore(firebaseApp);
    return db;
}

function getFirebaseFunctions(): Functions {
    const firebaseApp = getFirebaseApp();
    if (functions) return functions;
    functions = getFunctions(firebaseApp);
    return functions;
}

function getFirebaseStorage(): FirebaseStorage {
    const firebaseApp = getFirebaseApp();
    if (storage) return storage;
    storage = getStorage(firebaseApp);
    return storage;
}

export { 
    getFirebaseApp, 
    getFirebaseAuth, 
    getDb, 
    getFirebaseFunctions,
    getFirebaseStorage
};
