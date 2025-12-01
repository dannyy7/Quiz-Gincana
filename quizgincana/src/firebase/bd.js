import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, updateDoc, getDocs, arrayUnion } from "firebase/firestore";

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

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

export const loginAnonimo = () => signInAnonymously(auth);
export const ouvirUsuario = (callback) => onAuthStateChanged(auth, callback);
export const criarConta = (email, senha) => createUserWithEmailAndPassword(auth, email, senha);
export const loginEmail = (email, senha) => signInWithEmailAndPassword(auth, email, senha);
export const salvarUsuario = async (uid, nomeUsuario) => await setDoc(doc(db, "usuarios", uid), { nomeUsuario });
export const pegarUsuario = async (uid) => { const docSnap = await getDoc(doc(db, "usuarios", uid)); return docSnap.exists() ? docSnap.data().nomeUsuario : null; };

// QUIZZES
export const criarQuiz = async (uid, titulo) => {
  const quizzesRef = collection(db, "usuarios", uid, "quizzes");
  const docRef = await addDoc(quizzesRef, { titulo, criadoEm: new Date(), perguntas: [] });
  return docRef.id;
};

export const adicionarPergunta = async (uid, quizID, novaPergunta) => {
  const quizRef = doc(db, "usuarios", uid, "quizzes", quizID);
  const quizSnap = await getDoc(quizRef);
  if (!quizSnap.exists()) { console.error("Quiz não encontrado"); return; }
  const perguntasAtualizadas = [...(quizSnap.data().perguntas || []), novaPergunta];
  await updateDoc(quizRef, { perguntas: perguntasAtualizadas });
};

export const pegarQuizzesUsuario = async (uid) => {
  const quizzesRef = collection(db, "usuarios", uid, "quizzes");
  const snapshot = await getDocs(quizzesRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
