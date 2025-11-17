import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SignUp.module.css";


function SignUp() {
  const[icon, setIcon] =useState("./signup-login/enterlockclosed.png")
  const[tipo, setTipo] = useState("password")
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
      <div className={styles.cont_form}>
          <p>nome de usuário</p>
          <div className={styles.forms}>
           <img src="./signup-login/signupperson.png" alt="usuario"  />
            <input type="text" placeholder="Digite seu usuario" className={styles.loginbox} />
          </div>
          <p>email</p>
          <div className={styles.forms}>
           <img src="./signup-login/signupperson.png" alt="usuario"/>
            <input type="text" placeholder="Digite seu email" className={styles.loginbox} />
          </div>
          <p>senha</p>
          <div className={styles.forms}> 
            <button onClick={()=>ocultarsenha()}  className={styles.iconimg}><img src={icon} alt="cadeado" /></button>
            <input type={tipo} placeholder="Digite sua senha" className={styles.loginbox}/>
          </div>
    
      </div>
    </div>
  );
}

export default SignUp;
