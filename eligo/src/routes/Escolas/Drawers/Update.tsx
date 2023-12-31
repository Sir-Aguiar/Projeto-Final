import React, { useEffect } from "react";
import styles from "./Update.module.css";
import { CircularProgress, Divider, Drawer, TextField } from "@mui/material";
import { useEscolasContext } from "../RouteStateManager";
import { AxiosError } from "axios";

const Update: React.FC = () => {
  const { selectedRows, DrawerUpdate, Escolas, handleUpdate, isLoading, setLoading } = useEscolasContext();

  useEffect(() => {
    if (selectedRows.length !== 1) {
      DrawerUpdate.close();
    }
  }, [open]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const nome = e.currentTarget.querySelector<HTMLInputElement>("#nome")?.value;

    await handleUpdate({ nome });
  };

  return (
    <Drawer anchor="right" open={DrawerUpdate.situation} onClose={() => DrawerUpdate.close()}>
      <div className={styles.update_container}>
        <header className="py-1">
          <h1 className="font-bold text-lg">Atualizar Escola</h1>
        </header>
        <Divider />
        <main className="w-full h-full flex flex-col gap-2  overflow-y-auto">
          <form id="update-school" onSubmit={onSubmit} className="py-2">
            <TextField
              fullWidth
              id="nome"
              label="Nome da escola"
              variant="outlined"
              inputProps={{
                maxLength: 145,
              }}
              defaultValue={Escolas.find((escola) => escola.idEscola === selectedRows[0])?.nome}
              required
            />
          </form>
          <Divider />
        </main>
        <Divider />
        <footer className={styles.senders}>
          <button onClick={() => DrawerUpdate.close()} className={styles.cancel}>
            Cancelar
          </button>
          <button className={`${styles.submiter} bg-blue-600`} type="submit" form="update-school">
            {isLoading ? <CircularProgress size={30} color="inherit" /> : "Atualizar"}
          </button>
        </footer>
      </div>
    </Drawer>
  );
};

export default Update;
