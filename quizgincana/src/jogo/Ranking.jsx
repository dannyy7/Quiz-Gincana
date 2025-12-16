import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase/bd";
import { collection, doc, getDocs, onSnapshot, updateDoc } from "firebase/firestore";
import styles from "./Ranking.module.css";

function Ranking() {
    const { quizId } = useParams();
    const navigate = useNavigate();
    const uid = auth.currentUser?.uid;

    const [codigoSala, setCodigoSala] = useState(null);
    const [salaId, setSalaId] = useState(null);
    const [jogadores, setJogadores] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [isHost, setIsHost] = useState(false);

    useEffect(() => {
        const encontrarSala = async () => {
            if (!uid) return;

            const snap = await getDocs(collection(db, "salas"));
            for (const docSnap of snap.docs) {
                const sala = docSnap.data();
                if ( sala.jogadores?.some(j => j.uid === uid)){
                    setCodigoSala(sala.codigo);
                    setSalaId(docSnap.id);

                    const eHost = sala.hostUid || sala.jogadores[0]?.uid === uid;
                    
                    setIsHost(eHost);
                    return;
                }
            }
        };
        encontrarSala();
    }, [uid]);

    useEffect(() =>{
        if (!codigoSala) return;

        const salaRef = doc(db, "salas", codigoSala);

        const unsubscribe = onSnapshot(salaRef, (snap) => {
            if (!snap.exists()) return;

            const sala = snap.data();
            const ordenados = [...(sala.jogadores || [])].sort(
                (a, b) => (b.pontos || 0) - (a.pontos || 0)
            );

            setJogadores(ordenados);
            setCarregando(false);
        });
        return () => unsubscribe();
    }, [codigoSala]);

    const continuarQuiz = async () => {
        if(!isHost || !codigoSala) return;

        const salaRef = doc(db, "salas", codigoSala);

        await updateDoc(salaRef, {
            status: "jogando",
            tempoRestante:30
        });

        navigate(-1);
    }

    const placeholders = [
        { nome: "Carregando...", pontos: "...", fake: true },
        { nome: "Carregando...", pontos: "...", fake: true },
        { nome: "Carregando...", pontos: "...", fake: true },
    ];

    const listaExibida =
        carregando || jogadores.length === 0 ? placeholders : jogadores;

    return (
        <div className={styles.container}>
            <div className={styles.rankingBox}>
                <h2 className={styles.titulo}>Ranking de Jogadores</h2>

                <div className={styles.ranking}>
                    
                    <div className={`${styles.rankingjogadores} ${styles.cabecalho}`}>
                        <span className={styles.posicao}>Posição</span>
                        <span className={styles.nome}>Nome</span>
                        <span className={styles.pontos}>Pontos</span>
                    </div>

                    {listaExibida.map((j, index) => (
                        <div
                            key={index}
                            className={`${styles.rankingjogadores} ${
                                j.fake ? styles.placeholder : ""
                            }`}
                        >
                            <span className={styles.posicao}>{index + 1}º</span>
                            <span className={styles.nome}>{j.nome}</span>
                            <span className={styles.pontos}>{j.pontos}</span>
                        </div>
                    ))}
                </div>

                { isHost && !carregando && (<button className={styles.continuar} onClick={continuarQuiz}>
                    Continuar Quiz
                </button>)}

            </div>
        </div>
    );
}

export default Ranking;
