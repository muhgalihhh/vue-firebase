// src/utils/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyCjueg7LfljKg9Zrvr0b4hN7KtgUKvPp80',
  authDomain: 'vue-firebase-f6f1a.firebaseapp.com',
  projectId: 'vue-firebase-f6f1a',
  storageBucket: 'vue-firebase-f6f1a.firebasestorage.app',
  messagingSenderId: '490957249666',
  appId: '1:490957249666:web:be5929de3752d7f9ee289b',
  measurementId: 'G-T8K9N2527R',
};

const firebase = initializeApp(firebaseConfig);
const auth = getAuth(firebase);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
