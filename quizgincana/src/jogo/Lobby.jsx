import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Lobby.module.css';

function Lobby() {
    const navigate = useNavigate();

    // Array com as imagens das cartas
    const cartasBase = [
        '/lobby/carta1.png',
        '/lobby/carta2.png',
        '/lobby/carta3.png',
        '/lobby/carta4.png',
    ];

    // Estado para guardar todas as cartas sorteadas
    const [cartasSorteadas, setCartasSorteadas] = useState([]);

    useEffect(() => {
        // Cria uma cópia do array para evitar repetir cartas
        const cartasDisponiveis = [...cartasBase];
        const cartasSelecionadas = [];

        while (cartasDisponiveis.length > 0) {
            const index = Math.floor(Math.random() * cartasDisponiveis.length);
            cartasSelecionadas.push(cartasDisponiveis[index]);
            cartasDisponiveis.splice(index, 1); // Remove do array para não repetir
        }

        setCartasSorteadas(cartasSelecionadas);
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.cartas}>
                {cartasSorteadas.map((carta, index) => (
                    <div key={index} className={styles.cartaWrapper}>
                        <img src={carta} alt={`Carta ${index + 1}`} className={styles.carta} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Lobby;
