// src/Bd/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Configuração que o Firebase te deu
const firebaseConfig = {
  apiKey: "SUA_CHAVE_AQUI",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abc123def456",
};

// Inicializa o app do Firebase
const app = initializeApp(firebaseConfig);

// Inicializa o banco de dados Firestore
export const db = getFirestore(app);
