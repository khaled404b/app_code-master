import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCpVIMWrQvfNs29jORNrELp7HtN5lFe5RM",
  authDomain: "frameapp-ce456.firebaseapp.com",
  databaseURL: "https://frameapp-ce456-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "frameapp-ce456",
  storageBucket: "frameapp-ce456.appspot.com",
  messagingSenderId: "98784998076",
  appId: "1:98784998076:web:d112459eb1b8cce64116b9",
  measurementId: "G-LYZ7F0LKQZ"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getDatabase(app);
export const storage = getStorage(app);
