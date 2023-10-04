import React, { useState, useEffect } from "react";
import styles from "./Update.module.css";
import { CircularProgress, Divider, Drawer, TextField } from "@mui/material";
import { useAlunosContext } from "../RouteStateManager";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";

const Update: React.FC = () => {
  const { DrawerUpdate, Turmas, selectedRows, Alunos, isLoading, handleUpdate } = useAlunosContext();

  const [idTurma, setIdTurma] = useState("");
  const [nomeAluno, setNomeAluno] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await handleUpdate(nomeAluno);
    setIdTurma("")
    setNomeAluno("")
    DrawerUpdate.close();
  };

  useEffect(() => {
    if (DrawerUpdate.situation && selectedRows.length === 1) {
      const foundStudent = Alunos.find((aluno) => aluno.idAluno === selectedRows[0]);
      const foundClass = Turmas.find((turma) => turma.idTurma === foundStudent?.turma.idTurma)!;
      setIdTurma(String(foundClass.idTurma));
      setNomeAluno(foundStudent!.nome);
    }
  }, [DrawerUpdate.situation]);

  return (
    <Drawer anchor="right" open={DrawerUpdate.situation} onClose={() => DrawerUpdate.close()}>
      <div className={styles.update_container}>
        <header className="py-1">
          <h1 className="font-bold text-lg text-center">Atualizar Aluno</h1>
        </header>
        <Divider />
        <main className="w-full h-full flex flex-col gap-2 overflow-y-auto">
          <form className={styles.formulary} id="update-student" onSubmit={onSubmit}>
            <FormControl fullWidth disabled={Turmas.length < 1}>
              <InputLabel>Turma</InputLabel>
              <Select value={idTurma} disabled required label="Turma" onChange={(e: any) => setIdTurma(e.target.value)}>
                {Turmas.length > 0
                  ? Turmas.map((turma, index) => (
                      <MenuItem value={turma.idTurma} key={index}>
                        {turma.nome}
                      </MenuItem>
                    ))
                  : ""}
              </Select>
            </FormControl>
            <TextField
              label="Nome do aluno"
              variant="outlined"
              fullWidth
              inputProps={{ maxLength: 45 }}
              value={nomeAluno}
              onChange={(e: any) => setNomeAluno(e.target.value)}
              required
            />
          </form>
        </main>
        <footer className={styles.senders}>
          <button onClick={() => DrawerUpdate.close()} className={styles.cancel}>
            Cancelar
          </button>
          <button type="submit" form="update-student" className={`${styles.submiter} bg-blue-600`}>
            {isLoading ? <CircularProgress size={25} color="inherit" /> : "Atualizar"}
          </button>
        </footer>
      </div>
    </Drawer>
  );
};

export default Update;
