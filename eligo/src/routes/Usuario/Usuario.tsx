import React, { useEffect, useState } from "react";
import styles from "./Usuario.module.css";
import { useUsuarioContext } from "./RouteStateManager";
import UploadImage from "./Modals/UploadImage/UploadImage";
import { CircularProgress, Divider, TextField } from "@mui/material";
import { Edit } from "@mui/icons-material";
import { AxiosError } from "axios";
import { UpdateUser } from "../../services/Usuario";
import { ToUpdateUser } from "../../@types/Usuario";
import { useSignOut } from "react-auth-kit";
import Delete from "./Modals/Delete";

const Usuario: React.FC = () => {
  const { handleFileSelect, handleFileSubmit, Usuario, isLoading, RouteAPI, ModalDelete } = useUsuarioContext();
  const [formError, setFormError] = useState("");
  const [isCurrentPasswordValid, setCurrentPasswordValid] = useState(false);
  const [isFormLoading, setFormLoading] = useState(false);

  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordAgain, setNewPasswordAgain] = useState("");

  const signOut = useSignOut();

  const verifyUserPassword = async () => {
    if (!currentPassword) {
      setCurrentPasswordValid(false);
      setFormError("");
      setNewPassword("");
      setNewPasswordAgain("");
      return;
    }
    if (currentPassword) {
      setFormLoading(true);
      try {
        const response = await RouteAPI.post("/check-password", { senha: currentPassword });
        setCurrentPasswordValid(true);
        setFormError("");
      } catch (error) {
        if (error instanceof AxiosError) {
          const response = error.response;

          if (response) {
            if (response.status === 400) {
              setCurrentPasswordValid(false);
              setFormError("Senha incorreta");
              setNewPassword("");
              setNewPasswordAgain("");
            }
            // Outro erro inesperado
          }
          // Outro erro inesperado
        }
        // Outro erro inesperado
      } finally {
        setFormLoading(false);
      }
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormLoading(true);
    const RequestBody: ToUpdateUser = {};

    if (userName) {
      RequestBody.nome = userName;
    }
    if (userEmail) {
      RequestBody.email = userEmail;
    }

    if (currentPassword && isCurrentPasswordValid) {
      if (newPassword && newPasswordAgain === newPassword) {
        RequestBody.senha = newPassword;
      }
    }

    try {
      const response = await UpdateUser(RouteAPI, RequestBody);
      signOut();
    } catch (error) {
      console.log(error);
    } finally {
      setFormLoading(false);
    }
  };

  useEffect(() => {
    if (Usuario) {
      setUserEmail(Usuario?.email);
      setUserName(Usuario?.nome);
    }
  }, [Usuario]);

  return (
    <div className={styles.content_section}>
      {isLoading ? (
        <CircularProgress size={50} color="primary" sx={{ marginX: "auto" }} />
      ) : (
        Usuario && (
          <>
            <div className={styles.profile_image_section}>
              <img
                src={`${import.meta.env.VITE_SERVER_URL}/profile_images/${Usuario?.profile_image}`}
                className={styles.profile_image}
              />
              <button
                onClick={() => {
                  document.getElementById("file-upload")?.click();
                }}
                className={styles.update}
              >
                Alterar Imagem
              </button>
              <form id="upload-form" encType="multipart/form-data" className="hidden" onSubmit={handleFileSubmit}>
                <input id="file-upload" type="file" onChange={handleFileSelect} accept=".pgn, .jpg, .jpeg" />
              </form>
            </div>
            <form className={styles.user_info_section} onSubmit={handleUpdate}>
              <div className="w-full flex flex-col items-center gap-2">
                <TextField
                  type="text"
                  fullWidth
                  required
                  label="Nome completo"
                  value={userName}
                  name="nome"
                  onChange={(e) => setUserName(e.currentTarget.value)}
                />
                <TextField
                  type="email"
                  fullWidth
                  required
                  label="Email"
                  value={userEmail}
                  name="email"
                  onChange={(e) => setUserEmail(e.currentTarget.value)}
                />
              </div>
              <Divider flexItem className="font-semibold text-sm">
                Redefinir senha
              </Divider>
              <div className="w-full flex flex-col gap-2">
                <div className="flex items-center w-full gap-2">
                  <TextField
                    type="password"
                    fullWidth
                    label="Senha atual"
                    name="senha-atual"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    onBlur={verifyUserPassword}
                  />
                </div>
                <div className="flex items-center w-full gap-2">
                  <TextField
                    type="password"
                    name="senha-nova"
                    fullWidth
                    label="Nova senha"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    onBlur={(e) => {
                      if (e.target.value !== newPasswordAgain) {
                        setFormError("As senhas não coencidem");
                        return;
                      }
                      if (e.target.value === newPasswordAgain) {
                        setFormError("");
                        return;
                      }
                    }}
                    disabled={!isCurrentPasswordValid}
                  />
                  <TextField
                    type="password"
                    name="senha-nova-denovo"
                    fullWidth
                    label="Repita a nova senha"
                    value={newPasswordAgain}
                    onChange={(e) => {
                      setNewPasswordAgain(e.target.value);
                      if (e.target.value !== newPassword) {
                        setFormError("As senhas não coencidem");
                        return;
                      }
                      if (e.target.value === newPassword) {
                        setFormError("");
                        return;
                      }
                    }}
                    disabled={!isCurrentPasswordValid || !newPassword}
                  />
                </div>
              </div>

              {formError && <span className="text-red-500 text-[12px] font-Roboto px-1">{formError}</span>}
              <div className="w-full h-[50px] flex items-center justify-between px-1">
                <span
                  className="text-[12px] text-red-500 underline underline-offset-2 cursor-pointer"
                  onClick={() => ModalDelete.open()}
                >
                  Excluir conta
                </span>
                <button
                  type="submit"
                  className="text-blue-500 font-semibold ml-auto px-6 py-2 rounded-sm bg-blue-100 transition-all"
                  disabled={!!formError || isFormLoading}
                >
                  {isFormLoading ? <CircularProgress size={12} color="primary" sx={{ marginX: "4px" }} /> : "Atualizar"}
                </button>
              </div>
            </form>
            <UploadImage />
            <Delete />
          </>
        )
      )}
    </div>
  );
};

export default Usuario;
