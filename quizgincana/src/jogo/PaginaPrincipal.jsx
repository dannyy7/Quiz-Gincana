import { useEffect, useState } from 'react';
import './estiloglobal.css';
import styles from './PaginaPrincipal.module.css';
import { useNavigate } from 'react-router-dom';

// IMPORT CORRETO DO FIREBASE (Caminho ajustado!)
import { ouvirUsuario } from "../firebase/firebaseConfig";

function PaginaPrincipal() {
  const [botao, setBotao] = useState('/pagina_principal/pgprincipaljogar1.png');
  const [personagem, setPersonagem] = useState([
    '/personagens/p1.png',
    '/personagens/p2.png',
    '/personagens/p3.png'
  ]);

  const navigate = useNavigate();

  // Guarda o usuário logado
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stop = ouvirUsuario((u) => {
      setUser(u);
      console.log("Usuário logado:", u);
    });

    return () => stop(); // limpa listener quando sai da página
  }, []);

  function CriarQuiz() {
    navigate("/CriarQuiz");
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
          {user
            ? (user.isAnonymous ? "Convidado" : user.email)
            : "Carregando..."}
        </p>
      </div>

      <p className={styles.paragrafo}>digite o código da sala:</p>

      <div className={styles.wrapper}>
        <img 
          src="/pagina_principal/input.png"
          alt="img"
          className={styles.inputImage}
        />
        <input type="number" className={styles.realInput} />
      </div>

      <button
        onMouseEnter={() =>
          setBotao('/pagina_principal/pgprincipaljogar2.png')
        }
        onMouseLeave={() =>
          setBotao('/pagina_principal/pgprincipaljogar1.png')
        }
        className={styles.jogar}
      >
        <img src={botao} />
      </button>

      <button onClick={() => navigate("/SignUp")}>
        <img
          src='/pagina_principal/pgprincipallogar.png'
          className={styles.logar}
        />
      </button>

      <h1 className={styles.titulo}>meus quizes</h1>

      <div className={styles.listabox}>
        <div>
          <ul>
            <button className={styles.adicionarquiz} onClick={CriarQuiz}>
              +
            </button>
            <li className={styles.quiz}>Quiz-Gincana 2025</li>
            <li className={styles.quiz}>quiz2</li>
            <li className={styles.quiz}>quiz3</li>
          </ul>
        </div>

        <div>{/* placeholder fake */}</div>
      </div>

      <img
        src='/pagina_principal/loginmensagem.png'
        className={styles.mensagem}
      />
    </div>
  );
}

export default PaginaPrincipal;
