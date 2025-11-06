import { useState } from 'react';
import './estiloglobal.css';
import styles from './PaginaPrincipal.module.css';

function PaginaPrincipal() {
  const [botao, setBotao] = useState('/pagina_principal/pgprincipaljogar1.png');

  return (
    <div className={styles.container}>

      <img src="/pagina_principal/pgprincipalsombra.png" className={styles.imagem}/>{/* efeitos(Imagens da sombra e luz)*/}
      <div className={styles.caixanome}>
        
        <p className={styles.nome}>convidado</p>
      
      </div>

      <div className={styles.coluna}>
        <div  className={`${styles.linha} ${styles.centro}`}>
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
        </div>
        <div className={`${styles.coluna} ${styles.centro2}`}>
          <input className={styles.codigo} type='number'></input>
          <button
            className={`${styles.botao} ${styles.jogar}`}
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

      </div>
      <div className={styles.quizes}>
          <button className={styles.botao}><img src="/pagina_principal/pgprincipallogar.png"/></button>
          <div className={styles.boxli}>
            <li></li>{/* essa será a lista de objetos(quizes) criados pelo usuario */}
          </div>
      </div>

    </div>
  );
}

export default PaginaPrincipal;
