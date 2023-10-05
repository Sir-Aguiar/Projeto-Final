import React, { useEffect, useState } from "react";
import styles from "./Login.module.css";
import { TextField, Checkbox, CircularProgress } from "@mui/material";
import LoginBackground from "../../assets/login-bg.jpg";
import logo from "../../assets/logo.png";
import axios, { AxiosError } from "axios";
import { useIsAuthenticated, useSignIn } from "react-auth-kit";
import { Navigate, useNavigate } from "react-router-dom";
import { useToast } from "../../components/Toast/Toast";

const Login: React.FC = () => {
  const signIn = useSignIn();
  const navigate = useNavigate();
  const isUserAuthenticated = useIsAuthenticated();
  const [formError, setFormError] = useState("");
  const [isLoading, setLoading] = useState(false);
  const { notify } = useToast();

  if (isUserAuthenticated()) return <Navigate to="/"></Navigate>;

  const logIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const email = e.currentTarget.querySelector("#email") as HTMLInputElement;
    const senha = e.currentTarget.querySelector("#senha") as HTMLInputElement;

    const userData = {
      email: email.value,
      senha: senha.value,
    };

    axios
      .post(`${import.meta.env.VITE_SERVER_URL}/login`, userData)
      .then((res) => {
        if (
          signIn({
            token: res.data.token.data,
            tokenType: "Bearer",
            expiresIn: 99 * 99 * 99 * 99,
            authState: { email },
          })
        ) {
          navigate("/");
        } else {
          alert("Rolou algum erro");
          return;
        }
      })
      .catch((error) => {
        console.log(error);
        if (error instanceof AxiosError) {
          const response = error.response;
          if (response) {
            setFormError(response.data.error.message);
            return;
          }
          if (error.message === "Network Error") {
            return notify({
              title: "Servidor se encontra fora do ar",
              message: "Tente novamente em alguns instantes",
              severity: "error",
            });
          }
          return notify({
            title: error.message,
            severity: "error",
          });
        }
        notify({
          title: "Este erro não é esperado, atualize a página e tente novamente",
          message: error.message,
          severity: "error",
        });
      })
      .finally(() => {
        setLoading(false);
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
            <TextField required fullWidth id="email" type="email" label="Nome de usuário" variant="outlined" />
            <TextField required fullWidth id="senha" label="Senha" type="password" variant="outlined" />
            {formError && <span className="text-[12px] text-red-500 text-start w-full">{formError}</span>}
          </div>

          <button type="submit" className={`${styles.login} bg-blue-500`} id="login-submiter">
            {isLoading ? <CircularProgress size={25} color="inherit" /> : "Entrar"}
          </button>
          <a href="/registro" className="text-[11px] text-blue-400 underline font-bold">
            Criar conta
          </a>
        </form>
      </div>
      <img src={LoginBackground} alt="" className="mobile:hidden w-1/2 object-cover" />
    </div>
  );
};

export default Login;
