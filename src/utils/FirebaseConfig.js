import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCLvbMvu0m2uFdeSiiSrm3KpN7ilY0Yz20",
  authDomain: "whatsapp-clone-d350c.firebaseapp.com",
  projectId: "whatsapp-clone-d350c",
  storageBucket: "whatsapp-clone-d350c.appspot.com",
  messagingSenderId: "994719257154",
  appId: "1:994719257154:web:f26193c9126a44bb7e13db",
};

const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app);
