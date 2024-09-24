import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBkHXEzhvyiIdOVKmMJt5Gq8CelEsk1yw0",
    authDomain: "to-do-list-f3801.firebaseapp.com",
    projectId: "to-do-list-f3801",
    storageBucket: "to-do-list-f3801.appspot.com",
    messagingSenderId: "757897403775",
    appId: "1:757897403775:web:bdd509cdd1fec92d91ce4a",
    databaseURL:"https://to-do-list-f3801-default-rtdb.firebaseio.com/"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
