import { useNavigate } from 'react-router-dom';
import styles from './Pergunta.module.css';

function Pergunta(){
    return(
        <div className={styles.container}>

            <div className={styles.paralaxcontainer}>
                <div className={styles.enunciadobox}>
                    <p className={styles.enunciado}>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Accusantium hic beatae, quaerat delectus consequuntur sint recusandae vero blanditiis nulla optio maxime impedit quae, expedita consectetur? Enim corporis iure dolores tempore. Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus dolores consectetur debitis dolor deserunt quis, in deleniti quidem voluptatibus ut illum aperiam omnis sapiente natus. Enim placeat rem veniam? Dolores?</p>
                </div>
            </div>

        </div>
    )
}
export default Pergunta