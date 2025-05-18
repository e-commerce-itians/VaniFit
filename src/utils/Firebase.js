import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

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

const firebaseApp = initializeApp(firebaseConfig);
const firebaseAnalytics = getAnalytics(firebaseApp);
const firebaseAuth = getAuth(firebaseApp);
const firebasedb = getFirestore(firebaseApp);

export { firebaseApp, firebaseAuth, firebaseAnalytics, firebasedb };
