import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css"

function Login(){

    const navigate = useNavigate()
    const[icon, setIcon] =useState("./signup-login/enterlockclosed.png")
    const[tipo, setTipo] = useState("password")

    //criar component
    function ocultarsenha() {
        setTipo(prev => {
          if (prev === "password") {
            setIcon("./signup-login/enterlockopen.png");
            return "text";
          } else {
            setIcon("./signup-login/enterlockclosed.png");
            return "password";
          }
        });
      }

    return (
        <div className={styles.container}>
            <div className={styles.cont_forrm}>
                <p>Email</p>
                <div className={styles.forms}>
                    <img src="./signup-login/enteremail.png" alt="email" />
                    <input type="text" placeholder="Digite seu Email"/>
                </div>
            </div>
            <div className={styles.cont_forrm}>
                <p>Senha</p>
                <div className={styles.forms}>
                    <button onClick={()=>ocultarsenha()} className={styles.iconimg}> <img src={icon} alt="cadeado" /></button>
                    <input type={tipo} placeholder="Digite seu Email" className={styles.loginbox}/>
                </div>
            </div>

            <div className={styles.registrar}>
                <p>Não tem uma conta?</p>
                <button onClick={()=> navigate("/SignUp")}>SignUp</button>
            </div>
        </div>
    )
}

export default Login