import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// TODO: Ganti konfigurasi di bawah ini dengan firebaseConfig milik Anda.
// PASTIKAN menambahkan property databaseURL jika tidak ada.
const firebaseConfig = {
  apiKey: "AIzaSyA_JPNcdQvyvXX6QIjo9u-Zuz-YGLiBxMI",
  authDomain: "apps-edukatif-huruf-dan-angka.firebaseapp.com",
  databaseURL: "https://apps-edukatif-huruf-dan-angka-default-rtdb.firebaseio.com",
  projectId: "apps-edukatif-huruf-dan-angka",
  storageBucket: "apps-edukatif-huruf-dan-angka.firebasestorage.app",
  messagingSenderId: "274757314513",
  appId: "1:274757314513:web:60d950302a403cba6622f0",
  measurementId: "G-6Z87R7Y14L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
