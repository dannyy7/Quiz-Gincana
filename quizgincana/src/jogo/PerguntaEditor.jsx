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

    function handleChange(id, value) {
        setRespostas(prev => ({ ...prev, [id]: value }));
    }

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
                setSelecionado(p.alternativaCorreta || null);
            }
        };

        carregarPergunta();
    }, [quizID, perguntaID]);

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
                    alternativaCorreta: selecionado 
                };
            }
            return p;
        });

        await updateDoc(quizRef, { perguntas: perguntasAtualizadas });

        navigate(`/CriarQuiz/${quizID}`);
    };

    useEffect(() => {
        if (!auth.currentUser || !pergunta) return;

        const timeout = setTimeout(() => {
            updateDoc(doc(db, 'usuarios', auth.currentUser.uid, 'quizzes', quizID), {
                perguntas: [{
                    ...pergunta,
                    enunciado,
                    alternativas: respostas,
                    alternativaCorreta: selecionado
                }]
            }).catch(err => console.error("Erro ao autosalvar pergunta:", err));
        }, 600);

        return () => clearTimeout(timeout);
    }, [enunciado, respostas, selecionado]);

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

                <button onClick={salvarAlteracoes} className={styles.salvar}>
                </button>

                <div className={styles.boxpeso}>
                    <label>Peso:</label>
                    <input type='number'></input>
                </div>
            </div>
        </div>
    );
}

export default PerguntaEditor;
