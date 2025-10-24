import { useEffect } from 'react';
import './estiloglobal.css';  
import styles from'./PaginaPrincipal.module.css';


function PaginaPrincipal(){
    return(
        <div className={styles.container}>
            <div className="coluna">
                <div className={styles.bloco1}></div>
                <img src='pagina_principal/pgprincipalmoldura.png' className={styles.imagem}></img>
                <img src='pagina_principal/pgprincipalsetadireita.png' className={styles.imagem}></img>
                <img src='pagina_principal/pgprincipalsetaesquerda.png' className={styles.imagem}></img>
                <img src='pagina_principal/pgprincipalbutton.png'className={styles.imagem}></img>
                <button className={styles.botao}></button>
             </div>

            <img src='pagina_principal/pgprincipalbutton2.png' className={styles.imagem}></img>
        </div>
    )
}
export default PaginaPrincipal