import { useState } from 'react';
import './estiloglobal.css';
import styles from './PaginaPrincipal.module.css';

function PaginaPrincipal() {
  const [botao, setBotao] = useState('/pagina_principal/pgprincipaljogar1.png');

  return (
    <div className={styles.container}>
      <button className={styles.botao}>
        <img src="/pagina_principal/pgprincipalsetaesquerda.png" />
      </button>

      <img
        src="/pagina_principal/pgprincipalmoldura.png"
        className={styles.tamanho}
      />

      <button className={styles.botao}>
        <img src="/pagina_principal/pgprincipalsetadireita.png" />
      </button>

      {/* Botão que muda a imagem ao passar o mouse */}
      <button
        className={styles.botao}
        onMouseEnter={() =>
          setBotao('/pagina_principal/pgprincipaljogar2.png')
        }
        onMouseLeave={() =>
          setBotao('/pagina_principal/pgprincipaljogar1.png')
        }
      >
        <img src={botao} />
      </button>
    </div>
  );
}

export default PaginaPrincipal;
