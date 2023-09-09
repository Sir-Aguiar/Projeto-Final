import React from "react";
import styles from "./NoLoginNavBar.module.css";
import LogoBlack from "../../../assets/logo-black.svg";
import { useNavigate } from "react-router-dom";
const NoLoginNavbar: React.FC = () => {
  const navigate = useNavigate();
  return (
    <nav className={styles.navigation_container}>
      <img src={LogoBlack} className="max-h-[30px] hover:drop-shadow-logo cursor-pointer" />
      <div className={styles.CTAs}>
        <button className={styles.register} onClick={() => navigate("/registro")}>
          Criar conta
        </button>
        <button className={styles.login} onClick={() => navigate("/login")}>
          Entrar
        </button>
      </div>
    </nav>
  );
};

export default NoLoginNavbar;
