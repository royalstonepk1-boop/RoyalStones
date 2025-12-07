import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyB6zKzm56AxjOo_5QHq-4YfoX4tTZxVFWo",
    authDomain: "royalstones-ab4f1.firebaseapp.com",
    projectId: "royalstones-ab4f1",
    storageBucket: "royalstones-ab4f1.firebasestorage.app",
    messagingSenderId: "531876340256",
    appId: "1:531876340256:web:789b15ce70512922c21245",
    measurementId: "G-BBZ3VS6YGW"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
