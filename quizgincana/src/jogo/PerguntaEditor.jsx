import { useNavigate } from 'react-router-dom';
import styles from './PerguntaEditor.module.css';

function PerguntaEditor(){
    return(
        <div className={styles.container}>

            <div className={styles.fundo}>
                <div className={styles.enunciadobox}>
                    <p className={styles.enunciado}>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Accusantium hic beatae, quaerat delectus consequuntur sint recusandae vero blanditiis nulla optio maxime impedit quae, expedita consectetur? Enim corporis iure dolores tempore. Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus dolores consectetur debitis dolor deserunt quis, in deleniti quidem voluptatibus ut illum aperiam omnis sapiente natus. Enim placeat rem veniam? Dolores?</p>
                </div>
                <div className={styles.alternativas}>

                    <button className={styles.alternativa}>resposta 1</button>
                    <button className={styles.alternativa}>resposta 2</button>


                </div>
                <div className={styles.alternativas}>

                    <button className={styles.alternativa}>resposta 3</button>
                    <button className={styles.alternativa}>resposta 4</button>

                </div>
            </div>

        </div>
    )
}
export default PerguntaEditor