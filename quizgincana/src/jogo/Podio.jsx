import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase/bd";
import { doc, getDoc } from "firebase/firestore";
import styles from "./Podio.module.css"


function Podio(){

    const navigate = useNavigate();
    const { quizId } = useParams();

    const uid = auth.currentUser?.uid;

    const [tituloQuiz, setTituloQuiz] = useState("Carregando...");
    const [top3, setTop3] = useState([]);
    const [carregando, setCarregando] = useState(true);

    function handleFechar(){
        navigate("/PaginaPrincipal");
    }

    useEffect(() => {
        const carregarPodio = async () => {
            if(!uid) return;

            const quizRef = doc(db, "usuarios", uid, "quizzes", quizId);
            const snap = await getDoc(quizRef);

            if (!snap.exists()) return;

            const quizData = snap.data();
            setTituloQuiz(quizData.titulo || "Quiz");

            const jogadores = quizData.jogadores || [];
            const classificados = [...jogadores]
                .sort((a, b) => b.pontos - a.pontos)
                .slice(0, 3);

            while (classificados.length < 3) {
                classificados.push({
                    nome: "",
                    pontos: "",
                    personagem: "/personagens/p3.png"
                });
            }

            setTop3(classificados)
            setCarregando(false);
        };

        carregarPodio();

    }, [quizId, uid]);

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
                    <div className={styles.coroa}><img src="/personagens/coroa.png" alt="coroa" /></div>
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

    const [primeiro, segundo, terceiro] = top3;

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
                    <img src={segundo.personagem} alt="personagem 2º" />
                </div>
                <div className={styles.segundo}>
                    <p className={styles.nome}>{segundo.nome}</p>
                    <p className={styles.posicao}>2º</p>
                    <p className={styles.pontos}>{segundo.pontos}</p>
                </div>

                <div className={styles.person1}>
                    <img src={primeiro.personagem} alt="personagem 1º" />
                </div>
                <div className={styles.coroa}><img src="/personagens/coroa.png" alt="coroa" /></div>
                <div className={styles.primeiro}>
                    <p className={styles.nome}>{primeiro.nome}</p>
                    <p className={styles.posicao}>1º</p>
                    <p className={styles.pontos}>{primeiro.pontos}</p>
                </div>

                <div className={styles.person3}>
                    <img src={terceiro.personagem} alt="personagem 3º" />
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