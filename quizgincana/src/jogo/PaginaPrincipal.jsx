import { useEffect, useState } from 'react';
import './estiloglobal.css';
import styles from './PaginaPrincipal.module.css';
import { useNavigate } from 'react-router-dom';
import { ouvirUsuario, db } from "../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { criarQuiz, pegarQuizzesUsuario } from "../firebase/bd";

function PaginaPrincipal() {
  const [botao, setBotao] = useState('/pagina_principal/pgprincipaljogar1.png');
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    const stop = ouvirUsuario(async (u) => {
      if (u) {
        const nomeInicial = u.isAnonymous ? "Convidado" : u.displayName || "Carregando...";
        setUser({ ...u, nomeUsuario: nomeInicial });

        if (!u.isAnonymous) {
          try {
            const docRef = doc(db, "usuarios", u.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              const nomeFirestore = docSnap.data().nomeUsuario;
              setUser(prev => ({ ...prev, nomeUsuario: nomeFirestore }));
            }

            const quizzesDoUsuario = await pegarQuizzesUsuario(u.uid);
            setQuizzes(quizzesDoUsuario);
          } catch (err) {
            console.error("Erro ao buscar dados do usuário:", err);
          }
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
      <img src='/pagina_principal/pgprincipalmoldura.png' className={styles.moldura} />

      <button className={styles.setadireita}>
        <img src='/pagina_principal/pgprincipalsetadireita.png' />
      </button>

      <button className={styles.setaesquerda}>
        <img src='/pagina_principal/pgprincipalsetaesquerda.png' />
      </button>

      <div className={styles.nomebox}>
        <p className={styles.nome}>
          {user ? user.nomeUsuario : "Carregando..."}
        </p>
      </div>

      <p className={styles.paragrafo}>digite o código da sala:</p>

      <div className={styles.wrapper}>
        <img src="/pagina_principal/input.png" alt="img" className={styles.inputImage} />
        <input type="number" className={styles.realInput} />
      </div>

      <button
        onMouseEnter={() => setBotao('/pagina_principal/pgprincipaljogar2.png')}
        onMouseLeave={() => setBotao('/pagina_principal/pgprincipaljogar1.png')}
        className={styles.jogar}
      >
        <img src={botao} />
      </button>

      <button onClick={() => navigate("/SignUp")}>
        <img src='/pagina_principal/pgprincipallogar.png' className={styles.logar} />
      </button>

      <h1 className={styles.titulo}>meus quizes</h1>

      <div className={styles.listabox}>
        <div>
          <ul>
            <button className={styles.adicionarquiz} onClick={CriarQuiz}>+</button>
            {quizzes.map((quiz) => (
              <li
                key={quiz.id}
                className={styles.quiz}
                onClick={() => navigate(`/CriarQuiz/${quiz.id}`)}
                style={{ cursor: 'pointer' }}
              >
                {quiz.titulo}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <img src='/pagina_principal/loginmensagem.png' className={styles.mensagem} />
    </div>
  );
}

export default PaginaPrincipal;
