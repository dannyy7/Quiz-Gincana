import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase/bd";
import { doc, getDoc } from "firebase/firestore";
import styles from "./Ranking.module.css";

function Ranking() {
    const { quizId } = useParams();
    const navigate = useNavigate();
    const uid = auth.currentUser?.uid;

    const [jogadores, setJogadores] = useState([]);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        const carregarRanking = async () => {
            if (!uid) return;

            const quizRef = doc(db, "usuarios", uid, "quizzes", quizId);
            const snap = await getDoc(quizRef);

            if (!snap.exists()) {
                setCarregando(false);
                return;
            }

            const dados = snap.data();
            const lista = dados.jogadores || [];

            const ordenados = [...lista].sort((a, b) => b.pontos - a.pontos);

            setJogadores(ordenados);
            setCarregando(false);
        };

        carregarRanking();
    }, [quizId, uid]);

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

            </div>
        </div>
    );
}

export default Ranking;
