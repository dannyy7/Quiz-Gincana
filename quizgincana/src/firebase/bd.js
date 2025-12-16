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
  arrayUnion,
  onSnapshot
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
export const criarConta = (email, senha) =>
  createUserWithEmailAndPassword(auth, email, senha);
export const loginEmail = (email, senha) =>
  signInWithEmailAndPassword(auth, email, senha);
export const logout = () => signOut(auth);

// ===============================
// USUÁRIOS
// ===============================
export const salvarUsuario = async (uid, nomeUsuario) => {
  await setDoc(
    doc(db, "usuarios", uid),
    { nomeUsuario },
    { merge: true }
  );
};

export const pegarUsuario = async (uid) => {
  const snap = await getDoc(doc(db, "usuarios", uid));
  return snap.exists() ? snap.data().nomeUsuario : null;
};

export const salvarPersonagem = async (uid, personagemURL) => {
  await updateDoc(doc(db, "usuarios", uid), {
    personagem: personagemURL
  });
};

export const pegarPersonagem = async (uid) => {
  const snap = await getDoc(doc(db, "usuarios", uid));
  return snap.exists() ? snap.data().personagem : null;
};

// ===============================
// QUIZZES DO USUÁRIO (PRIVADOS)
// ===============================
export const criarQuiz = async (uid, titulo) => {
  const ref = collection(db, "usuarios", uid, "quizzes");
  const docRef = await addDoc(ref, {
    titulo,
    criadoEm: new Date(),
    perguntas: []
  });
  return docRef.id;
};

export const adicionarPergunta = async (uid, quizID, novaPergunta) => {
  const ref = doc(db, "usuarios", uid, "quizzes", quizID);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;

  const perguntasAtualizadas = [
    ...(snap.data().perguntas || []),
    novaPergunta
  ];

  await updateDoc(ref, { perguntas: perguntasAtualizadas });
};

export const pegarQuizzesUsuario = async (uid) => {
  const ref = collection(db, "usuarios", uid, "quizzes");
  const snap = await getDocs(ref);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

// ===============================
// QUIZZES PÚBLICOS
// ===============================
export const criarQuizPublico = async (titulo) => {
  const ref = collection(db, "quizzesPublicos");
  const docRef = await addDoc(ref, {
    titulo,
    criadoEm: new Date(),
    perguntas: []
  });
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
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const pegarQuizPublico = async (quizID) => {
  const ref = doc(db, "quizzesPublicos", quizID);
  const snap = await getDoc(ref);
  return snap.exists()
    ? { id: quizID, ...snap.data() }
    : null;
};

// ===============================
// SALAS
// ===============================

// Gerar código da sala
export function gerarCodigoSalaAlfa() {
  const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return Array.from({ length: 5 }, () =>
    letras.charAt(Math.floor(Math.random() * letras.length))
  ).join("");
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
        personagem: personagemHost || "/personagens/default.png",
        pontos: 0,
        pronto: false
      }
    ],
    status: "aguardando",
    perguntaAtual: 1,
    tempoRestante: 30,
    respostas: [],
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
        personagem: personagem || "/personagens/default.png",
        pontos: 0,
        pronto: false
      })
    });
  }

  return codigo;
}

// ===============================
// FUNÇÕES ADICIONAIS PARA SINCRONIZAÇÃO
// ===============================

// Buscar sala por código
export const pegarSalaPorCodigo = async (codigo) => {
  const ref = doc(db, "salas", codigo);
  const snap = await getDoc(ref);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

// Atualizar estado da sala
export const atualizarEstadoSala = async (codigo, dados) => {
  const ref = doc(db, "salas", codigo);
  await updateDoc(ref, dados);
};

// Escutar mudanças na sala
export const escutarSala = (codigo, callback) => {
  const ref = doc(db, "salas", codigo);
  return onSnapshot(ref, (snap) => {
    if (snap.exists()) {
      callback({ id: snap.id, ...snap.data() });
    } else {
      callback(null);
    }
  });
};

// Registrar resposta do jogador
export const registrarResposta = async (codigoSala, dadosResposta) => {
  const ref = doc(db, "salas", codigoSala);
  await updateDoc(ref, {
    respostas: arrayUnion(dadosResposta)
  });
};

// Buscar sala do usuário atual
export const buscarSalaDoUsuario = async (uid) => {
  const ref = collection(db, "salas");
  const snap = await getDocs(ref);
  
  for (const docSnap of snap.docs) {
    const sala = docSnap.data();
    if (sala.jogadores?.some(j => j.uid === uid)) {
      return { id: docSnap.id, ...sala };
    }
  }
  return null;
};

// Buscar todas as salas
export const buscarTodasSalas = async () => {
  const ref = collection(db, "salas");
  const snap = await getDocs(ref);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

// Iniciar quiz na sala
export const iniciarQuizNaSala = async (codigoSala) => {
  const ref = doc(db, "salas", codigoSala);
  await updateDoc(ref, {
    status: "iniciado",
    perguntaAtual: 1,
    tempoRestante: 30
  });
};

// Avançar para próxima pergunta
export const avancarPergunta = async (codigoSala, proximaPergunta) => {
  const ref = doc(db, "salas", codigoSala);
  await updateDoc(ref, {
    perguntaAtual: proximaPergunta,
    tempoRestante: 30,
    respostas: [] // Limpar respostas da pergunta anterior
  });
};