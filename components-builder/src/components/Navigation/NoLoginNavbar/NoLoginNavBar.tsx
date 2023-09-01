import React from "react";
import styles from "./NoLoginNavBar.module.css";
import LogoBlack from "../../../assets/logo-black.svg";
const NoLoginNavbar: React.FC = () => {
	return (
		<nav className={styles.navigation_container}>
			<img src={LogoBlack} className="max-h-[30px] hover:drop-shadow-logo cursor-pointer" />
			<div className={styles.CTAs}>
				<button className={styles.register}>Criar conta</button>
				<button className={styles.login}>Entrar</button>
			</div>
		</nav>
	);
};

export default NoLoginNavbar;
