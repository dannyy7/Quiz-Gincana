import { useState } from 'react';
import './estiloglobal.css';
import styles from './PaginaPrincipal.module.css';

function PaginaPrincipal() {
  const [botao, setBotao] = useState('/pagina_principal/pgprincipaljogar1.png');

  return (
    <div className={styles.container}>
  
        <div className={styles.fundo2}></div>
        <img src='/pagina_principal/pgprincipalmoldura.png' className={styles.moldura}></img>
        <button className={styles.setadireita}><img src='/pagina_principal/pgprincipalsetadireita.png'></img></button>
        <button className={styles.setaesquerda}><img src='/pagina_principal/pgprincipalsetaesquerda.png'></img></button>
        <div className={styles.nomebox}><p className={styles.nome}>convidado</p></div>

        <p className={styles.paragrafo} >digite o código da sala:</p>
        <div className={styles.wrapper}>
          <img 
            src="/pagina_principal/input.png"
            alt="img"
            className={styles.inputImage}
          />
          <input type="number" className={styles.realInput} />
        </div>
        
        <button onMouseEnter={() =>
              setBotao('/pagina_principal/pgprincipaljogar2.png')
            }
            onMouseLeave={() =>
              setBotao('/pagina_principal/pgprincipaljogar1.png')
            } className={styles.jogar}><img src={botao}/></button>
        <img src='/pagina_principal/pgprincipallogar.png' className={styles.logar}></img>

        <h1 className={styles.titulo}>meus quizes</h1>

        <div className={styles.listabox}>

          <div>
            <ul>
              <button className={styles.adicionarquiz}>+</button>
              <li className={styles.quiz}>Quiz-Gincana 2025</li>
              <li className={styles.quiz}>quiz2</li>
              <li className={styles.quiz}>quiz3</li>
            </ul>
        
          </div>

          <div>{/* Falso Placeholder nas listas de quizes (usando opacity no css)*/ }
            <p></p>
          </div>

        </div>
        <img src='/pagina_principal/loginmensagem.png' className={styles.mensagem}></img>
      
    </div>
  );
}

export default PaginaPrincipal;
