import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './Lobby.module.css';
import { db, auth } from '../firebase/bd';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';

function Lobby() {
    const { codigo } = useParams();
    const navigate = useNavigate();
    const [sala, setSala] = useState(null);
    const imgErrorRefs = useRef({});

    // CARTAS
    const cartasBase = [
        '/lobby/carta1.png',
        '/lobby/carta2.png',
        '/lobby/carta3.png',
        '/lobby/carta4.png',
    ];

    const [cartaAtual, setCartaAtual] = useState('');
    const [cartasSorteadas, setCartasSorteadas] = useState([]);

    useEffect(() => {
        const sorteada = cartasBase[Math.floor(Math.random() * cartasBase.length)];
        setCartaAtual(sorteada);

        const embaralhadas = [...cartasBase].sort(() => Math.random() - 0.5);
        setCartasSorteadas(embaralhadas);
    }, []);

    // FIRESTORE
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
        }, (err) => {
            console.error("Erro onSnapshot sala:", err);
            setSala(null);
        });

        return () => unsub();
    }, [codigo, navigate]);

    if (!sala) {
        return (
            <div className={styles.container}>
                <p>Carregando sala...</p>
            </div>
        );
    }

    const iniciarJogo = async () => {
        if (!auth.currentUser) {
            alert("Usuário não autenticado.");
            return;
        }
        if (sala.host !== auth.currentUser.uid) {
            alert("Apenas o host pode iniciar.");
            return;
        }
        await updateDoc(doc(db, "salas", codigo), { status: "iniciado" });
    };

    // normaliza caminho e garante fallback
    function normalizePath(path) {
        if (!path) return '/personagens/p1.png';
        if (path.startsWith('http://') || path.startsWith('https://')) return path;
        return path.startsWith('/') ? path : '/' + path;
    }

    function handleImgError(e, uid) {
        if (imgErrorRefs.current[uid]) return;
        imgErrorRefs.current[uid] = true;
        e.currentTarget.src = '/personagens/p2.png';
    }

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

            {/* CARTAS DE FUNDO */}
            <div className={styles.cartas}>
                {cartasSorteadas.map((c, i) => (
                    <img key={i} src={c} className={styles.carta} alt={`carta-${i}`} />
                ))}
            </div>

            {/* JOGADORES */}
            <div className={styles.jogadoresBox}>
                <h3>Jogadores conectados:</h3>

                <ul>
                    {sala.jogadores?.map(j => {
                        // usamos sempre o campo fotoPerfil salvo na sala
                        const foto = normalizePath(j.fotoPerfil || j.FotoPerfil || j.personagem || '/personagens/p1.png');

                        console.log("🖼️ Foto de jogador:", j.nome, "→", foto);

                        return (
                            <li key={j.uid} className={styles.jogadorItem}>
                                <img
                                    src={foto}
                                    className={styles.avatar}
                                    alt={`Foto de ${j.nome}`}
                                    onError={(e) => handleImgError(e, j.uid)}
                                />
                                <span>{j.nome}</span>
                                {j.uid === sala.host && <strong> (Host)</strong>}
                            </li>
                        );
                    })}
                </ul>
            </div>

            {/* BOTÃO DO HOST */}
            {sala.host === auth.currentUser?.uid && (
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
