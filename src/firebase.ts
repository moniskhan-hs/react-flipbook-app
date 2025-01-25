// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

// ---------------------------------- Flipbook ------------------------------


const firebaseFlipBook = {
  apiKey: import.meta.env.VITE_FLIPBOOK_API_KEY,
  authDomain:import.meta.env.VITE_FLIPBOOK_AUTH_DOMAIN ,
  projectId: import.meta.env.VITE_FLIPBOOK_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FLIPBOOK_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FLIPBOOK_MESSAGEING,
  appId: import.meta.env.VITE_FLIPBOOK_APP_ID
};




//--------------------------------- MHD - Storage--------------------------------------------------

const fireBaseMHD = {
    apiKey: import.meta.env.VITE_MHD_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_MHD_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_MHD_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_MHD_FIREBASE_STORAGE_BUCK,
    messagingSenderId:import.meta.env.VITE_MHD_FIREBASE_MSG_SEND_ID,
    appId: import.meta.env.VITE_MHD_FIREBASE_APP_ID,
    databaseURL:import.meta.env.VITE_MHD_FIREBASE_DATABASE_URL,
    measurementId: import.meta.env.VITE_MHD_FIREBASE_MEASUR_ID
  };




  // Initialize Firebase apps
const appStorage = initializeApp(fireBaseMHD, "storageApp"); // using the storage from MHD - Clocking


const appFirestore = initializeApp(firebaseFlipBook, "firestoreApp"); // initilized the firestore cloud for flipbook- app

// Services
const storage = getStorage(appStorage);
const db = getFirestore(appFirestore);

export { db, storage };
