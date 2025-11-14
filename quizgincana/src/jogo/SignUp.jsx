import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SignUp.module.css";

function SignUp() {
  return (
    <div className={styles.container}>
      <div className={styles.cont_form}>
        <div className="forms">
          <img src="./signup-login/signupperson.png" alt="usuario" />
          <input type="text" placeholder="Usuario" />
          <img src="./signup-login/signuplockopen.png" alt="cadeado" />
          <input type="text" placeholder="Senha1" />
          <img src="./signup-login/signuplockopen.png" alt="cadeado" />
          <input type="text" placeholder="Senha2" />
        </div>
      </div>
    </div>
  );
}

export default SignUp;
