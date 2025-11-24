// src/firebase/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { 
  getAuth, 
  signInAnonymously, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "firebase/auth";

// SUA CONFIGURAÇÃO DO FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyDfXsJMze3HhSonFk8YCStcK4CSkGRtcoY",
  authDomain: "quizgincana.firebaseapp.com",
  databaseURL: "https://quizgincana-default-rtdb.firebaseio.com",
  projectId: "quizgincana",
  storageBucket: "quizgincana.firebasestorage.app",
  messagingSenderId: "431469902883",
  appId: "1:431469902883:web:48142716797b31a06c8596",
  measurementId: "G-V815ND8F9K"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Exporta Firestore e Auth
export const db = getFirestore(app);
export const auth = getAuth(app);

// Função de login anônimo
export const loginAnonimo = () => signInAnonymously(auth);

// Função para ouvir mudanças no estado do usuário
export const ouvirUsuario = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Função para criar usuário com email e senha
export const criarConta = (email, senha) => {
  return createUserWithEmailAndPassword(auth, email, senha);
};

// Função para login com email e senha
export const loginEmail = (email, senha) => {
  return signInWithEmailAndPassword(auth, email, senha);
};

// Função para salvar nome de usuário no Firestore
export const salvarUsuario = async (uid, nomeUsuario) => {
  await setDoc(doc(db, "usuarios", uid), {
    nomeUsuario
  });
};

// Função para pegar nome de usuário do Firestore
export const pegarUsuario = async (uid) => {
  const docRef = doc(db, "usuarios", uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data().nomeUsuario;
  } else {
    return null;
  }
};
