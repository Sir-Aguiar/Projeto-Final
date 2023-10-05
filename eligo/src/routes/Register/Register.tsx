import React, { useEffect, useState } from "react";
import styles from "./Register.module.css";
import { CircularProgress, TextField } from "@mui/material";
import LoginBackground from "../../assets/login-bg.jpg";
import logo from "../../assets/logo.png";
import axios, { AxiosError } from "axios";
import { useIsAuthenticated, useSignIn } from "react-auth-kit";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../components/Toast/Toast";

const Register: React.FC = () => {
  const { notify } = useToast();
  const signIn = useSignIn();

  const [formError, setFormError] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [againPassword, setAgainPassword] = useState("");

  const navigate = useNavigate();

  const signUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (password !== againPassword) {
      return setFormError("As senhas devem ser iguais");
    }

    const nome = e.currentTarget.querySelector<HTMLInputElement>("#nome")?.value;
    const email = e.currentTarget.querySelector<HTMLInputElement>("#email")?.value;

    axios
      .post(`${import.meta.env.VITE_SERVER_URL}/registro`, { nome, email, senha: password })
      .then((res) => {
        signIn({
          token: res.data.token.data,
          tokenType: "Bearer",
          expiresIn: 99 * 99 * 99 * 99,
          authState: { email },
        });
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
        if (error instanceof AxiosError) {
          const response = error.response;

          if (response) {
            return setFormError(response.data.error.message);
          }

          notify({
            title: error.message,
            severity: "error",
          });
        }
        notify({
          title: "Servidor se encontra fora do ar",
          message: "Este problema é completamente do nosso lado. Aguarde alguns instantes",
          severity: "error",
        });
      })

      .finally(() => setLoading(false));
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
              onChange={(e) => {
                if (formError === "Email já em uso") {
                  setFormError("");
                }
              }}
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
                inputProps={{ minLength: 8 }}
              />
              <TextField
                fullWidth
                id="repita-senha"
                label="Confirmar senha"
                type="password"
                variant="outlined"
                inputProps={{ minLength: 8 }}
                onChange={(e) => setAgainPassword(e.target.value)}
                error={againPassword !== password}
                required
              />
            </div>
          </div>
          {formError && <span className="text-[12px] text-red-500 text-start w-full px-1">{formError}</span>}
          <p className={`${styles.register_message}`}>
            <br />
            <a href="/login" className="font-bold text-[#228CE5] underline cursor-pointer hover:brightness-90">
              Já possui uma conta?
            </a>
          </p>

          <button
            disabled={password !== againPassword}
            type="submit"
            className={`${styles.register} bg-blue-gradient`}
            id="register-submiter"
          >
            {isLoading ? <CircularProgress size={25} color="inherit" /> : "Cadastrar"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
