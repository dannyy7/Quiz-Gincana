import { useEffect } from 'react';
import './Intro.css';

function Intro() {
  function iniciar() {
    alert("Botão pressionado!");
  }

  // Quando o usuário apertar qualquer tecla, chama a função
  useEffect(() => {
    function handleKeyDown() {
      iniciar(); // executa a ação do botão
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="container">
      <button className="iniciar" disabled>
        <img src="/introbutton.png" alt="Botão" className="iniciar"/>
      </button>
    </div>
  );
}

export default Intro;
