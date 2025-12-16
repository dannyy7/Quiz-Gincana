import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase/bd";
import { collection, doc, getDocs, getDoc, onSnapshot } from "firebase/firestore";
import styles from "./Podio.module.css"


function Podio(){

    const navigate = useNavigate();
    const uid = auth.currentUser?.uid;

    const [tituloQuiz, setTituloQuiz] = useState("Carregando...");
    const [top3, setTop3] = useState([]);
    const [codigoSala, setCodigoSala] = useState(null);
    const [carregando, setCarregando] = useState(true);

    function handleFechar(){
        navigate("/PaginaPrincipal");
    }

    useEffect(() => {
        const encontrarSala = async () => {
            if (!uid) return;

            const snap = await getDocs(collection(db, "salas"));
            for (const docSnap of snap.docs) {
                const sala = docSnap.data();
                if (sala.jogadores?.some(j => j.uid === uid)) {
                    setCodigoSala(docSnap.id);
                    return;
                }
            }
        };
        encontrarSala();
    }, [uid]);

    useEffect(() => {
        if (!codigoSala) return;

        const salaRef = doc(db, "salas", codigoSala);

        const unsubscribe = onSnapshot(salaRef, async (snap) => {
            if (!snap.exists()) return;

            const sala = snap.data();

            if (sala.quizId && sala.host) {
                const quizRef = doc(
                    db,
                    "usuarios",
                    sala.host,
                    "quizzes",
                    sala.quizId
                );

                const quizSnap = await getDoc(quizRef);
                if (quizSnap.exists()) {
                    setTituloQuiz(quizSnap.data().titulo || "Quiz Sem Título");
                }
            }

            const jogadores = sala.jogadores || [];

            const classificados = [...jogadores]
                .sort((a, b) => (b.pontos || 0) - (a.pontos || 0))
                .slice(0, 3);

            while (classificados.length < 3) {
                classificados.push({
                    nome: "",
                    pontos: 0,
                    personagem: `/personagens/p${classificados.length + 1}.png`,
                    fake: true
                });
            }

            setTop3(classificados);
            setCarregando(false);
        });

        return () => unsubscribe();
    }, [codigoSala]);

    if(carregando){
        return(
            <div className={styles.container}>
                <div className={styles.row}>
                    <div className={styles.tituloWrapper}>
                        <img src="/criar_quiz/postittitulo.png" alt="" className={styles.postittitulo} />                                
                        <p className={styles.titulo}> Titulo quiz </p>
                    </div>
                </div>

                <button className={styles.fechar} onClick={handleFechar}>
                    <img src="/criar_quiz/fechar.png" alt="fechar" />
                </button>

                <div className={styles.podio}>

                    <div className={styles.person2}>
                        <p className={styles.carregando}>...</p>
                    </div>
                    <div className={styles.segundo}>
                        <p className={styles.nome}>Carregando...</p>
                        <p className={styles.posicao}>2º</p>
                        <p className={styles.pontos}>carregando</p>
                    </div>

                    <div className={styles.person1}>
                        <p className={styles.carregando}>...</p>
                    </div>
                    <div className={styles.coroa}><img src="/podio/coroa.png" alt="coroa" /></div>
                    <div className={styles.primeiro}>
                        <p className={styles.nome}>Carregando...</p>
                        <p className={styles.posicao}>1º</p>
                        <p className={styles.pontos}>Carregando...</p>
                    </div>

                    <div className={styles.person3}>
                        <p className={styles.carregando}>...</p>
                    </div>
                    <div className={styles.terceiro}>
                        <p className={styles.nome}>Carregando...</p>
                        <p className={styles.posicao}>3º</p>
                        <p className={styles.pontos}>Carregando...</p>
                    </div>

                </div>
            </div>
        )
    }

    const [primeiro, segundo, terceiro] = [
        top3[0] || {},
        top3[1] || {},
        top3[2] || {}
    ]

    return(
        <div className={styles.container}>
            <div className={styles.row}>
                <div className={styles.tituloWrapper}>
                    <img src="/criar_quiz/postittitulo.png" alt="" className={styles.postittitulo} />                                
                    <p className={styles.titulo}>{tituloQuiz}</p>
                </div>
            </div>

            <button className={styles.fechar} onClick={handleFechar}>
                <img src="/criar_quiz/fechar.png" alt="fechar" />
            </button>

            <div className={styles.podio}>

                <div className={styles.person2}>
                    <img src={segundo.personagem || "/personagens/p2.png"} alt="personagem 2º" />
                </div>
                <div className={styles.segundo}>
                    <p className={styles.nome}>{segundo.nome}</p>
                    <p className={styles.posicao}>2º</p>
                    <p className={styles.pontos}>{segundo.pontos}</p>
                </div>

                <div className={styles.person1}>
                <img src={primeiro.personagem || "/personagens/p1.png"} alt="personagem 1º" />
                </div>
                <div className={styles.coroa}><img src="/podio/coroa.png" alt="coroa" /></div>
                <div className={styles.primeiro}>
                    <p className={styles.nome}>{primeiro.nome}</p>
                    <p className={styles.posicao}>1º</p>
                    <p className={styles.pontos}>{primeiro.pontos}</p>
                </div>

                <div className={styles.person3}>
                    <img src={terceiro.personagem || "/personagens/p3.png"} alt="personagem 3º" />
                </div>
                <div className={styles.terceiro}>
                    <p className={styles.nome}>{terceiro.nome}</p>
                    <p className={styles.posicao}>3º</p>
                    <p className={styles.pontos}>{terceiro.pontos}</p>
                </div>

            </div>
        </div>
    )
}

export default Podio;