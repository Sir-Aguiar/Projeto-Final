import React from "react";
import styles from "./NavBar.module.css";
import LogoBlack from "../../../assets/logo-black.svg";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
const Navbar: React.FC = () => {
	const toggleNavbar = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		const menu = document.querySelector(`.${styles.mobile_menu}`);
		menu?.classList.toggle(styles.active);
		const navbar = document.querySelector(`.${styles.nav_options}`);
		navbar?.classList.toggle(styles.active);
	};
	return (
		<nav className={styles.navigation_container}>
			<img src={LogoBlack} className="max-h-[30px] hover:drop-shadow-logo cursor-pointer" />
			<div className={styles.nav_options}>
				<div className={styles.search_bar}>
					<input type="text" placeholder="Nome do aluno" />
					<PersonSearchIcon />
				</div>
				<div className={styles.navigations}>
					<a href="">Turmas</a>
					<a href="">Escolas</a>
					<a href="">Alunos</a>
				</div>
				<div className={styles.profile}>
					<AccountCircleIcon />
				</div>
			</div>
			<div className={styles.mobile_menu} onClick={toggleNavbar}>
				<div className={styles.line1}></div>
				<div className={styles.line2}></div>
				<div className={styles.line3}></div>
			</div>
		</nav>
	);
};

export default Navbar;
