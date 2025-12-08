import { initializeApp } from 'firebase/app';
// @ts-ignore
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Placeholder config - User must replace these!
const firebaseConfig = {
    apiKey: "AIzaSyBwnW42TTG4Ibv7G2z8v0fEivK_iHiKwSE",
    authDomain: "be333ag.firebaseapp.com",
    projectId: "be333ag",
    storageBucket: "be333ag.firebasestorage.app",
    messagingSenderId: "952773376122",
    appId: "1:952773376122:web:eec4813ea9c9ee5e7a23c3",
    measurementId: "G-2RSMKC21N0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage persistence
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
});

// Initialize Firestore
const db = getFirestore(app);

export { auth, db };
