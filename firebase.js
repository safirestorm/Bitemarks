// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDGebKcd8rIisJVRJklFbmqhOEfgtjMAbY",
  authDomain: "bitemarks-db69f.firebaseapp.com",
  projectId: "bitemarks-db69f",
  storageBucket: "bitemarks-db69f.firebasestorage.app",
  messagingSenderId: "511477378791",
  appId: "1:511477378791:web:117f7c25635d113c8abc42",
  measurementId: "G-QKZRS9MHYH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getFirestore(app)
export { app, database };