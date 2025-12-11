import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase/bd';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import styles from './PerguntaEditor.module.css';

function PerguntaEditor() {
    const { quizID, perguntaID } = useParams();
    const navigate = useNavigate();
    const [pergunta, setPergunta] = useState(null);
    const [selecionado, setSelecionado] = useState(null);
    const [respostas, setRespostas] = useState({1:'',2:'',3:'',4:''});
    const [enunciado, setEnunciado] = useState('');
    const [peso, setPeso] = useState(1);

    function handleChange(id, value) {
        setRespostas(prev => ({ ...prev, [id]: value }));
    }

    // CARREGA PERGUNTA
    useEffect(() => {
        const carregarPergunta = async () => {
            if (!auth.currentUser) return;
            const uid = auth.currentUser.uid;
            const quizRef = doc(db, 'usuarios', uid, 'quizzes', quizID);
            const quizSnap = await getDoc(quizRef);
            if (!quizSnap.exists()) return;

            const quizData = quizSnap.data();
            const p = quizData.perguntas.find(p => p.id === perguntaID);

            if (p) {
                setPergunta(p);
                setEnunciado(p.enunciado || '');
                setRespostas(p.alternativas || {1:'',2:'',3:'',4:''});
                setSelecionado(p.respostaCorreta || null);  // <-- corrigido
                setPeso(p.peso || 1);
            }
        };

        carregarPergunta();
    }, [quizID, perguntaID]);

    //EXCLUIR PERGUNTA

    const excluirPergunta = async () => {
        if (!auth.currentUser) return;
        const uid = auth.currentUser.uid;

        try {
            const quizRef = doc(db, 'usuarios', uid, 'quizzes', quizID);
            const quizSnap = await getDoc(quizRef);
            if (!quizSnap.exists()) return;

            const quizData = quizSnap.data();
            const perguntasAtualizadas = quizData.perguntas.filter(p => p.id !== perguntaID);

            await updateDoc(quizRef, { perguntas: perguntasAtualizadas });

            navigate(`/CriarQuiz/${quizID}`);
        } catch (err) {
            console.error("Erro ao excluir pergunta:", err);
        }
    }

    // SALVAR AO CLICAR NO BOTÃO
    const salvarAlteracoes = async () => {
        if (!auth.currentUser) return;
        const uid = auth.currentUser.uid;
        const quizRef = doc(db, 'usuarios', uid, 'quizzes', quizID);
        const quizSnap = await getDoc(quizRef);
        if (!quizSnap.exists()) return;

        const quizData = quizSnap.data();

        const perguntasAtualizadas = quizData.perguntas.map(p => {
            if (p.id === perguntaID) {
                return { 
                    ...p, 
                    enunciado, 
                    alternativas: respostas,
                    respostaCorreta: selecionado,   // <-- corrigido
                    peso
                };
            }
            return p;
        });

        await updateDoc(quizRef, { perguntas: perguntasAtualizadas });

        navigate(`/CriarQuiz/${quizID}`);
    };

    // AUTOSAVE (CORRIGIDO — NÃO SOBRESCREVE O ARRAY)
    useEffect(() => {
        if (!auth.currentUser || !pergunta) return;

        const timeout = setTimeout(async () => {
            const uid = auth.currentUser.uid;
            const quizRef = doc(db, 'usuarios', uid, 'quizzes', quizID);
            const quizSnap = await getDoc(quizRef);
            if (!quizSnap.exists()) return;

            const quizData = quizSnap.data();

            const perguntasAtualizadas = quizData.perguntas.map(p =>
                p.id === perguntaID
                    ? {
                        ...p,
                        enunciado,
                        alternativas: respostas,
                        respostaCorreta: selecionado,  // <-- corrigido
                        peso
                    }
                    : p
            );

            updateDoc(quizRef, { perguntas: perguntasAtualizadas })
                .catch(err => console.error("Erro ao autosalvar pergunta:", err));

        }, 600);

        return () => clearTimeout(timeout);
    }, [enunciado, respostas, selecionado, peso]);

    return (
        <div className={styles.container}>
            <div className={styles.fundo}>
                
                <textarea
                    className={styles.enunciadoInput}
                    value={enunciado}
                    onChange={e => setEnunciado(e.target.value)}
                    placeholder="Digite o enunciado..."
                />

                <div className={styles.alternativas}>
                    <textarea 
                        value={respostas[1]}
                        onChange={e => handleChange(1, e.target.value)}
                        onFocus={() => setSelecionado(1)}
                        placeholder="Digite a alternativa aqui..."
                        className={`${styles.alternativa} ${selecionado===1 ? styles.verde : styles.vermelho}`}
                    />

                    <textarea 
                        value={respostas[2]}
                        onChange={e => handleChange(2, e.target.value)}
                        onFocus={() => setSelecionado(2)}
                        placeholder="Digite a alternativa aqui..."
                        className={`${styles.alternativa} ${selecionado===2 ? styles.verde : styles.vermelho}`}
                    />
                </div>

                <div className={styles.alternativas}>
                    <textarea 
                        value={respostas[3]}
                        onChange={e => handleChange(3, e.target.value)}
                        onFocus={() => setSelecionado(3)}
                        placeholder="Digite a alternativa aqui..."
                        className={`${styles.alternativa} ${selecionado===3 ? styles.verde : styles.vermelho}`}
                    />

                    <textarea 
                        value={respostas[4]}
                        onChange={e => handleChange(4, e.target.value)}
                        onFocus={() => setSelecionado(4)}
                        placeholder="Digite a alternativa aqui..."
                        className={`${styles.alternativa} ${selecionado===4 ? styles.verde : styles.vermelho}`}
                    />
                </div>

                <div>
                    <button onClick={excluirPergunta} className={styles.excluir}>
                        <img src="/criar_quiz/lixeira.png" alt="Excluir" />
                    </button>

                    <button onClick={salvarAlteracoes} className={styles.salvar}></button>

                    <div className={styles.boxpeso}>
                        <label className={styles.labelpeso}>Pontos:</label>
                        <input 
                            type='number' 
                            className={styles.pesoinput} 
                            value={peso}
                            onChange={e => {
                                    const n = e.target.value;
                                    if (n.length <=3) setPeso(Number(n));
                                }
                            }
                        />
                    </div>
                </div>

                <button className={styles.x} onClick={() => navigate(-1)}>
                    <img src="/criar_quiz/fechar.png" />
                </button>
            </div>
        </div>
    );
}

export default PerguntaEditor;
