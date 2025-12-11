import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SignUp.module.css";

// Firebase
import { criarConta, salvarUsuario } from "../firebase/firebaseConfig";
import { updateProfile } from "firebase/auth";

function SignUp() {
  const navigate = useNavigate();

  const [icon, setIcon] = useState("./signup-login/enterlockclosed.png");
  const [tipo, setTipo] = useState("password");

  const [usuario, setUsuario] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

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

  async function CriarUsuario() {
    if (!usuario || !email || !senha) {
      setErro("Preencha todos os campos.");
      return;
    }

    try {
      // Cria usuário no Auth
      const cred = await criarConta(email, senha);

      // Redireciona imediatamente para a PaginaPrincipal
      navigate("/PaginaPrincipal");

      // Atualiza displayName do Auth (em background)
      updateProfile(cred.user, { displayName: usuario })
        .catch(err => console.log("Erro ao atualizar displayName:", err));

      // Salva nome no Firestore (em background)
      salvarUsuario(cred.user.uid, usuario)
        .catch(err => console.log("Erro ao salvar no Firestore:", err));

    } catch (err) {
      console.log(err);
      let msg = "Erro ao criar conta.";
      if (err.code === "auth/email-already-in-use") msg = "Este email já está em uso.";
      else if (err.code === "auth/invalid-email") msg = "Email inválido.";
      else if (err.code === "auth/weak-password") msg = "A senha precisa ter pelo menos 6 caracteres.";
      setErro(msg);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.cont_form}>
        <div>
          
        </div>
        <p>Nome de usuário</p>
        <div className={styles.forms}>
          <img src="./signup-login/signupperson.png" alt="usuario" className={styles.usuario}/>
          <input
            type="text"
            placeholder="Digite seu usuario"
            className={styles.loginbox}
            value={usuario}
            maxLength={25}
            onChange={(e) => setUsuario(e.target.value)}
          />
        </div>

        <p>Email</p>
        <div className={styles.forms}>
          <img src="./signup-login/enteremail.png" alt="email" className={styles.emaillockimg}/>
          <input
            type="text"
            placeholder="Digite seu Email"
            className={styles.loginbox}
            value={email}
            maxLength={74}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <p>Senha</p>
        <div className={styles.forms}>
          <button onClick={ocultarsenha} className={styles.iconimg}>
            <img src={icon} alt="cadeado" className={styles.emaillockimg}/>
          </button>
          <input
            type={tipo}
            placeholder="Digite sua senha"
            className={styles.loginbox}
            value={senha}
            maxLength={30}
            onChange={(e) => setSenha(e.target.value)}
          />
        </div>

        <button onClick={CriarUsuario} className={styles.signupbutton}>
          <img src="./signup-login/signupbutton.png" alt="Signup" />
        </button>

        {erro && <p className={styles.erro}>{erro}</p>}

        <div className={styles.registrar}>
          <p>Já tem uma conta?</p>
          <button onClick={() => navigate("/Login")}>Login</button>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
