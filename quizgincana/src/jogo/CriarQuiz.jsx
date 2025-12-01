import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './CriarQuiz.module.css';
import { auth, db } from '../firebase/bd';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';

function CriarQuiz() {
    const { quizID } = useParams();
    const navigate = useNavigate();

    const imagensPostitBase = [
        '/criar_quiz/postit1.png',
        '/criar_quiz/postit2.png',
        '/criar_quiz/postit3.png',
        '/criar_quiz/postit4.png',
        '/criar_quiz/postit5.png'
    ];

    const [quiz, setQuiz] = useState(null);
    const [perguntas, setPerguntas] = useState([]);
    const [postitAddImg, setPostitAddImg] = useState('');

    useEffect(() => {
        const carregarQuiz = async () => {
            if (!auth.currentUser) return;
            const uid = auth.currentUser.uid;
            const ref = doc(db, 'usuarios', uid, 'quizzes', quizID);
            const snap = await getDoc(ref);

            if (snap.exists()) {
                const data = snap.data();
                setQuiz(data);
                setPerguntas(data.perguntas || []);
            } else {
                console.error('Quiz não encontrado');
            }
        };

        carregarQuiz();

        const imgAdd = imagensPostitBase[Math.floor(Math.random() * imagensPostitBase.length)];
        setPostitAddImg(imgAdd);
    }, [quizID]);

    const handleAdicionarPergunta = async () => {
        if (!auth.currentUser || !quiz) return;
        const uid = auth.currentUser.uid;

        const novaPergunta = {
            id: crypto.randomUUID(),
            titulo: `Pergunta ${perguntas.length + 1}`,
            img: imagensPostitBase[Math.floor(Math.random() * imagensPostitBase.length)],
            enunciado: '',
            alternativas: {1:'',2:'',3:'',4:''},
            respostaCorreta: null
        };

        try {
            const ref = doc(db, 'usuarios', uid, 'quizzes', quizID);
            await updateDoc(ref, { perguntas: arrayUnion(novaPergunta) });
            setPerguntas(prev => [...prev, novaPergunta]);
        } catch (err) {
            console.error('Erro ao adicionar pergunta:', err);
        }
    };

    return (
        <div className={styles.container}>
            <button className={styles.fechar}>
                <img src="/criar_quiz/fechar.png" alt="fechar" />
            </button>

            <div className={styles.row}>
                <div className={styles.tituloWrapper}>
                    <img src="/criar_quiz/postittitulo.png" alt="" className={styles.postittitulo} />
                    <input
                        className={styles.titulo}
                        placeholder="Título do Quiz..."
                        value={quiz?.titulo || ''}
                        onChange={e => setQuiz(prev => ({ ...prev, titulo: e.target.value }))}
                    />
                </div>
            </div>

            <div className={styles.boxpostit}>
                {perguntas.map((p, index) => p.id && (
                    <button
                        key={p.id}
                        className={styles.postit}
                        onClick={() => navigate(`/PerguntaEditor/${quizID}/${p.id}`)}
                    >
                        <img src={p.img} alt="post-it" />
                        <span className={styles.numeroPostit}>{index + 1}</span>
                    </button>
                ))}

                <button className={styles.postitAdd} onClick={handleAdicionarPergunta}>
                    {postitAddImg && <img src={postitAddImg} alt="Adicionar" />}
                    <span className={styles.plusSign}>+</span>
                </button>
            </div>
        </div>
    );
}

export default CriarQuiz;
