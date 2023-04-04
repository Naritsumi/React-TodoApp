// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCuUZUtIxbLAtHh8Q-Gcz0XY_iH2gm8gTs",
  authDomain: "todo-list-c3589.firebaseapp.com",
  databaseURL: "https://todo-list-c3589-default-rtdb.firebaseio.com",
  projectId: "todo-list-c3589",
  storageBucket: "todo-list-c3589.appspot.com",
  messagingSenderId: "134203510904",
  appId: "1:134203510904:web:96cf437e121a7bd9a05d8d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);
export const auth = getAuth();