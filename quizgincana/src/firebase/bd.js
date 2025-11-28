// src/firebase/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { 
  getAuth,
  signInAnonymously,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc 
} from "firebase/firestore";
import { collection, addDoc, updateDoc, getDocs } from "firebase/firestore";

// CONFIGURAÇÃO DO FIREBASE
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

// LOGIN ANÔNIMO
export const loginAnonimo = () => signInAnonymously(auth);

// OUVIR MUDANÇA DO USUÁRIO
export const ouvirUsuario = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// CRIAR CONTA
export const criarConta = (email, senha) => {
  return createUserWithEmailAndPassword(auth, email, senha);
};

// LOGIN EMAIL + SENHA
export const loginEmail = (email, senha) => {
  return signInWithEmailAndPassword(auth, email, senha);
};

// SALVAR USUÁRIO NO FIRESTORE
export const salvarUsuario = async (uid, nomeUsuario) => {
  await setDoc(doc(db, "usuarios", uid), { nomeUsuario });
};

// PEGAR DADOS DO USUÁRIO
export const pegarUsuario = async (uid) => {
  const docRef = doc(db, "usuarios", uid);
  const docSnap = await getDoc(docRef);

  return docSnap.exists() ? docSnap.data().nomeUsuario : null;
};

// Criar um novo quiz para um usuário
export const criarQuiz = async (uid, titulo) => {
  try {
    const quizzesRef = collection(db, "usuarios", uid, "quizzes");
    const docRef = await addDoc(quizzesRef, {
      titulo,
      criadoEm: new Date(),
      perguntas: []
    });
    return docRef.id; // Retorna o ID do quiz criado
  } catch (error) {
    console.error("Erro ao criar quiz:", error);
  }
};

// Adicionar uma pergunta a um quiz existente
export const adicionarPergunta = async (uid, quizID, pergunta) => {
  try {
    const quizRef = doc(db, "usuarios", uid, "quizzes", quizID);

    const quizSnap = await getDoc(quizRef);
    if (!quizSnap.exists()) {
      console.error("Quiz não encontrado");
      return;
    }

    const quizData = quizSnap.data();
    const perguntasAtualizadas = [...quizData.perguntas, pergunta];

    await updateDoc(quizRef, { perguntas: perguntasAtualizadas });
  } catch (error) {
    console.error("Erro ao adicionar pergunta:", error);
  }
};

// Pegar todos os quizzes de um usuário
export const pegarQuizzesUsuario = async (uid) => {
  try {
    const quizzesRef = collection(db, "usuarios", uid, "quizzes");
    const snapshot = await getDocs(quizzesRef);

    const quizzes = [];
    snapshot.forEach(doc => {
      quizzes.push({ id: doc.id, ...doc.data() });
    });

    return quizzes;
  } catch (error) {
    console.error("Erro ao pegar quizzes:", error);
  }
};
