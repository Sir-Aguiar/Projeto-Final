import React, { useEffect, useState } from "react";
import styles from "./UpdateDiscipline.module.css";
import { Divider, Drawer, TextField } from "@mui/material";
import { AxiosError } from "axios";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Modal from "@mui/material/Modal";

type Props = {
  onClose: () => Promise<void>;
  situation: boolean;
  disciplina: {
    nome: string;
    idDisciplina: number;
  };
  handleUpdate: (data: { nome: string }) => Promise<void>;
};

const UpdateDiscipline: React.FC<Props> = ({ disciplina, onClose, situation, handleUpdate }) => {
  const [nomeDisciplina, setNomeDisciplina] = useState("");

  useEffect(() => {
    if (situation) {
      if (!disciplina) {
        onClose();
        return;
      }
      setNomeDisciplina(disciplina.nome);
    }
  }, [situation]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await handleUpdate({ nome: nomeDisciplina });
  };

  return (
    <Modal open={situation} onClose={onClose}>
      <div className={styles.update_container}>
        <header className="py-1">
          <h1 className="font-bold text-lg">Atualizar Turma</h1>
        </header>
        <Divider />
        <main className="w-full flex flex-col gap-2 ">
          <form id="update-discipline" onSubmit={onSubmit} className="py-2">
            <TextField
              label="Nome da turma"
              variant="outlined"
              fullWidth
              inputProps={{ maxLength: 50 }}
              value={nomeDisciplina}
              onChange={(e: any) => setNomeDisciplina(e.target.value)}
              required
            />
          </form>
        </main>
        <footer className={styles.senders}>
          <button onClick={onClose} className={styles.cancel}>
            Cancelar
          </button>
          <input type="submit" value="Atualizar" form="update-discipline" className={styles.submiter} />
        </footer>
      </div>
    </Modal>
  );
};

export default UpdateDiscipline;
