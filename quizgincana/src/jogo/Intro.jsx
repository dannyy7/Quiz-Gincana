// src/jogo/Intro.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginAnonimo } from "../firebase/firebaseConfig";
import styles from './Intro.module.css';

function Intro() {
  const navigate = useNavigate();
  const [logando, setLogando] = useState(false); // previne múltiplos logins

  async function iniciar() {
    if (logando) return; // evita múltiplas execuções
    setLogando(true);

    try {
      await loginAnonimo(); // login anônimo
      navigate('/PaginaPrincipal'); // navega após login
    } catch (err) {
      console.error("Erro ao logar anonimamente:", err);
      setLogando(false);
    }
  }

  useEffect(() => {
    const handleKeyDown = () => iniciar(); // qualquer tecla chama iniciar
    document.addEventListener('keydown', handleKeyDown);

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []); // sem dependências extras

  const handleKeyDown = () => {
  console.log("Tecla pressionada!");
  iniciar();
};

  return (
    <div className={styles.container}>
      <button className={styles.iniciar} onClick={iniciar}>
        <img src="/intro/introbutton.png" alt="Botão" className={styles.iniciar}/>
      </button>
    </div>
  );
}

export default Intro;
