import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";

// Firebase
import { loginEmail, pegarUsuario } from "../firebase/firebaseConfig";

function Login() {
  const navigate = useNavigate();
  const [icon, setIcon] = useState("./signup-login/enterlockclosed.png");
  const [tipo, setTipo] = useState("password");

  // Estados dos inputs
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  // Alterna visibilidade da senha
  function ocultarsenha() {
    setTipo((prev) => {
      if (prev === "password") {
        setIcon("./signup-login/enterlockopen.png");
        return "text";
      } else {
        setIcon("./signup-login/enterlockclosed.png");
        return "password";
      }
    });
  }

  // Login com email e senha
  async function FazerLogin() {
    if (!email || !senha) {
      setErro("Preencha todos os campos.");
      return;
    }

    try {
      navigate("/PaginaPrincipal");
      // Faz login no Firebase Auth
      const cred = await loginEmail(email, senha);

      // Pega nome do usuário do Firestore
      const nomeUsuario = await pegarUsuario(cred.user.uid);

      // Salva no localStorage pra não precisar recarregar Firestore
      localStorage.setItem("nomeUsuario", nomeUsuario);

      // Redireciona pra pagina principal
    } catch (err) {
      console.log(err);
      if (err.code === "auth/user-not-found") {
        setErro("Usuário não encontrado.");
      } else if (err.code === "auth/wrong-password") {
        setErro("Senha incorreta.");
      } else if (err.code === "auth/invalid-email") {
        setErro("Email inválido.");
      } else {
        setErro("Erro ao fazer login.");
      }
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.cont_form}>
        <p>Email</p>
        <div className={styles.forms}>
          <img src="./signup-login/enteremail.png" alt="email" />
          <input
            type="text"
            placeholder="Digite seu Email"
            className={styles.loginbox}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <p>Senha</p>
        <div className={styles.forms}>
          <button onClick={ocultarsenha} className={styles.iconimg}>
            <img src={icon} alt="cadeado" />
          </button>
          <input
            type={tipo}
            placeholder="Digite sua Senha"
            className={styles.loginbox}
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
        </div>

        <button onClick={FazerLogin} className={styles.loginbutton}>
          Login
        </button>

        {erro && <p className={styles.erro}>{erro}</p>}

        <div className={styles.registrar}>
          <p>Não tem uma conta?</p>
          <button onClick={() => navigate("/SignUp")}>SignUp</button>
        </div>
      </div>
    </div>
  );
}

export default Login;
