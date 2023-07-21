import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore"


const firebaseConfig = {
    apiKey: "AIzaSyBy3D4871TkdsXeTUXS2-5FRSthKFvdZN0",
    authDomain: "react-notes-56b27.firebaseapp.com",
    projectId: "react-notes-56b27",
    storageBucket: "react-notes-56b27.appspot.com",
    messagingSenderId: "940765218454",
    appId: "1:940765218454:web:f2b131f9416a72ffb5e4b7"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const notesCollection = collection(db, "notes")