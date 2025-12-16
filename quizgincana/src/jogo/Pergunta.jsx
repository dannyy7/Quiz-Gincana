import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase/bd";
import { doc, getDoc, onSnapshot, updateDoc, arrayUnion, getDocs, collection } from "firebase/firestore";
import styles from "./Pergunta.module.css";

function Pergunta() {
    const { quizId, perguntaId } = useParams();
    const navigate = useNavigate();
    const uid = auth.currentUser?.uid;

    const [pergunta, setPergunta] = useState(null);
    const [tempoRestante, setTempoRestante] = useState(30);
    const [selecionado, setSelecionado] = useState(null);
    const [travado, setTravado] = useState(false);
    const [salaAtual, setSalaAtual] = useState(null);
    const [codigoSala, setCodigoSala] = useState(null);
    const timerRef = useRef(null);

    // 🔥 CORRIGIDO: Encontrar a sala ativa do usuário
    useEffect(() => {
        const encontrarSalaAtiva = async () => {
            if (!uid) return;
            
            try {
                // Buscar em qual sala o usuário está
                const snapshot = await getDocs(collection(db, "salas"));
                for (const docSnap of snapshot.docs) {
                    const sala = docSnap.data();
                    if (sala.jogadores?.some(j => j.uid === uid)) {
                        setCodigoSala(sala.codigo);
                        setSalaAtual({ id: docSnap.id, ...sala });
                        console.log("Encontrada sala:", sala.codigo);
                        return;
                    }
                }
                console.log("Nenhuma sala encontrada para o usuário");
            } catch (error) {
                console.error("Erro ao buscar sala:", error);
            }
        };
        
        encontrarSalaAtiva();
    }, [uid]);

    // 🔥 ATUALIZADO: Sincronizar estado da pergunta com Firestore
    useEffect(() => {
        if (!codigoSala) return;

        console.log("Monitorando sala:", codigoSala);
        const salaRef = doc(db, "salas", codigoSala);
        
        const unsubscribe = onSnapshot(salaRef, (snap) => {
            if (snap.exists()) {
                const salaData = snap.data();
                console.log("Dados da sala atualizados:", salaData);
                
                // Verificar se a pergunta atual mudou
                if (salaData.perguntaAtual && salaData.perguntaAtual !== Number(perguntaId)) {
                    console.log("Redirecionando para pergunta:", salaData.perguntaAtual);
                    navigate(`/quiz/${quizId}/pergunta/${salaData.perguntaAtual}`);
                }
                
                // Verificar se o tempo foi sincronizado
                if (salaData.tempoRestante !== undefined && salaData.tempoRestante !== tempoRestante) {
                    setTempoRestante(salaData.tempoRestante);
                }
            }
        });

        return () => unsubscribe();
    }, [codigoSala, perguntaId, quizId, navigate]);

    // 🔥 ATUALIZADO: Carregar pergunta do banco
    useEffect(() => {
        const carregarPergunta = async () => {
            if (!quizId || !perguntaId) return;

            try {
                console.log("Carregando pergunta:", { quizId, perguntaId });
                
                // Tentar carregar do quiz público
                let quizRef = doc(db, "quizzesPublicos", quizId);
                let snap = await getDoc(quizRef);
                
                // Se não encontrar no público, tentar em quizzes privados
                if (!snap.exists()) {
                    console.log("Quiz não encontrado em públicos, tentando em quizzes do usuário...");
                    
                    // Buscar em todas as coleções de usuários
                    const usuariosSnapshot = await getDocs(collection(db, "usuarios"));
                    for (const usuarioDoc of usuariosSnapshot.docs) {
                        const usuarioId = usuarioDoc.id;
                        const quizUsuarioRef = doc(db, "usuarios", usuarioId, "quizzes", quizId);
                        const quizUsuarioSnap = await getDoc(quizUsuarioRef);
                        
                        if (quizUsuarioSnap.exists()) {
                            snap = quizUsuarioSnap;
                            console.log("Quiz encontrado no usuário:", usuarioId);
                            break;
                        }
                    }
                }

                if (!snap.exists()) {
                    console.error("Quiz não encontrado em nenhum lugar");
                    return;
                }

                const quizData = snap.data();
                const index = Number(perguntaId) - 1;
                
                if (!quizData.perguntas || index >= quizData.perguntas.length) {
                    console.error("Pergunta não encontrada no índice:", index);
                    return;
                }

                const perg = quizData.perguntas[index];
                setPergunta(perg);
                console.log("Pergunta carregada:", perg.enunciado);

                // 🔥 NOVO: Sincronizar tempo na sala
                if (codigoSala) {
                    const salaRef = doc(db, "salas", codigoSala);
                    await updateDoc(salaRef, {
                        perguntaAtual: Number(perguntaId),
                        tempoRestante: 30
                    });
                }
            } catch (error) {
                console.error("Erro ao carregar pergunta:", error);
            }
        };

        carregarPergunta();
    }, [quizId, perguntaId, codigoSala]);

    // 🔥 ATUALIZADO: Timer sincronizado
    useEffect(() => {
        if (!pergunta || travado || !codigoSala) return;

        const salaRef = doc(db, "salas", codigoSala);
        
        const id = setInterval(async () => {
            setTempoRestante((t) => {
                const novoValor = t - 1;
                
                if (novoValor <= 0) {
                    clearInterval(id);
                    setTravado(true);
                    
                    // Marcar tempo como 0 no Firestore
                    updateDoc(salaRef, {
                        tempoRestante: 0
                    }).catch(err => console.error("Erro ao atualizar tempo:", err));
                    
                    return 0;
                }
                
                // Atualizar no Firestore a cada 3 segundos
                if (novoValor % 3 === 0) {
                    updateDoc(salaRef, {
                        tempoRestante: novoValor
                    }).catch(err => console.error("Erro ao sincronizar tempo:", err));
                }
                
                return novoValor;
            });
        }, 1000);

        timerRef.current = id;
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [pergunta, travado, codigoSala]);

    // 🔥 NOVO: Resetar estados quando a pergunta muda
    useEffect(() => {
        setTempoRestante(30);
        setSelecionado(null);
        setTravado(false);
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
    }, [perguntaId]);

    // 🔥 ATUALIZADO: Escolher resposta com sincronização
    const escolherResp = async (id) => {
        if (travado || !uid || !codigoSala || !pergunta) return;
        
        setSelecionado(id);
        setTravado(true);
        
        // 🔥 NOVO: Registrar resposta no Firestore
        try {
            const salaRef = doc(db, "salas", codigoSala);
            const respostaCorreta = id === pergunta.alternativaCorreta;
            
            // Registrar a resposta
            await updateDoc(salaRef, {
                respostas: arrayUnion({
                    uid,
                    perguntaId: Number(perguntaId),
                    alternativaEscolhida: id,
                    correta: respostaCorreta,
                    timestamp: Date.now()
                }),
                tempoRestante: 0 // Congela o tempo para todos
            });

            // 🔥 ATUALIZAR PONTUAÇÃO DO JOGADOR
            const snapSala = await getDoc(salaRef);
            if (snapSala.exists()) {
                const salaData = snapSala.data();
                const jogadoresAtualizados = salaData.jogadores.map(jogador => {
                    if (jogador.uid === uid && respostaCorreta) {
                        const pontosAdicionados = pergunta.peso || 1;
                        const novosPontos = (jogador.pontos || 0) + pontosAdicionados;
                        console.log(`Atualizando pontos de ${jogador.nome}: +${pontosAdicionados} = ${novosPontos}`);
                        return {
                            ...jogador,
                            pontos: novosPontos
                        };
                    }
                    return jogador;
                });

                await updateDoc(salaRef, {
                    jogadores: jogadoresAtualizados
                });
            }
        } catch (error) {
            console.error("Erro ao registrar resposta:", error);
        }
    };

    // 🔥 ATUALIZADO: Navegação sincronizada
    useEffect(() => {
        if (!travado || !pergunta || !codigoSala) return;

        const timeout = setTimeout(async () => {
            try {
                // Carregar o quiz para verificar o total de perguntas
                let quizRef = doc(db, "quizzesPublicos", quizId);
                let snap = await getDoc(quizRef);
                
                if (!snap.exists()) {
                    // Tentar em quizzes privados
                    const usuariosSnapshot = await getDocs(collection(db, "usuarios"));
                    for (const usuarioDoc of usuariosSnapshot.docs) {
                        const usuarioId = usuarioDoc.id;
                        const quizUsuarioRef = doc(db, "usuarios", usuarioId, "quizzes", quizId);
                        const quizUsuarioSnap = await getDoc(quizUsuarioRef);
                        
                        if (quizUsuarioSnap.exists()) {
                            snap = quizUsuarioSnap;
                            break;
                        }
                    }
                }

                if (!snap.exists()) {
                    console.error("Quiz não encontrado para navegação");
                    return;
                }

                const dados = snap.data();
                const totalPerguntas = dados.perguntas?.length || 0;
                const atual = Number(perguntaId);
                const proxima = atual + 1;

                // 🔥 NOVO: Atualizar sala para próxima pergunta
                const salaRef = doc(db, "salas", codigoSala);
                
                if (proxima > totalPerguntas) {
                    await updateDoc(salaRef, {
                        status: "finalizado"
                    });
                    console.log("Quiz finalizado, indo para pódio");
                    navigate(`/podio/${quizId}`);
                    return;
                }

                if (proxima % 5 === 0) {
                    await updateDoc(salaRef, {
                        perguntaAtual: proxima,
                        status: "ranking"
                    });
                    console.log("Indo para ranking após pergunta", atual);
                    navigate(`/ranking/${quizId}`);
                    return;
                }

                // Próxima pergunta normal
                await updateDoc(salaRef, {
                    perguntaAtual: proxima,
                    tempoRestante: 30
                });
                
                console.log("Indo para próxima pergunta:", proxima);
                navigate(`/quiz/${quizId}/pergunta/${proxima}`);
            } catch (error) {
                console.error("Erro na navegação:", error);
            }
        }, 1500);

        return () => clearTimeout(timeout);
    }, [travado, pergunta, perguntaId, navigate, quizId, codigoSala]);

    // 🔥 NOVO: Função para carregar pergunta de teste (fallback)
    const getPerguntaTeste = () => ({
        enunciado: "Carregando pergunta...",
        alternativaCorreta: 1,
        peso: 0,
        alternativas: {
            1: "Alternativa 1",
            2: "Alternativa 2",
            3: "Alternativa 3",
            4: "Alternativa 4",
        }
    });

    // 🔥 NOVO: Função para renderizar alternativas
    const renderAlternativas = (idsArray, perguntaAtual, modoTeste = false) => {
        const perg = modoTeste ? getPerguntaTeste() : perguntaAtual;
        
        return idsArray.map(id => {
            const classeCor = styles["cor" + id];
            const classeSelecionada = travado && selecionado === id 
                ? (id === perg.alternativaCorreta ? styles.verde : styles.vermelho)
                : "";
            
            return (
                <div
                    key={id}
                    onClick={modoTeste ? undefined : () => escolherResp(id)}
                    className={`
                        ${styles.alternativa}
                        ${!modoTeste && !travado ? styles.hover : ''}
                        ${classeCor}
                        ${classeSelecionada}
                    `}
                >
                    {perg.alternativas && perg.alternativas[id] ? perg.alternativas[id] : `Alternativa ${id}`}
                </div>
            );
        });
    };

    // 🔥 ATUALIZADO: Loading state
    if (!pergunta) {
        return (
            <div className={styles.container}>
                <div className={styles.fundo}>
                    <div className={styles.enunciado}>
                        <strong>Timer: {tempoRestante}s</strong>
                        <br /><br />
                        {getPerguntaTeste().enunciado}
                        <p style={{fontSize: '14px', color: '#666'}}>
                            Aguardando pergunta do banco de dados...
                            {codigoSala && <br/>}
                            {codigoSala && `Sala: ${codigoSala}`}
                        </p>
                    </div>

                    <div className={styles.alternativas}>
                        {renderAlternativas([1, 2], null, true)}
                    </div>

                    <div className={styles.alternativas}>
                        {renderAlternativas([3, 4], null, true)}
                    </div>
                </div>
            </div>
        );
    }

    // 🔥 ATUALIZADO: Renderização normal
    return (
        <div className={styles.container}>
            <div className={styles.fundo}>
                <div className={styles.enunciado}>
                    <div className={styles.timerContainer}>
                        <strong>Timer: {tempoRestante}s</strong>
                        {codigoSala && (
                            <span className={styles.salaInfo}>
                                Sala: {codigoSala}
                            </span>
                        )}
                    </div>
                    <br />
                    <div className={styles.textoEnunciado}>
                        {pergunta.enunciado}
                    </div>
                </div>

                <div className={styles.alternativas}>
                    {renderAlternativas([1, 2], pergunta)}
                </div>

                <div className={styles.alternativas}>
                    {renderAlternativas([3, 4], pergunta)}
                </div>

                {/* 🔥 NOVO: Indicador de resposta correta após travado */}
                {travado && (
                    <div className={styles.feedback}>
                        {selecionado === pergunta.alternativaCorreta 
                            ? "✅ Resposta Correta!" 
                            : "❌ Resposta Incorreta!"}
                        <div className={styles.correta}>
                            Resposta correta: {pergunta.alternativas[pergunta.alternativaCorreta]}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Pergunta;