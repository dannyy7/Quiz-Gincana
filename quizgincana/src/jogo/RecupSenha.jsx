import { useState } from "react";
import styles from "./RecupSenha.module.css";

function RecupSenha() {

    const [email, setEmail] = useState("")


    return(
        <div className={styles.container}>
              <div className={styles.cont_form}>
                <h2>Recuperar Senha</h2>
                <p>Email</p>
                <div className={styles.forms}>
                  <img src="./signup-login/enteremail.png" alt="email" className={styles.emailimg} />
                  <input
                    type="text"
                    placeholder="Digite seu Email"
                    className={styles.loginbox}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
        
                
              </div>
            </div>
    )

}

export default RecupSenha;