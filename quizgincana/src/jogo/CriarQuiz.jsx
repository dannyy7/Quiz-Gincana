import { useEffect, useState } from 'react';
import styles from './CriarQuiz.module.css';

function CriarQuiz() {
    const postit = [
        '/criar_quiz/postit1.png',
        '/criar_quiz/postit2.png',
        '/criar_quiz/postit3.png',
        '/criar_quiz/postit4.png',
        '/criar_quiz/postit5.png'
    ];

    const quantidadeDeBotoes = 30; // altere conforme necessário

    const [imagensSorteadas, setImagensSorteadas] = useState([]);

    useEffect(() => {
        const sorteios = [];

        for (let i = 0; i < quantidadeDeBotoes; i++) {
            const indice = Math.floor(Math.random() * postit.length);
            sorteios.push(postit[indice]);
        }

        setImagensSorteadas(sorteios);
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.row}>
                <button><img src="/criar_quiz/fechar.png" alt="" /></button>
                <img src="/criar_quiz/postittitulo.png" alt="" />
                <p>Perguntas: x</p>
            </div>

            <div className={styles.boxpostit}>
                {imagensSorteadas.map((img, index) => (
                    <button className={styles.postit} key={index}>
                        <img src={img} alt="" />
                    </button>
                ))}
            </div>
        </div>
    );
}

export default CriarQuiz;
