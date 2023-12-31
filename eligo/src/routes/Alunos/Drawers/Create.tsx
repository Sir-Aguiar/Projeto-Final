import React, { useEffect, useState } from "react";
import styles from "./Create.module.css";
import { CircularProgress, Divider, Drawer, TextField } from "@mui/material";
import { useAlunosContext } from "../RouteStateManager";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import { AxiosError } from "axios";

const Create: React.FC = () => {
  const {
    DrawerCreate,
    Escolas,
    Turmas,
    showClasses,
    TokenData,
    selectedClass,
    selectedSchool,
    handleCreate,
    isLoading,
  } = useAlunosContext();

  const [idEscola, setIdEscola] = useState("");
  const [idTurma, setIdTurma] = useState("");

  const onClose = async () => {
    DrawerCreate.close();
    setIdEscola("");
    setIdTurma("");
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const AlunoNome = e.currentTarget.querySelector<HTMLInputElement>("#aluno-nome");

    if (!AlunoNome) {
      alert("Erro inesperado");
      return;
    }

    await handleCreate({ idTurma: Number(idTurma), nome: AlunoNome!.value });
    await onClose();
  };

  useEffect(() => {
    if (DrawerCreate.situation) {
      setIdEscola(selectedSchool);
      setIdTurma(selectedClass);
    }
  }, [DrawerCreate.situation]);

  return (
    <Drawer anchor="right" open={DrawerCreate.situation} onClose={() => DrawerCreate.close()}>
      <div className={styles.insert_container}>
        <header className="py-1">
          <h1 className="font-bold text-lg text-center">Cadastrar Aluno</h1>
        </header>
        <Divider />
        <main className="w-full h-full flex flex-col gap-2 overflow-y-auto">
          <form className={styles.formulary} id="create-student" onSubmit={onSubmit}>
            <FormControl fullWidth>
              <InputLabel>Escola</InputLabel>
              <Select
                value={idEscola}
                required
                label="Escola"
                onChange={(e: any) => {
                  setIdEscola(e.target.value);
                  showClasses(Number(e.target.value));
                }}
              >
                {Escolas.map(
                  (escola, index) =>
                    escola.idGestor === TokenData.idUsuario && (
                      <MenuItem value={escola.idEscola} key={index}>
                        {escola.nome}
                      </MenuItem>
                    ),
                )}
              </Select>
            </FormControl>
            <FormControl fullWidth disabled={Turmas.length < 1}>
              <InputLabel>Turma</InputLabel>
              <Select
                value={idTurma}
                id="aluno-turma"
                required
                label="Turma"
                onChange={(e: any) => setIdTurma(e.target.value)}
              >
                {Turmas.length > 0
                  ? Turmas.map((turma, index) => (
                      <MenuItem value={turma.idTurma} key={index}>
                        {turma.nome}
                      </MenuItem>
                    ))
                  : ""}
              </Select>
            </FormControl>
            <Divider />
            <TextField
              label="Nome do aluno"
              variant="outlined"
              id="aluno-nome"
              fullWidth
              required
              inputProps={{ maxLength: 50 }}
            />
          </form>
        </main>
        <footer className={styles.senders}>
          <button onClick={() => DrawerCreate.close()} className={styles.cancel}>
            Cancelar
          </button>
          <button type="submit" form="create-student" className={`${styles.submiter} bg-blue-600`}>
            {isLoading ? <CircularProgress size={25} color="inherit" /> : "Cadastrar"}
          </button>
        </footer>
      </div>
    </Drawer>
  );
};

export default Create;
