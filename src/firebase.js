import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyArKVfkEisJRgbuO4DMH2hroQnMNT2YR-k",
  authDomain: "logistiq-hr.firebaseapp.com",
  projectId: "logistiq-hr",
  storageBucket: "logistiq-hr.firebasestorage.app",
  messagingSenderId: "1007877758737",
  appId: "1:1007877758737:web:b755daae3afa44604cb6b0"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };