import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './CriarQuiz.module.css';
import { auth, db } from '../firebase/bd';
import { doc, getDoc, updateDoc, arrayUnion, deleteDoc, setDoc } from 'firebase/firestore';

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
    const [showConfirmPopup, setShowConfirmPopup] = useState(false);

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

    // Gera um código alfanumérico de 5 letras (A-Z)
    function gerarCodigoAlfa() {
        const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let codigo = '';
        for (let i = 0; i < 5; i++) {
            codigo += letras.charAt(Math.floor(Math.random() * letras.length));
        }
        return codigo;
    }

    // CRIA SALA no Firestore com código único (baseado no quiz atual)
    async function criarSala() {
        if (!auth.currentUser || !quiz) return;
        const uid = auth.currentUser.uid;

        // gera código e garante unicidade (checa doc com id = código)
        let codigo = gerarCodigoAlfa();
        let tentativa = 0;
        while (tentativa < 10) {
            const salaRefCheck = doc(db, 'salas', codigo);
            const salaSnap = await getDoc(salaRefCheck);
            if (!salaSnap.exists()) break; // código livre
            codigo = gerarCodigoAlfa();
            tentativa++;
        }
        // se por algum motivo alcançarmos 10 tentativas e ainda existente, aceitaremos o último gerado
        const salaRef = doc(db, 'salas', codigo);

        try {
            await setDoc(salaRef, {
                codigo,
                quizID,
                host: uid,
                jogadores: [
                    {
                        uid,
                        nome: auth.currentUser.displayName || "Host",
                        pontos: 0
                    }
                ],
                status: "aguardando",
                criadoEm: Date.now()
            });

            // redireciona para a sala (rota criada em main.jsx)
            navigate(`/Sala/${codigo}`);
        } catch (err) {
            console.error("Erro ao criar sala:", err);
            alert("Erro ao criar sala. Tente novamente.");
        }
    }

    const handleAdicionarPergunta = async () => {
        if (!auth.currentUser || !quiz) return;
        const uid = auth.currentUser.uid;

        const novaPergunta = {
            id: crypto.randomUUID(),
            titulo: `Pergunta ${perguntas.length + 1}`,
            img: imagensPostitBase[Math.floor(Math.random() * imagensPostitBase.length)],
            enunciado: '',
            alternativas: {1:'',2:'',3:'',4:''},
            respostaCorreta: null,
            peso: 1
        };

        try {
            const ref = doc(db, 'usuarios', uid, 'quizzes', quizID);
            await updateDoc(ref, { perguntas: arrayUnion(novaPergunta) });
            setPerguntas(prev => [...prev, novaPergunta]);
        } catch (err) {
            console.error('Erro ao adicionar pergunta:', err);
        }
    };

    const handleFechar = async () => {
        if (!auth.currentUser || !quiz) return;

        const uid = auth.currentUser.uid;
        const ref = doc(db, 'usuarios', uid, 'quizzes', quizID);

        try {
            await updateDoc(ref, { titulo: quiz.titulo });
            navigate('/PaginaPrincipal');
        } catch (err) {
            console.error('Erro ao salvar título:', err);
        }
    };

    useEffect(() => {
        if (!auth.currentUser || !quiz) return;
        if (quiz.titulo === undefined) return;

        const uid = auth.currentUser.uid;
        const ref = doc(db, "usuarios", uid, "quizzes", quizID);

        const timeout = setTimeout(() => {
            updateDoc(ref, { titulo: quiz.titulo })
                .catch(err => console.error("Erro ao autosalvar título:", err));
        }, 600);

        return () => clearTimeout(timeout);
    }, [quiz?.titulo]);

    const handleExcluirQuiz = async () => {
        if (!auth.currentUser) return;
        const uid = auth.currentUser.uid;

        try {
            const ref = doc(db, 'usuarios', uid, 'quizzes', quizID);
            await deleteDoc(ref);
            setShowConfirmPopup(false);
            navigate('/PaginaPrincipal');
        } catch (err) {
            console.error("Erro ao excluir quiz:", err);
        }
    };

    return (
        <div className={styles.container}>

            <button className={styles.jogar} onClick={criarSala}></button>

            {/* botão excluir abre o popup */}
            <button className={styles.excluir} onClick={() => setShowConfirmPopup(true)}>
                <img src="/criar_quiz/lixeira.png" alt="" />
            </button>

            <button className={styles.fechar} onClick={handleFechar}>
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

            {/* NOVO: popup de confirmação */}
            {showConfirmPopup && (
                <div className={styles.popupOverlay}>
                    <div className={styles.popupContent}>
                        <h3>Tem certeza que deseja excluir este quiz?</h3>
                        <div className={styles.popupButtons}>
                            <button 
                                className={styles.cancelar} 
                                onClick={() => setShowConfirmPopup(false)}
                            >
                                Cancelar
                            </button>
                            <button 
                                className={styles.confirmar} 
                                onClick={handleExcluirQuiz}
                            >
                                Excluir
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default CriarQuiz;
