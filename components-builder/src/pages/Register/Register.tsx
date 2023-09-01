import React from "react";
import styles from "./Register.module.css";
import { TextField } from "@mui/material";
import LoginBackground from "../../assets/login-bg.jpg";
import logo from "../../assets/logo.png";

const Register: React.FC = () => {
	return (
		<div className="w-full h-full flex">
			<img src={LoginBackground} alt="" className="mobile:hidden w-1/2 object-cover" />
			<div className={styles.content_container}>
				<form id="register-form" className={styles.form}>
					<header>
						<img className={styles.logo} src={logo} />
						<h1>Super rápido e fácil de criar sua conta</h1>
					</header>

					<div className={styles.input_container}>
						<TextField fullWidth id="outlined-basic" label="Nome completo" variant="outlined" />
						<TextField fullWidth id="outlined-basic" label="Email" type="email" variant="outlined" />
						<TextField fullWidth id="outlined-basic" label="Nome de usuário" variant="outlined" />
						<div className="w-full flex items-center gap-1">
							<TextField fullWidth id="outlined-basic" label="Senha" type="password" variant="outlined" />
							<TextField fullWidth id="outlined-basic" label="Confirmar senha" type="password" variant="outlined" />
						</div>
					</div>

					<p className={`${styles.register_message}`}>
						Lorem ipsum dolor sit amet, consectetur cras amet.
						<br />
						<a className="font-bold text-[#228CE5] underline">Já possui uma conta?</a>
					</p>

					<button type="submit" className={styles.register} id="register-submiter">
						Cadastrar
					</button>
				</form>
			</div>
		</div>
	);
};

export default Register;
