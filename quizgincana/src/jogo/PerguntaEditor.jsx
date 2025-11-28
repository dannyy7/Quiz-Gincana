import { useState } from 'react';
import styles from './PerguntaEditor.module.css';

function PerguntaEditor() {
    const [selecionado, setSelecionado] = useState(null);
    const [respostas, setRespostas] = useState({ 1:'', 2:'', 3:'', 4:'' });
    const [enunciado, setEnunciado] = useState("");

    function handleChange(id, value) {
        setRespostas(prev => ({ ...prev, [id]: value }));
    }

    return (
        <div className={styles.container}>
            <div className={styles.fundo}>

                {/* Enunciado */}
                <div>
                    className={styles.enunciadoInput}
                    contentEditable
                    onInput={(e) => setEnunciado(e.target.innerText)}
                </div>

                {/* Alternativa 2 */}
                <input
                    type="text"
                    value={respostas[2]}
                    onChange={(e) => handleChange(2, e.target.value)}
                    onFocus={() => setSelecionado(2)}
                    placeholder="Digite aqui"
                    className={`${styles.alternativa} ${selecionado === 2 ? styles.verde : styles.vermelho}`}
                />

                {/* Alternativas 3 e 4 */}
                <div className={styles.alternativas}>
                    <input
                        type="text"
                        value={respostas[3]}
                        onChange={(e) => handleChange(3, e.target.value)}
                        onFocus={() => setSelecionado(3)}
                        placeholder="Digite aqui"
                        className={`${styles.alternativa} ${selecionado === 3 ? styles.verde : styles.vermelho}`}
                    />

                    <input
                        type="text"
                        value={respostas[4]}
                        onChange={(e) => handleChange(4, e.target.value)}
                        onFocus={() => setSelecionado(4)}
                        placeholder="Digite aqui"
                        className={`${styles.alternativa} ${selecionado === 4 ? styles.verde : styles.vermelho}`}
                    />
                </div>

            </div>
        </div>
    );
}

export default PerguntaEditor;
