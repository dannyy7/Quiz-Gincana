import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './Lobby.module.css';
import { db, auth } from '../firebase/bd';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';

function Lobby() {
    const { codigo } = useParams();
    const navigate = useNavigate();
    const [sala, setSala] = useState(null);

    // ====== CARTAS ALEATÓRIAS DO LOBBY ======
    const cartasBase = [
        '/lobby/carta1.png',
        '/lobby/carta2.png',
        '/lobby/carta3.png',
        '/lobby/carta4.png',
    ];

    const [cartaAtual, setCartaAtual] = useState('');
    const [cartasSorteadas, setCartasSorteadas] = useState([]);

    useEffect(() => {
        // sorteia a carta principal
        const sorteio = cartasBase[Math.floor(Math.random() * cartasBase.length)];
        setCartaAtual(sorteio);

        // embaralha as cartas para o display
        const cartasDisponiveis = [...cartasBase];
        const cartasSelecionadas = [];

        while (cartasDisponiveis.length > 0) {
            const index = Math.floor(Math.random() * cartasDisponiveis.length);
            cartasSelecionadas.push(cartasDisponiveis[index]);
            cartasDisponiveis.splice(index, 1);
        }

        setCartasSorteadas(cartasSelecionadas);
    }, []);

    // ====== FIRESTORE / SALAS ======
    useEffect(() => {
        if (!codigo) return;
        const ref = doc(db, 'salas', codigo);

        const unsubscribe = onSnapshot(ref, (snap) => {
            if (!snap.exists()) {
                setSala(null);
                return;
            }
            setSala(snap.data());

            const data = snap.data();
            if (data.status === 'iniciado' && data.quizID) {
                navigate(`/Jogo/${data.quizID}/${codigo}`);
            }
        });

        return () => unsubscribe();
    }, [codigo]);

    if (!sala) {
        return (
            <div className={styles.container}>
                <p>Sala não encontrada ou carregando...</p>
            </div>
        );
    }

    const iniciarJogo = async () => {
        if (sala.host !== auth.currentUser.uid) {
            alert('Apenas o host pode iniciar o jogo.');
            return;
        }

        const ref = doc(db, 'salas', codigo);
        await updateDoc(ref, { status: 'iniciado' });
    };

    return (
        <div className={styles.container}>
            <div className={styles.salaHeader}>
                <h1>Sala {sala.codigo}</h1>
                <p>Status: {sala.status}</p>
            </div>

            {/* === CARTAS ALEATÓRIAS === */}
            {cartaAtual && <img src={cartaAtual} alt="Carta aleatória" className={styles.cartaAtual} />}
            <div className={styles.cartas}>
                {cartasSorteadas.map((carta, index) => (
                    <div key={index} className={styles.cartaWrapper}>
                        <img src={carta} alt={`Carta ${index + 1}`} className={styles.carta} />
                    </div>
                ))}
            </div>

            <div className={styles.jogadoresBox}>
                <h3>Jogadores conectados:</h3>
                <ul>
                    {sala.jogadores && sala.jogadores.map(j => (
                        <li key={j.uid} className={styles.jogadorItem}>
                            <span>{j.nome}</span>
                            {j.uid === sala.host && <strong> (Host)</strong>}
                        </li>
                    ))}
                </ul>
            </div>

            {sala.host === auth.currentUser.uid && (
                <div className={styles.actions}>
                    <button className={styles.iniciar} onClick={iniciarJogo}>
                        Iniciar Jogo
                    </button>
                </div>
            )}

            <div className={styles.voltar}>
                <button onClick={() => navigate('/PaginaPrincipal')}>Voltar</button>
            </div>
        </div>
    );
}

export default Lobby;
