import styles from "./Pergunta.module.css";

function Pergunta(){
    return(
        <div>

            <div className={styles.container}>

                <div className={styles.fundo}>
                    <textarea
                    className={styles.enunciadoInput}
                    placeholder="Digite o enunciado..."
                    />

                    <div className={styles.alternativas}>
                    <input
                        type="text"
                        placeholder="Digite aqui"
                        className={`${styles.alternativa} ${styles.verde}`} 
                    />
                    <input
                        type="text"
                        placeholder="Digite aqui"
                        className={`${styles.alternativa} ${styles.vermelho}`} 
                    />
                    </div>

                    <div className={styles.alternativas}>
                    <input
                        type="text"
                        placeholder="Digite aqui"
                        className={`${styles.alternativa} ${styles.verde}`} 
                    />
                    <input
                        type="text"
                        placeholder="Digite aqui"
                        className={`${styles.alternativa} ${styles.vermelho}`} 
                    />
                    </div>

                </div>
                </div>

            
        </div>
    )
}

export default Pergunta;