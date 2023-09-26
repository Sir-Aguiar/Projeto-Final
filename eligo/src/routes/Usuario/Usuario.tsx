import React from "react";
import styles from "./Usuario.module.css";
import { TextField } from "@mui/material";
import { useUsuarioContext } from "./RouteStateManager";
import Delete from "./Modals/Delete";

const Usuario: React.FC = () => {
  const { fullName, email, setEmail, setFullName, RouteAPI, ModalDelete } = useUsuarioContext();

  const handleUpdate = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    try {
      await RouteAPI.put("/usuario", {
        nome: fullName,
        email,
      });
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.content_section}>
      <div className={styles.data_container}>
        <h1 className="font-semibold font-Montserrat ">Informações de Usuário</h1>
        <div className={styles.dater}>
          <div className={styles.input_container}>
            <TextField
              fullWidth
              type="email"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              label="Nome completo"
            />
            <TextField fullWidth type="email" value={email} onChange={(e) => setEmail(e.target.value)} label="Email" />
          </div>
          <button className={styles.sender} onClick={handleUpdate}>
            Alterar
          </button>
          <button
            onClick={() => ModalDelete.open()}
            className="py-3 text-[12px] text-red-500 text-opacity-75 font-semibold font-Montserrat"
          >
            Apagar conta
          </button>
        </div>
      </div>
      <Delete />
    </div>
  );
};

export default Usuario;
