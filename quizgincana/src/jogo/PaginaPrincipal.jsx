import { useEffect, useState } from 'react';
import './estiloglobal.css';
import styles from './PaginaPrincipal.module.css';
import { useNavigate } from 'react-router-dom';
import { ouvirUsuario, db } from "../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

function PaginaPrincipal() {
  const [botao, setBotao] = useState('/pagina_principal/pgprincipaljogar1.png');
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stop = ouvirUsuario(async (u) => {
      if (u) {
        // Mostra o nome do displayName imediatamente
        const nomeInicial = u.isAnonymous ? "Convidado" : u.displayName || "Carregando...";
        setUser({ ...u, nomeUsuario: nomeInicial });

        // Busca o nome de usuário no Firestore (caso queira atualizar com o oficial do banco)
        if (!u.isAnonymous) {
          try {
            const docRef = doc(db, "usuarios", u.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              const nomeFirestore = docSnap.data().nomeUsuario;
              setUser(prev => ({ ...prev, nomeUsuario: nomeFirestore }));
            }
          } catch (err) {
            console.error("Erro ao buscar nome de usuário:", err);
          }
        }
      } else {
        setUser(null);
      }
    });

    return () => stop();
  }, []);

  function CriarQuiz() {
    if (user?.isAnonymous) {
      navigate("/Login");  
    } else {
      navigate("/CriarQuiz");
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

      {/* Nome do usuário */}
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
            <li className={styles.quiz}></li>
          </ul>
        </div>
      </div>

      <img src='/pagina_principal/loginmensagem.png' className={styles.mensagem} />
    </div>
  );
}

export default PaginaPrincipal;
