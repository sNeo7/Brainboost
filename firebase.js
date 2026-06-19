import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
const firebaseConfig = {
  apiKey: "AIzaSyBOK2kQv1IThyAbQ_Ym8y1pDHsXmvdkNXs",
  authDomain: "brainboost-5c838.firebaseapp.com",
  projectId: "brainboost-5c838",
  storageBucket: "brainboost-5c838.firebasestorage.app",
  messagingSenderId: "643262204761",
  appId: "1:643262204761:web:7e4e9d6d1c6d971ffc5a48",
  measurementId: "G-ZWRBB1Q827"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

window.db = db;
window.addDoc = addDoc;
window.collection = collection;
window.getDocs = getDocs;
export { db, collection, addDoc, getDocs };
