import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInAnonymously, 
  onAuthStateChanged, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut 
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  addDoc, 
  updateDoc, 
  getDocs 
} from "firebase/firestore";

// Configuração do Firebase
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

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// ================================
// AUTENTICAÇÃO
// ================================
export const loginAnonimo = () => signInAnonymously(auth);
export const ouvirUsuario = (callback) => onAuthStateChanged(auth, callback);
export const criarConta = (email, senha) => createUserWithEmailAndPassword(auth, email, senha);
export const loginEmail = (email, senha) => signInWithEmailAndPassword(auth, email, senha);
export const logout = () => signOut(auth);

// ================================
// USUÁRIOS
// ================================
export const salvarUsuario = async (uid, nomeUsuario) => {
  await setDoc(doc(db, "usuarios", uid), { nomeUsuario });
};

export const pegarUsuario = async (uid) => {
  const docSnap = await getDoc(doc(db, "usuarios", uid));
  return docSnap.exists() ? docSnap.data().nomeUsuario : null;
};

export const salvarPersonagem = async (uid, personagemURL) => {
  const userRef = doc(db, "usuarios", uid);
  await updateDoc(userRef, { personagem: personagemURL });
};

// ================================
// QUIZZES DO USUÁRIO
// ================================
export const criarQuiz = async (uid, titulo) => {
  const quizzesRef = collection(db, "usuarios", uid, "quizzes");
  const docRef = await addDoc(quizzesRef, { titulo, criadoEm: new Date(), perguntas: [] });
  return docRef.id;
};

export const adicionarPergunta = async (uid, quizID, novaPergunta) => {
  const quizRef = doc(db, "usuarios", uid, "quizzes", quizID);
  const quizSnap = await getDoc(quizRef);
  if (!quizSnap.exists()) { 
    console.error("Quiz não encontrado"); 
    return; 
  }

  // Garantir peso padrão
  const perguntaComPeso = { peso: 1, ...novaPergunta };

  const perguntasAtualizadas = [...(quizSnap.data().perguntas || []), perguntaComPeso];
  await updateDoc(quizRef, { perguntas: perguntasAtualizadas });
};

export const atualizarPergunta = async (uid, quizID, perguntaID, atualizacao) => {
  const quizRef = doc(db, "usuarios", uid, "quizzes", quizID);
  const quizSnap = await getDoc(quizRef);
  if (!quizSnap.exists()) { console.error("Quiz não encontrado"); return; }

  const quizData = quizSnap.data();
  const perguntasAtualizadas = quizData.perguntas.map(p => 
    p.id === perguntaID ? { ...p, ...atualizacao } : p
  );

  await updateDoc(quizRef, { perguntas: perguntasAtualizadas });
};

export const pegarQuizzesUsuario = async (uid) => {
  const quizzesRef = collection(db, "usuarios", uid, "quizzes");
  const snapshot = await getDocs(quizzesRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// ================================
// QUIZZES PÚBLICOS
// ================================
export const criarQuizPublico = async (titulo) => {
  const ref = collection(db, "quizzesPublicos");
  const docRef = await addDoc(ref, { titulo, criadoEm: new Date(), perguntas: [] });
  return docRef.id;
};

export const adicionarPerguntaPublica = async (quizID, novaPergunta) => {
  const quizRef = doc(db, "quizzesPublicos", quizID);
  const quizSnap = await getDoc(quizRef);
  if (!quizSnap.exists()) { console.error("Quiz público não encontrado"); return; }

  const perguntasAtualizadas = [...(quizSnap.data().perguntas || []), novaPergunta];
  await updateDoc(quizRef, { perguntas: perguntasAtualizadas });
};

export const pegarQuizzesPublicos = async () => {
  const quizzesRef = collection(db, "quizzesPublicos");
  const snapshot = await getDocs(quizzesRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const pegarQuizPublico = async (quizID) => {
  const quizRef = doc(db, "quizzesPublicos", quizID);
  const quizSnap = await getDoc(quizRef);
  return quizSnap.exists() ? { id: quizID, ...quizSnap.data() } : null;
};
