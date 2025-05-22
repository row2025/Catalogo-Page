// js/firebase.js
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import {
  getFirestore,
  collection,
  getDocs,
  setDoc,
  doc,
  getDoc
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAFn1Xyv27JKi-ww1kYaN2VOH1F2npfs5c",
  authDomain: "rowpage-4d661.firebaseapp.com",
  projectId: "rowpage-4d661",
  storageBucket: "rowpage-4d661.appspot.com",
  messagingSenderId: "955144915343",
  appId: "1:955144915343:web:8d87b84d4c770e4a7ee3fa",
  measurementId: "G-WZQPX0XHD9"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Exportamos todo lo necesario
export { db, collection, getDocs, setDoc, doc, getDoc };
