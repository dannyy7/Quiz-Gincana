import { useEffect, useState } from 'react';
import styles from './CriarQuiz.module.css';
import { useParams } from 'react-router-dom';
import { db, auth, adicionarPergunta } from '../firebase/bd'; // usa sua função do bd.js
import { doc, getDoc } from 'firebase/firestore';

function CriarQuiz() {
    const { quizID } = useParams(); // pega o quizID da URL
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
                if (!auth.currentUser) return; // garante que o usuário esteja logado
                const uid = auth.currentUser.uid;

                // caminho correto para quizzes do usuário
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

        // sorteia imagem para o botão "+"
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
            // usa a função do bd.js para salvar no Firestore
            await adicionarPergunta(uid, quizID, novaPergunta);

            // atualiza localmente
            setImagensPostit(prev => [...prev, novaPergunta]);
        } catch (err) {
            console.error('Erro ao adicionar pergunta:', err);
        }
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

            <div className={styles.boxpostit}>
                {imagensPostit.map((p, index) => (
                    <button className={styles.postit} key={index}>
                        <img src={p.img} alt="" />
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
