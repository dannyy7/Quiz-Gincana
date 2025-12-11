import { useNavigate } from "react-router-dom";
import styles from "./Podio.module.css"


function Podio(){

    const navigate = useNavigate();

    function handleFechar(){
        navigate("/PaginaPrincipal");
    }


    return(
        <div className={styles.container}>
            <div className={styles.row}>
                <div className={styles.tituloWrapper}>
                    <img src="/criar_quiz/postittitulo.png" alt="" className={styles.postittitulo} />                                
                    <p className={styles.titulo}>Titulo foda</p>
                </div>
            </div>

            <button className={styles.fechar} onClick={handleFechar}>
                <img src="/criar_quiz/fechar.png" alt="fechar" />
            </button>

            <div className={styles.podio}>
                <div className={styles.person2}><p>coroa2</p></div>
                <div className={styles.segundo}></div>
                <div className={styles.person1}><p>coroa1</p></div>
                <div className={styles.primeiro}></div>
                <div className={styles.person3}><p>coroa3</p></div>
                <div className={styles.terceiro}></div>
            </div>
        </div>
    )
}

export default Podio;