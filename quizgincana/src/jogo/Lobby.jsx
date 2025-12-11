import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './Lobby.module.css';
import { db, auth } from '../firebase/bd';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';

function Lobby() {
    const { codigo } = useParams();
    const navigate = useNavigate();
    const [sala, setSala] = useState(null);

    // CARTAS ALEATÓRIAS
    const cartasBase = [
        '/lobby/carta1.png',
        '/lobby/carta2.png',
        '/lobby/carta3.png',
        '/lobby/carta4.png',
    ];

    const [cartaAtual, setCartaAtual] = useState('');
    const [cartasSorteadas, setCartasSorteadas] = useState([]);

    useEffect(() => {
        const sorteio = cartasBase[Math.floor(Math.random() * cartasBase.length)];
        setCartaAtual(sorteio);

        const copia = [...cartasBase];
        const embaralhadas = [];

        while (copia.length) {
            const i = Math.floor(Math.random() * copia.length);
            embaralhadas.push(copia[i]);
            copia.splice(i, 1);
        }

        setCartasSorteadas(embaralhadas);
    }, []);

    // FIRESTORE / SALAS
    useEffect(() => {
        if (!codigo) return;

        const ref = doc(db, "salas", codigo);

        const unsub = onSnapshot(ref, snap => {
            if (!snap.exists()) {
                setSala(null);
                return;
            }

            const data = snap.data();
            setSala(data);

            if (data.status === "iniciado" && data.quizID) {
                navigate(`/Jogo/${data.quizID}/${codigo}`);
            }
        });

        return () => unsub();
    }, [codigo]);

    if (!sala) {
        return (
            <div className={styles.container}>
                <p>Carregando sala...</p>
            </div>
        );
    }

    const iniciarJogo = async () => {
        if (sala.host !== auth.currentUser.uid) {
            alert("Apenas o host pode iniciar.");
            return;
        }

        await updateDoc(doc(db, "salas", codigo), { status: "iniciado" });
    };

    return (
        <div className={styles.container}>
            <div className={styles.salaHeader}>
                <h1>Sala {sala.codigo}</h1>
                <p>Status: {sala.status}</p>
            </div>

            {/* CARTA CENTRAL */}
            {cartaAtual && (
                <img src={cartaAtual} alt="Carta" className={styles.cartaAtual} />
            )}

            {/* CARTAS AO FUNDO */}
            <div className={styles.cartas}>
                {cartasSorteadas.map((c, i) => (
                    <img key={i} src={c} className={styles.carta} />
                ))}
            </div>

            {/* JOGADORES */}
            <div className={styles.jogadoresBox}>
                <h3>Jogadores conectados:</h3>

                <ul>
                    {sala.jogadores?.map(j => (
                        <li key={j.uid} className={styles.jogadorItem}>
                            <img 
                                src={j.personagem || "/defaultUser.png"} 
                                className={styles.avatar}
                                alt="Foto"
                            />

                            <span>{j.nome}</span>

                            {j.uid === sala.host && <strong> (Host)</strong>}
                        </li>
                    ))}
                </ul>
            </div>

            {/* BOTÃO DO HOST */}
            {sala.host === auth.currentUser.uid && (
                <button className={styles.iniciar} onClick={iniciarJogo}>
                    Iniciar Jogo
                </button>
            )}

            <button 
                className={styles.voltar}
                onClick={() => navigate("/PaginaPrincipal")}
            >
                Voltar
            </button>
        </div>
    );
}

export default Lobby;
