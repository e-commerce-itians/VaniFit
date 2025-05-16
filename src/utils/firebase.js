// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD_pjSCQvA2Z3fdVMa0rzfoDXaCZPWdOHc",
  authDomain: "prototype-9fedd.firebaseapp.com",
  databaseURL: "https://prototype-9fedd-default-rtdb.firebaseio.com",
  projectId: "prototype-9fedd",
  storageBucket: "prototype-9fedd.firebasestorage.app",
  messagingSenderId: "552484998383",
  appId: "1:552484998383:web:3c75dff9b02a77d59c9f1a",
  measurementId: "G-12WFLZQ7PY",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const firebaseAnalytics = getAnalytics(firebaseApp);

export { firebaseApp, firebaseAnalytics };
