import { useState } from "react";
import { auth } from "../firebase/bd";
import { sendPasswordResetEmail } from "firebase/auth";
import styles from "./RecupSenha.module.css";

function RecupSenha() {

    const [email, setEmail] = useState("")
    const [mensagem, setMensagem] = useState("")
    const [progresso, setProgresso] = useState("")
    const [erro, setErro] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensagem("");
        setErro("");
        setProgresso(true);

        if (!email) {
            setErro("Por favor, insira um email válido.");
            setProgresso(false);
            return;
        }

        try { 
            await sendPasswordResetEmail(auth, email);
            setProgresso(true)
            setMensagem("Email de recuperação enviado! Verifique sua caixa de entrada.");
        } catch (error) {
          switch (error.code) {
            case 'auth/user-not-found':
              setErro("Usuário não encontrado. Verifique o email inserido.");
              break;
            case 'auth/invalid-email':
              setErro("Email inválido. Por favor, insira um email válido.");
              break;

            case 'auth/missing-email':
              setErro("Por favor, insira um email.");
              break;

            default:
              setErro("Ocorreu um erro ao tentar enviar o email de recuperação. Tente novamente mais tarde.");
          }
        } finally {
          setProgresso(false);
        }
    }

    return(
        <div className={styles.container}>
              <div className={styles.cont_form}>
                <h1>Recuperar Senha</h1>
                <h2>Informe o e-mail cadastrado</h2>

                <p>Email</p>
                <div className={styles.forms}>
                  <img src="./signup-login/enteremail.png" alt="email" className={styles.emailimg} />
                  <input
                    type="text"
                    placeholder="Digite seu Email"
                    className={styles.formbox}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <button onClick={handleSubmit} >{progresso ? "Enviando..." : "Enviar"}</button>

                {mensagem && <p className={styles.mensagem}>{mensagem}</p>}
                { erro && <p className={styles.erro}>{erro}</p> }
        
                
              </div>
            </div>
    )

}

export default RecupSenha;