import { useEffect } from 'react';
import './estiloglobal.css';  
import styles from'./PaginaPrincipal.module.css';


function PaginaPrincipal(){
    return(
        <div className={styles.container}>
            <div className="coluna">
                <div className={styles.bloco1}></div>
                <img src='pagina_principal/pgprincipalmoldura.png' id='moldura'></img>
                <img src='pagina_principal/pgprincipalsetadireita.png'></img>
                <img src='pagina_principal/pgprincipalsetaesquerda.png'></img>
                <img src='pagina_principal/pgprincipalbutton.png'></img>
             </div>

            <img src='pagina_principal/pgprincipalbutton2.png'></img>
        </div>
    )
}
export default PaginaPrincipal