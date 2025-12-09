import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginAnonimo } from "../firebase/firebaseConfig";
import styles from './Lobby.module.css';

function Lobby(){
    const navigate = useNavigate();

    // Array com as imagens das cartas
    const cartas = [
        '/lobby/carta1.png',
        '/lobby/carta2.png',
        '/lobby/carta3.png',
        '/lobby/carta4.png',
    ];

    // Estado para guardar a carta atual
    const [cartaAtual, setCartaAtual] = useState('');

    useEffect(() => {
        // Sorteia uma carta aleatória ao carregar a tela
        const sorteio = cartas[Math.floor(Math.random() * cartas.length)];
        setCartaAtual(sorteio);
    }, []);

    return(
        <div className={styles.container}>
            {cartaAtual && <img src={cartaAtual} alt="Carta aleatória" />}
        </div>
    )
}

export default Lobby;
