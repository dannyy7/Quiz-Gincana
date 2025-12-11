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
  getDocs,
  arrayUnion
} from "firebase/firestore";

// ===============================
// CONFIG FIREBASE
// ===============================
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

// ===============================
// FIREBASE INIT
// ===============================
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// ===============================
// AUTENTICAÇÃO
// ===============================
export const loginAnonimo = () => signInAnonymously(auth);
export const ouvirUsuario = (callback) => onAuthStateChanged(auth, callback);
export const criarConta = (email, senha) => createUserWithEmailAndPassword(auth, email, senha);
export const loginEmail = (email, senha) => signInWithEmailAndPassword(auth, email, senha);
export const logout = () => signOut(auth);

// ===============================
// USUÁRIOS
// ===============================
export const salvarUsuario = async (uid, nomeUsuario) => {
  await setDoc(doc(db, "usuarios", uid), { nomeUsuario }, { merge: true });
};

export const pegarUsuario = async (uid) => {
  const docSnap = await getDoc(doc(db, "usuarios", uid));
  return docSnap.exists() ? docSnap.data().nomeUsuario : null;
};

export const salvarPersonagem = async (uid, personagemURL) => {
  const ref = doc(db, "usuarios", uid);
  await updateDoc(ref, { personagem: personagemURL });
};

export const pegarPersonagem = async (uid) => {
  const snap = await getDoc(doc(db, "usuarios", uid));
  return snap.exists() ? snap.data().personagem : null;
};

// ===============================
// QUIZZES DO USUÁRIO
// ===============================
export const criarQuiz = async (uid, titulo) => {
  const ref = collection(db, "usuarios", uid, "quizzes");
  const docRef = await addDoc(ref, { titulo, criadoEm: new Date(), perguntas: [] });
  return docRef.id;
};

export const adicionarPergunta = async (uid, quizID, novaPergunta) => {
  const ref = doc(db, "usuarios", uid, "quizzes", quizID);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;

  const perguntasAtualizadas = [...(snap.data().perguntas || []), novaPergunta];
  await updateDoc(ref, { perguntas: perguntasAtualizadas });
};

export const pegarQuizzesUsuario = async (uid) => {
  const ref = collection(db, "usuarios", uid, "quizzes");
  const snap = await getDocs(ref);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// ===============================
// QUIZZES PÚBLICOS
// ===============================
export const criarQuizPublico = async (titulo) => {
  const ref = collection(db, "quizzesPublicos");
  const docRef = await addDoc(ref, { titulo, criadoEm: new Date(), perguntas: [] });
  return docRef.id;
};

export const adicionarPerguntaPublica = async (quizID, novaPergunta) => {
  const ref = doc(db, "quizzesPublicos", quizID);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;

  await updateDoc(ref, {
    perguntas: [...(snap.data().perguntas || []), novaPergunta]
  });
};

export const pegarQuizzesPublicos = async () => {
  const ref = collection(db, "quizzesPublicos");
  const snap = await getDocs(ref);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const pegarQuizPublico = async (quizID) => {
  const ref = doc(db, "quizzesPublicos", quizID);
  const snap = await getDoc(ref);
  return snap.exists() ? { id: quizID, ...snap.data() } : null;
};

// ===============================
// SALAS
// ===============================

// Gerar código
export function gerarCodigoSalaAlfa() {
  const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  return Array.from({ length: 5 }, () =>
    letras.charAt(Math.floor(Math.random() * letras.length))
  ).join('');
}

// Criar sala
export async function criarSalaParaQuiz(quizID, hostUID, hostNome) {
  const codigo = gerarCodigoSalaAlfa();
  const personagemHost = await pegarPersonagem(hostUID);

  await setDoc(doc(db, "salas", codigo), {
    codigo,
    quizID,
    host: hostUID,
    jogadores: [
      {
        uid: hostUID,
        nome: hostNome,
        personagem: personagemHost || "/personagens/default.png", // 🔥 NUNCA MAIS FICA NULL
        pontos: 0
      }
    ],
    status: "aguardando",
    criadoEm: Date.now()
  });

  return codigo;
}

// Entrar na sala
export async function entrarNaSala(codigo, uid, nome) {
  const ref = doc(db, "salas", codigo);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error("Sala não encontrada");

  const personagem = await pegarPersonagem(uid);

  const sala = snap.data();
  const existe = sala.jogadores.some(j => j.uid === uid);

  if (!existe) {
    await updateDoc(ref, {
      jogadores: arrayUnion({
        uid,
        nome,
        personagem: personagem || "/personagens/default.png", // 🔥 GARANTIDO
        pontos: 0
      })
    });
  }

  return codigo;
}
