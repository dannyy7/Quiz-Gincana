import { useEffect, useState } from 'react';
import './estiloglobal.css';
import styles from './PaginaPrincipal.module.css';
import { useNavigate } from 'react-router-dom';
import { ouvirUsuario, db, logout } from "../firebase/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { criarQuiz, pegarQuizzesUsuario } from "../firebase/bd";

function PaginaPrincipal() {
  const [botao, setBotao] = useState('/pagina_principal/pgprincipaljogar1.png');
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [quizzes, setQuizzes] = useState([]);

  const personagens = [
    '/personagens/p1.png',
    '/personagens/p2.png',
    '/personagens/p3.png',
    '/personagens/p4.png',
    '/personagens/p5.png',
    '/personagens/p6.png'
  ];

  const [posicao, setPosicao] = useState(0);
  const personagem = personagens[posicao];

  async function salvarFotoPerfil(url) {
    if (!user || !user.uid) return;
    try {
      const ref = doc(db, "usuarios", user.uid);
      await updateDoc(ref, { fotoPerfil: url });
    } catch (err) {
      console.error("Erro ao salvar foto de perfil:", err);
    }
  }

  function direita() {
    const novaPosicao = (posicao + 1) % personagens.length;
    setPosicao(novaPosicao);
    salvarFotoPerfil(personagens[novaPosicao]);
  }

  function esquerda() {
    const novaPosicao = (posicao - 1 + personagens.length) % personagens.length;
    setPosicao(novaPosicao);
    salvarFotoPerfil(personagens[novaPosicao]);
  }

  useEffect(() => {
    const stop = ouvirUsuario(async (u) => {
      if (u) {
        const nomeInicial = u.isAnonymous ? "Convidado" : u.displayName || "Carregando...";
        setUser({ ...u, nomeUsuario: nomeInicial });

        try {
          const docRef = doc(db, "usuarios", u.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const dados = docSnap.data();

            setUser(prev => ({
              ...prev,
              nomeUsuario: dados.nomeUsuario || nomeInicial,
              fotoPerfil: dados.fotoPerfil || personagens[0]
            }));

            if (dados.fotoPerfil) {
              const index = personagens.indexOf(dados.fotoPerfil);
              if (index !== -1) setPosicao(index);
            }
          }

          const quizzesDoUsuario = await pegarQuizzesUsuario(u.uid);
          setQuizzes(quizzesDoUsuario);
        } catch (err) {
          console.error("Erro ao buscar dados do usuário:", err);
        }
      } else {
        setUser(null);
        setQuizzes([]);
      }
    });

    return () => stop();
  }, []);

  async function CriarQuiz() {
    if (!user) return;

    if (user.isAnonymous) {
      navigate("/Login");
    } else {
      try {
        const novoQuizID = await criarQuiz(user.uid, "Novo Quiz");
        const quizzesDoUsuario = await pegarQuizzesUsuario(user.uid);
        setQuizzes(quizzesDoUsuario);
        navigate(`/CriarQuiz/${novoQuizID}`);
      } catch (err) {
        console.error("Erro ao criar quiz:", err);
      }
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.fundo2}></div>

      {user && !user.isAnonymous && (
      <button
        className={styles.sair}
        onClick={async () => {
          try {
            await logout();
            setUser(null);
            setQuizzes([]);
          } catch (err) {
            console.error("Erro ao deslogar:", err);
          }
        }}
      >
        <img src="/pagina_principal/logout.png" alt="Sair" />
      </button>
    )}


      <img src='/pagina_principal/pgprincipalmoldura.png' className={styles.moldura} />

      <button className={styles.setadireita} onClick={direita}>
        <img src='/pagina_principal/pgprincipalsetadireita.png' alt="seta direita" />
      </button>

      <button className={styles.setaesquerda} onClick={esquerda}>
        <img src='/pagina_principal/pgprincipalsetaesquerda.png' alt="seta esquerda" />
      </button>

      <div className={styles.nomebox}>
        <p className={styles.nome}>{user ? user.nomeUsuario : "Convidado"}</p>
      </div>

      <img className={styles.fotoperfil} src={personagem} alt="personagem" />

      <p className={styles.paragrafo}>digite o código da sala:</p>

      <div className={styles.wrapper}>
        <img src="/pagina_principal/input.png" alt="input" className={styles.inputImage} />
        <input type="number" className={styles.realInput} />
      </div>

      <button
        onMouseEnter={() => setBotao('/pagina_principal/pgprincipaljogar2.png')}
        onMouseLeave={() => setBotao('/pagina_principal/pgprincipaljogar1.png')}
        className={styles.jogar}
      >
        <img src={botao} alt="botão jogar" />
      </button>

      <button onClick={() => navigate("/Login")}>
        <img src='/pagina_principal/pgprincipallogar.png' className={styles.logar} alt="botão logar" />
      </button>

      <h1 className={styles.titulo}>meus quizes</h1>

      <div className={styles.listabox}>
        <div>
          <ul>
            <button className={styles.adicionarquiz} onClick={CriarQuiz}>+</button>

            {quizzes.map((quiz) => (
              <div key={quiz.id} className={styles.quizItem}>
                <li
                  className={styles.quiz}
                  onClick={() => navigate(`/CriarQuiz/${quiz.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  {quiz.titulo}
                </li>
              </div>
            ))}
          </ul>
        </div>
      </div>

      {user?.isAnonymous && (
        <img src='/pagina_principal/loginmensagem.png' className={styles.mensagem} alt="mensagem de login" />
      )}
    </div>
  );
}

export default PaginaPrincipal;
