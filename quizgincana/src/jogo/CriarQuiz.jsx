import { useEffect, useState } from 'react';
import styles from './CriarQuiz.module.css';
import { useParams } from 'react-router-dom';




function CriarQuiz() {
    const { quizID } = useParams(); // pega o quizID da URL
    const postit = [
        '/criar_quiz/postit1.png',
        '/criar_quiz/postit2.png',
        '/criar_quiz/postit3.png',
        '/criar_quiz/postit4.png',
        '/criar_quiz/postit5.png'
    ];

    const quantidadeDeBotoes = 30;

    const [imagensSorteadas, setImagensSorteadas] = useState([]);
    const [postitAddImg, setPostitAddImg] = useState('');

    useEffect(() => {
        // sorteia os post-its normais
        const sorteios = [];
        for (let i = 0; i < quantidadeDeBotoes; i++) {
            const indice = Math.floor(Math.random() * postit.length);
            sorteios.push(postit[indice]);
        }
        setImagensSorteadas(sorteios);

        // sorteia imagem para o botão "+"
        const indiceAdd = Math.floor(Math.random() * postit.length);
        setPostitAddImg(postit[indiceAdd]);
    }, []);

    return (
        <div className={styles.container}>
            <button className={styles.fechar}>
                <img src="/criar_quiz/fechar.png" alt="" />
            </button>

            <div className={styles.row}>
                <div className={styles.tituloWrapper}>
                    <img src="/criar_quiz/postittitulo.png" alt="" className={styles.postittitulo} />
                    <input className={styles.titulo} placeholder="Título do Quiz..." />
                </div>
            </div>

            <div className={styles.boxpostit}>
                {imagensSorteadas.map((img, index) => (
                    <button className={styles.postit} key={index}>
                        <img src={img} alt="" />
                        <span className={styles.numeroPostit}>{index + 1}</span>
                    </button>
                ))}
                {/* BOTÃO DE CRIAR POST-IT com imagem aleatória */}
                <button className={styles.postitAdd}>
                    {postitAddImg && <img src={postitAddImg} alt="post-it" />}
                    <span className={styles.plusSign}>+</span>
                </button>
            </div>
        </div>
    );
}

export default CriarQuiz;
