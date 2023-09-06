import React from "react";
import styles from "./Login.module.css";
import { TextField, Checkbox } from "@mui/material";
import LoginBackground from "../../assets/login-bg.jpg";
import logo from "../../assets/logo.png";
import axios from "axios";
import { useSignIn } from "react-auth-kit";
import { useNavigate } from "react-router-dom";
const Login: React.FC = () => {
	const signIn = useSignIn();
	const navigate = useNavigate();
	const logIn = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const login = e.currentTarget.querySelector("#login") as HTMLInputElement;
		const senha = e.currentTarget.querySelector("#senha") as HTMLInputElement;

		const userData = {
			login: login.value,
			senha: senha.value,
		};

		axios
			.post("http://localhost:8080/login", {
				...userData,
			})
			.then((res) => {
				if (
					signIn({
						token: res.data.token,
						tokenType: "Bearer",
						expiresIn: 80000,
						authState: {
							login,
						},
					})
				) {
					navigate("/");
				}
			});
	};

	return (
		<div className="w-full h-full flex">
			<div className="flex-1 h-full w-full ">
				<form id="login-form" className={styles.form} onSubmit={logIn}>
					<img className={styles.logo} src={logo} />
					<div className={styles.text}>
						<h1>Bem-vindo</h1>
						<p>Entre para ter acesso à nossa plataforma</p>
					</div>
					<div className={styles.inputs}>
						<TextField fullWidth id="login" label="Nome de usuário" variant="outlined" />
						<TextField fullWidth id="senha" label="Senha" type="password" variant="outlined" />
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
