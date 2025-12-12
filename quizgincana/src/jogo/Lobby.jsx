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

    const cartasBase = [
        '/lobby/carta1.png',
        '/lobby/carta2.png',
        '/lobby/carta3.png',
        '/lobby/carta4.png',
    ];

    const [cartasJogadores, setCartasJogadores] = useState({});

    useEffect(() => {
        if (!sala?.jogadores) return;

        const novas = {};
        sala.jogadores.forEach(jogador => {
            const carta = cartasBase[Math.floor(Math.random() * cartasBase.length)];
            const rotacao = (Math.random() * 17 - 5);
            novas[jogador.uid] = { carta, rotacao };
        });
        setCartasJogadores(novas);
    }, [sala?.jogadores]);

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

    if (!sala) return (
        <div className={styles.container}>
            <p>Carregando sala...</p>
        </div>
    );

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
                <h1 className={styles.titulo}>Sala: {sala.codigo}</h1>
            </div>

            <div className={styles.cartas}>
                {sala.jogadores?.map(j => {
                    const foto = normalizePath(
                        j.fotoPerfil || j.FotoPerfil || j.personagem || '/personagens/p1.png'
                    );

                    const dadosCarta = cartasJogadores[j.uid] || {};
                    const rotacao = dadosCarta.rotacao || 0;
                    const isHost = j.uid === sala.host;

                    return (
                        <div
                            key={j.uid}
                            className={styles.cardContainer}
                            style={{ transform: `rotate(${rotacao}deg)` }}
                        >
                            <img
                                src={dadosCarta.carta}
                                className={styles.carta}
                                alt={`carta-${j.nome}`}
                            />

                            {isHost && (
                                <img
                                    src="/lobby/coroa.png"
                                    className={styles.coroa}
                                    alt="Coroa do host"
                                />
                            )}

                            <img
                                src={foto}
                                className={styles.avatarSobreposto}
                                alt={`Foto de ${j.nome}`}
                                onError={(e) => handleImgError(e, j.uid)}
                            />

                            <p className={styles.nomeJogador}>{j.nome}</p>
                        </div>
                    );
                })}
            </div>

            {sala.host === auth.currentUser?.uid && (
                <button className={styles.iniciar} onClick={iniciarJogo}>
                    Iniciar Jogo
                </button>
            )}

            <button className={styles.fechar}>
                <img src="/criar_quiz/fechar.png" alt="fechar" />
            </button>
        </div>
    );
}

export default Lobby;
