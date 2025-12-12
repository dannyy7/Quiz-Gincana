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

    // ============================
    // CARREGAR QUIZ
    // ============================
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
        setPostitAddImg(imagensPostitBase[Math.floor(Math.random() * imagensPostitBase.length)]);
    }, [quizID]);

    // ============================
    // ADICIONAR PERGUNTA
    // ============================
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

    // ============================
    // AUTOSAVE TÍTULO
    // ============================
    useEffect(() => {
        if (!auth.currentUser || !quiz) return;

        const uid = auth.currentUser.uid;
        const ref = doc(db, 'usuarios', uid, 'quizzes', quizID);

        const timeout = setTimeout(() => {
            updateDoc(ref, { titulo: quiz.titulo })
                .catch(err => console.error("Erro ao autosalvar título:", err));
        }, 600);

        return () => clearTimeout(timeout);
    }, [quiz?.titulo]);

    // ============================
    // FECHAR QUIZ (volta para página principal)
    // ============================
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

    // ============================
    // CRIAR SALA (COM FOTO DO PERFIL = PERSONAGEM)
    // ============================
    async function criarSala() {
        if (!auth.currentUser || !quiz) return;

        const uid = auth.currentUser.uid;

        // buscar personagem
        let fotoPerfil = '/personagens/p1.png';

        try {
            const userRef = doc(db, 'usuarios', uid);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                const data = userSnap.data();
                fotoPerfil = data.FotoPerfil || data.personagem || fotoPerfil;
            }
        } catch (err) {
            console.error("Erro ao buscar fotoPerfil:", err);
        }

        // gerar código
        const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const gerarCodigo = () =>
            Array.from({ length: 5 }, () => letras[Math.floor(Math.random() * letras.length)]).join("");

        let codigo = gerarCodigo();

        // criar sala
        const salaRef = doc(db, "salas", codigo);

        await setDoc(salaRef, {
            codigo,
            quizID,
            host: uid,
            status: "aguardando",
            criadoEm: Date.now(),
            jogadores: [
                {
                    uid,
                    nome: auth.currentUser.displayName || "Host",
                    personagem: fotoPerfil,
                    pontos: 0
                }
            ]
        });

        navigate(`/Sala/${codigo}`);
    }

    // ============================
    // EXCLUIR QUIZ
    // ============================
    const handleExcluirQuiz = async () => {
        if (!auth.currentUser) return;

        const uid = auth.currentUser.uid;

        try {
            await deleteDoc(doc(db, 'usuarios', uid, 'quizzes', quizID));
            setShowConfirmPopup(false);
            navigate('/PaginaPrincipal');
        } catch (err) {
            console.error("Erro ao excluir quiz:", err);
        }
    };

    return (
        <div className={styles.container}>

            {/* CRIAR SALA */}
            <button className={styles.jogar} onClick={criarSala}></button>

            {/* BOTÃO EXCLUIR */}
            <button className={styles.excluir} onClick={() => setShowConfirmPopup(true)}>
                <img src="/criar_quiz/lixeira.png" alt="" />
            </button>

            {/* FECHAR */}
            <button className={styles.fechar} onClick={handleFechar}>
                <img src="/criar_quiz/fechar.png" alt="fechar" />
            </button>

            {/* TÍTULO */}
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

            {/* POST-ITS */}
            <div className={styles.boxpostit}>
                {perguntas.map((p, index) => (
                    p.id && (
                        <button
                            key={p.id}
                            className={styles.postit}
                            onClick={() => navigate(`/PerguntaEditor/${quizID}/${p.id}`)}
                        >
                            <img src={p.img} alt="post-it" />
                            <span className={styles.numeroPostit}>{index + 1}</span>
                        </button>
                    )
                ))}

                <button className={styles.postitAdd} onClick={handleAdicionarPergunta}>
                    {postitAddImg && <img src={postitAddImg} alt="Adicionar" />}
                    <span className={styles.plusSign}>+</span>
                </button>
            </div>

            {/* POPUP DE CONFIRMAÇÃO */}
            {showConfirmPopup && (
                <div className={styles.popupOverlay}>
                    <div className={styles.popupContent}>
                        <h3>Tem certeza que deseja excluir este quiz?</h3>

                        <div className={styles.popupButtons}>
                            <button className={styles.cancelar} onClick={() => setShowConfirmPopup(false)}>
                                Cancelar
                            </button>
                            <button className={styles.confirmar} onClick={handleExcluirQuiz}>
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
