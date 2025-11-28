import { useEffect, useState } from 'react';
import styles from './CriarQuiz.module.css';
import { useParams, useNavigate } from 'react-router-dom';
import { db, auth, adicionarPergunta } from '../firebase/bd';
import { doc, getDoc } from 'firebase/firestore';

function CriarQuiz() {
    const { quizID } = useParams();   // pega o quizID da URL
    const navigate = useNavigate();   // usado para redirecionar a outras páginas

    const postit = [
        '/criar_quiz/postit1.png',
        '/criar_quiz/postit2.png',
        '/criar_quiz/postit3.png',
        '/criar_quiz/postit4.png',
        '/criar_quiz/postit5.png'
    ];

    const [quiz, setQuiz] = useState(null);
    const [imagensPostit, setImagensPostit] = useState([]);
    const [postitAddImg, setPostitAddImg] = useState('');

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                if (!auth.currentUser) return;
                const uid = auth.currentUser.uid;

                const docRef = doc(db, 'usuarios', uid, 'quizzes', quizID);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setQuiz(data);
                    setImagensPostit(data.perguntas || []);
                } else {
                    console.error('Quiz não encontrado');
                    setQuiz({ perguntas: [] });
                }
            } catch (err) {
                console.error('Erro ao buscar quiz:', err);
            }
        };

        fetchQuiz();

        const indiceAdd = Math.floor(Math.random() * postit.length);
        setPostitAddImg(postit[indiceAdd]);
    }, [quizID]);

    const handleAdicionarPergunta = async () => {
        if (!quiz || !auth.currentUser) return;

        const uid = auth.currentUser.uid;

        const novaPergunta = {
            titulo: `Pergunta ${imagensPostit.length + 1}`,
            img: postit[Math.floor(Math.random() * postit.length)]
        };

        try {
            await adicionarPergunta(uid, quizID, novaPergunta);
            setImagensPostit(prev => [...prev, novaPergunta]);
        } catch (err) {
            console.error('Erro ao adicionar pergunta:', err);
        }
    };

    // 👉 Redirecionar para EditarPergunta ao clicar no post-it
    const handleAbrirPergunta = (index) => {
        navigate(`/editarpergunta/${quizID}/${index}`);
    };

    return (
        <div className={styles.container}>
            <button className={styles.fechar}>
                <img src="/criar_quiz/fechar.png" alt="" />
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

            {/* Botão Salvar (visual apenas, ainda sem função) */}
            <button className={styles.salvar}></button>

            <div className={styles.boxpostit}>
                {imagensPostit.map((p, index) => (
                    <button
                        className={styles.postit}
                        key={index}
                        onClick={() => handleAbrirPergunta(index)} // 👈 AQUI
                    >
                        <img src={p.img} alt="post-it" />
                        <span className={styles.numeroPostit}>{index + 1}</span>
                    </button>
                ))}

                {/* BOTÃO DE CRIAR POST-IT */}
                <button className={styles.postitAdd} onClick={handleAdicionarPergunta}>
                    {postitAddImg && <img src={postitAddImg} alt="post-it" />}
                    <span className={styles.plusSign}>+</span>
                </button>
            </div>
        </div>
    );
}

export default CriarQuiz;
