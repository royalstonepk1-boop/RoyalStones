import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDFtfVyvfq0sJRuiETkiaK2BsPugOmUfQE",
  authDomain: "royalstonespk.firebaseapp.com",
  projectId: "royalstonespk",
  storageBucket: "royalstonespk.firebasestorage.app",
  messagingSenderId: "1051477025670",
  appId: "1:1051477025670:web:3dd576d8744a4f9b298207",
  measurementId: "G-BN57BHQ1Z2"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
