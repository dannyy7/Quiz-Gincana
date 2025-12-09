import { use, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase/bd";
import { doc, getDoc } from "firebase/firestore";
import styles from "./Pergunta.module.css";



function Pergunta(){

    const { quizId, perguntaId } = useParams();
    const navigate = useNavigate();
    
    const [pergunta, setPergunta] = useState(null);
    const [tempoRestante, setTempoRestante] = useState(30);
    const [selecionado, setSelecionado] = useState(null);
    const [travado, setTravado] = useState(false);
    const [intervalo, setIntervalo] = useState(null);

    //Carregar pergunta
    useEffect(() => {
        const carregarPergunta = async () => {
            if(!auth.currentUser) return; 

            const uid = auth.currentUser.uid;
            const quizRef = doc(db, "usuarios", uid, "quizzes", quizId);
            const snap = await getDoc(quizRef);

            if (!snap.exists()) return;

            const quizData = snap.data();
            const perg = quizData.perguntas.find(p => p.id === perguntaId);

            setPergunta(perg);
        };
        carregarPergunta();
    }, [quizId, perguntaId]);

    //Timer
    useEffect(() => {
        if (travado) return;
        if (tempoRestante <= 0) { setTravado(true); return; }

        const intervalo = setIntervalo(() => {
            setTempoRestante((t) => t - 1);
        }, 1000);

        return (() => clearInterval(intervalo));
    }, [tempoRestante, travado]);

    //Escolher resposta
    const escolherResp = (id) => {
        if (travado) return;
        setSelecionado(id);
        setTravado(true);
    };

    if (!pergunta) {
        return <div>Carregando pergunta...</div>;
    }


    return(
        <div>

            <div className={styles.container}>

                <div className={styles.fundo}>
                    
                    <div className={styles.enunciado}>
                        <strong>Tempo restante: ${tempoRestante}s</strong>
                        <br /><br />
                        {Pergunta.enunciado}
                    </div>

                    <div className={styles.alternativas}>
                        {[1,2].map(id => (
                            <div
                                key={id}
                                onClick={() => escolherResp(id)}
                                className={`${styles.alternativa}
                                    ${travado && selecionado === id ? ( id === Pergunta.alternativaCorreta ? styles.verde : styles.vermelho ) : styles.normal}
                                }`}
                            >
                                {Pergunta.alternativas[id]}
                            </div>
                        ))}
                       
                    </div>
                    <div className={styles.alternativas}>
                        {[3,4].map(id => (
                            <div
                                key={id}
                                onClick={() => escolherResp(id)}
                                className={`${styles.alternativa}
                                    ${travado && selecionado === id ? ( id === Pergunta.alternativaCorreta ? styles.verde : styles.vermelho ) : styles.normal}
                                }`}
                            >
                                {Pergunta.alternativas[id]}
                            </div>
                        ))}
                    </div>

                </div>
                </div>

            
        </div>
    )
}

export default Pergunta;