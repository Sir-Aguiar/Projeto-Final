import React, { useEffect, useState } from "react";
import styles from "./Register.module.css";
import { TextField } from "@mui/material";
import LoginBackground from "../../assets/login-bg.jpg";
import logo from "../../assets/logo.png";
import axios, { AxiosError } from "axios";
import { useIsAuthenticated } from "react-auth-kit";
import { useNavigate } from "react-router-dom";

const Register: React.FC = () => {
  const [password, setPassword] = useState("");
  const [againPassword, setAgainPassword] = useState("");

  const navigate = useNavigate();
  const isUserAuthenticated = useIsAuthenticated();

  useEffect(() => {
    if (isUserAuthenticated()) {
      navigate("/");
    }
  }, [isUserAuthenticated()]);

  if (isUserAuthenticated()) return <></>;

  const signUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== againPassword) {
      alert("Digita senha igual porra");
      return;
    }
    const nome = e.currentTarget.querySelector<HTMLInputElement>("#nome")?.value;
    const email = e.currentTarget.querySelector<HTMLInputElement>("#email")?.value;
    const senha = e.currentTarget.querySelector<HTMLInputElement>("#senha")?.value;

    if (password !== senha) {
      alert("ERRO");
      return;
    }

    axios
      .post(`${import.meta.env.VITE_SERVER_URL}/registro`, { nome, email, senha })
      .then((res) => {
        window.location.href = "/login";
      })
      .catch((error) => {
        console.log(error);
        if (error instanceof AxiosError) {
          const responseError = error.response;
          alert(responseError?.data.error.message);
        }
      });
  };

  return (
    <div className="w-full h-full flex">
      <img src={LoginBackground} alt="" className="mobile:hidden w-1/2 object-cover" />
      <div className={styles.content_container}>
        <form id="register-form" className={styles.form} onSubmit={signUp}>
          <header>
            <img className={styles.logo} src={logo} />
            <h1>Super rápido e fácil de criar sua conta</h1>
          </header>

          <div className={styles.input_container}>
            <TextField
              fullWidth
              id="nome"
              label="Nome completo"
              variant="outlined"
              inputProps={{ maxLength: 45 }}
              required
            />
            <TextField
              fullWidth
              id="email"
              label="Email"
              type="email"
              variant="outlined"
              inputProps={{ maxLength: 255 }}
              required
            />
            <div className="w-full flex items-center gap-1">
              <TextField
                fullWidth
                id="senha"
                label="Senha"
                type="password"
                variant="outlined"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <TextField
                fullWidth
                id="repita-senha"
                label="Confirmar senha"
                type="password"
                variant="outlined"
                onChange={(e) => setAgainPassword(e.target.value)}
                error={againPassword !== password}
                required
              />
            </div>
          </div>

          <p className={`${styles.register_message}`}>
            {/* Lorem ipsum dolor sit amet, consectetur cras amet. */}
            <br />
            <a href="/login" className="font-bold text-[#228CE5] underline cursor-pointer hover:brightness-90">
              Já possui uma conta?
            </a>
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
