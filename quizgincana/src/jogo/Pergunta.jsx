import styles from "./Pergunta.module.css";

function Pergunta(){
    return(
        <div>

            <div className={styles.container}>

                <div className={styles.fundo}>
                    
                    <p className="{styles.enunciado}">
                        enunciado
                    </p>

                    <div className={styles.alternativas}>
                    
                        <div>
                            <p className={styles.alternativa} >resposta2</p>
                        </div>
                        <div>
                            <p className={styles.alternativa} >resposta2</p>
                        </div>
                        <div>
                            <p className={styles.alternativa} >resposta2</p>
                        </div>
                        <div>
                            <p className={styles.alternativa} >resposta2</p>
                        </div>

                    </div>

                </div>
                </div>

            
        </div>
    )
}

export default Pergunta;