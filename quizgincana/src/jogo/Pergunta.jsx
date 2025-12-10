import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase/bd";
import { doc, getDoc } from "firebase/firestore";
import styles from "./Pergunta.module.css";

function Pergunta(){

    const { quizId, perguntaId } = useParams();
    const navigate = useNavigate();

    const uid = auth.currentUser?.uid;
    
    const [pergunta, setPergunta] = useState(null);
    const [tempoRestante, setTempoRestante] = useState(30);
    const [selecionado, setSelecionado] = useState(null);
    const [travado, setTravado] = useState(false);

    useEffect(() => {
        const carregarPergunta = async () => {
            if(!uid) return; 

            const quizRef = doc(db, "usuarios", uid, "quizzes", quizId);
            const snap = await getDoc(quizRef);

            if (!snap.exists()) return;

            const quizData = snap.data();
            const perg = quizData.perguntas.find(p => p.id === perguntaId);

            setPergunta(perg);
        };
        carregarPergunta();
    }, [quizId, perguntaId, uid]);

    useEffect(() => {
        if(!pergunta) return;
        if (travado) return;

        const id = setInterval(() => {
            setTempoRestante((t) => {
                if (t <= 1) {
                    clearInterval(id);
                    setTravado(true);
                    return 0;
                }
                return t - 1;
            });
        }, 1000);

        return (() => clearInterval(id));
    }, [pergunta, travado]);

    useEffect(() => {
        setTempoRestante(30);
        setSelecionado(null);
        setTravado(false);
    }, [perguntaId]);

    const escolherResp = (id) => {
        if (travado) return;
        setSelecionado(id);
        setTravado(true);
    };

    useEffect(() => {
        if (!travado) return;

        const timeout = setTimeout(() => {
            navigate(`/quiz/${quizId}/pergunta/${Number(perguntaId) + 1}`);
        }, 1500);

        return () => clearTimeout(timeout);
    }, [travado, navigate, quizId, perguntaId]);


    // -------------------- MODO TESTE --------------------
    if (!pergunta) {

        const perguntaTeste = {
            enunciado: "Carregando pergunta...",
            alternativaCorreta: 1,
            peso: 0, 
            alternativas: {
                1: "Alternativa 1",
                2: "Alternativa 2",
                3: "Alternativa 3",
                4: "Alternativa 4",
            }
        };

        return (
            <div className={styles.container}>
                <div className={styles.fundo}>
                    <div className={styles.enunciado}>
                        <strong>Timer: {tempoRestante}s</strong>
                        <br /><br />
                        {perguntaTeste.enunciado}
                    </div>

                    <div className={styles.alternativas}>
                        {[1, 2].map((id) => (
                            <div
                                key={id}
                                onClick={() => escolherResp(id)}
                                className={`
                                    ${styles.alternativa}
                                    ${styles.hover}
                                    ${styles["cor" + id]}
                                    ${
                                        travado && selecionado === id
                                            ? id === perguntaTeste.alternativaCorreta
                                                ? styles.verde
                                                : styles.vermelho
                                            : ""
                                    }
                                `}
                            >
                                {perguntaTeste.alternativas[id]}
                            </div>
                        ))}
                    </div>

                    <div className={styles.alternativas}>
                        {[3, 4].map((id) => (
                            <div
                                key={id}
                                onClick={() => escolherResp(id)}
                                className={`
                                    ${styles.alternativa}
                                    ${styles.hover}
                                    ${styles["cor" + id]}
                                    ${
                                        travado && selecionado === id
                                            ? id === perguntaTeste.alternativaCorreta
                                                ? styles.verde
                                                : styles.vermelho
                                            : ""
                                    }
                                `}
                            >
                                {perguntaTeste.alternativas[id]}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // -------------------- MODO NORMAL --------------------
    return(
        <div className={styles.container}>
            <div className={styles.fundo}>
                
                <div className={styles.enunciado}>
                    <strong>Timer: {tempoRestante}s</strong>
                    <br /><br />
                    {pergunta.enunciado}
                </div>

                <div className={styles.alternativas}>
                    {[1,2].map(id => (
                        <div
                            key={id}
                            onClick={() => escolherResp(id)}
                            className={`
                                ${styles.alternativa}
                                ${styles.hover}
                                ${styles["cor" + id]}
                                ${
                                    travado && selecionado === id 
                                        ? ( id === pergunta.alternativaCorreta ? styles.verde : styles.vermelho )
                                        : ""
                                }
                            `}
                        >
                            {pergunta.alternativas[id]}
                        </div>
                    ))}
                </div>

                <div className={styles.alternativas}>
                    {[3,4].map(id => (
                        <div
                            key={id}
                            onClick={() => escolherResp(id)}
                            className={`
                                ${styles.alternativa}
                                ${styles.hover}
                                ${styles["cor" + id]}
                                ${
                                    travado && selecionado === id 
                                        ? ( id === pergunta.alternativaCorreta ? styles.verde : styles.vermelho )
                                        : ""
                                }
                            `}
                        >
                            {pergunta.alternativas[id]}
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}

export default Pergunta;
