import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Intro.module.css';

function Intro() {
  const navigate = useNavigate();
  
  function iniciar() {
    navigate('PaginaPrincipal');
  }

  useEffect(() => {
    function handleKeyDown() {
      iniciar();
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className={styles.container}>
      <button className={styles.iniciar} onClick={iniciar}>
        <img src="/intro/introbutton.png" alt="Botão" className={styles.iniciar}/>
      </button>
    </div>
  );
}

export default Intro;
