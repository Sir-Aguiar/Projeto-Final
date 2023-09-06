import React from "react";
import styles from "./Login.module.css";
import { TextField, Checkbox } from "@mui/material";
import LoginBackground from "../../assets/login-bg.jpg";
import logo from "../../assets/logo.png";
const Login: React.FC = () => {
  
	const logIn = async () => {};

	return (
		<div className="w-full h-full flex">
			<div className="flex-1 h-full w-full ">
				<form id="login-form" className={styles.form}>
					<img className={styles.logo} src={logo} />
					<div className={styles.text}>
						<h1>Bem-vindo</h1>
						<p>Entre para ter acesso à nossa plataforma</p>
					</div>
					<div className={styles.inputs}>
						<TextField fullWidth id="outlined-basic" label="Nome de usuário" variant="outlined" />
						<TextField fullWidth id="outlined-basic" label="Senha" type="password" variant="outlined" />
						<div className="w-full flex items-center font-Roboto text-sm text-black-text font-medium">
							<Checkbox size="small" id="remember" />
							<label htmlFor="remember" className="cursor-pointer">
								Lembrar senha
							</label>
						</div>
					</div>

					<button type="submit" className={styles.login} id="login-submiter">
						Entrar
					</button>
					<a href="" className="text-[11px] text-blue-400 underline font-bold">
						Criar conta
					</a>
				</form>
			</div>
			<img src={LoginBackground} alt="" className="mobile:hidden w-1/2 object-cover" />
		</div>
	);
};

export default Login;
