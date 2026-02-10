import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getDatabase, Database } from 'firebase/database';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "mock-key",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "mock-domain",
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || "mock-url",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "mock-project",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "mock-bucket",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "mock-sender",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "mock-app-id"
};

let app: FirebaseApp;
let auth: Auth;
let db: Database;
let firestore: Firestore;

if (typeof window !== 'undefined') {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getDatabase(app);
    firestore = getFirestore(app);
} else {
    // Mock for server-side rendering/build
    app = {} as FirebaseApp;
    auth = {} as Auth;
    db = {} as Database;
    firestore = {} as Firestore;
}

export { auth, db, firestore };
