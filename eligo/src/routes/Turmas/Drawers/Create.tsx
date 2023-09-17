import React, { useState } from "react";
import styles from "./Create.module.css";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { Divider, Drawer, TextField } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useTurmasContext } from "../RouteStateManager";
import { AxiosError } from "axios";

const ClassToAdd: React.FC = () => {
  const [serie, setSerie] = useState("");
  return (
    <div className="class-to-add w-full flex gap-2">
      <TextField label="Nome da turma" variant="outlined" name="nome-turma" fullWidth inputProps={{ maxLength: 15 }} />
      <FormControl style={{ width: "75%" }}>
        <InputLabel>Série</InputLabel>
        <Select value={serie} name="serie-turma" label="Série" onChange={(e: any) => setSerie(e.target.value)}>
          <MenuItem value="1">1ª Série</MenuItem>
          <MenuItem value="2">2ª Série</MenuItem>
          <MenuItem value="3">3ª Série</MenuItem>
          <MenuItem value="4">4ª Série</MenuItem>
          <MenuItem value="5">5ª Série</MenuItem>
          <MenuItem value="6">6ª Série</MenuItem>
          <MenuItem value="7">7ª Série</MenuItem>
          <MenuItem value="8">8ª Série</MenuItem>
          <MenuItem value="9">9ª Série</MenuItem>
          <MenuItem value="10">1º Ano</MenuItem>
          <MenuItem value="11">2º Ano</MenuItem>
          <MenuItem value="12">3º Ano</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
};

const Create: React.FC = () => {
  const { DrawerCreate, EscolasState, RouteAPI, TokenData } = useTurmasContext();
  const [idEscola, setIdEscola] = useState("");
  const [classesToAdd, setClassesToAdd] = useState<number[]>([]);
  const addClass = () => setClassesToAdd((values) => [...values, 1]);

  const onClose = () => {
    DrawerCreate.close();
    setClassesToAdd([]);
    setIdEscola("");
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const turmas: any[] = [];
    const ClassesContainer = document.querySelector<HTMLDivElement>(".school-classes")!;
    const Classes = ClassesContainer.querySelectorAll<HTMLDivElement>(".class-to-add");

    if (Classes.length <= 0) {
      alert("Insira turmas");
      return;
    }

    Classes?.forEach((addingClass) => {
      const ClassName = addingClass.querySelector<HTMLInputElement>('input[name="nome-turma"]');
      const ClassYear = addingClass.querySelector<HTMLSelectElement>('input[name="serie-turma"]');

      if (!ClassName?.value || !ClassYear?.value) {
        return;
      }
      turmas.push({ nome: ClassName.value, idCurso: Number(ClassYear.value) });
    });

    try {
      await RouteAPI.post(`/turma?idEscola=${idEscola}`, { turmas });
      onClose();
    } catch (error: any) {
      if (error instanceof AxiosError) {
        console.log(error);
        alert(error.response?.data.error.message);
      }
    }
  };

  return (
    <Drawer anchor="right" open={DrawerCreate.situation} onClose={onClose}>
      <div className={styles.insert_container}>
        <header className="py-1">
          <h1 className="font-bold text-lg">Cadastrar Turma</h1>
        </header>
        <Divider />
        <main className="w-full h-full flex flex-col gap-2 overflow-y-auto">
          <form className="py-2 text-start" id="create-class" onSubmit={onSubmit}>
            <FormControl fullWidth>
              <InputLabel>Escola</InputLabel>
              <Select
                value={idEscola}
                id="escola-turma"
                required
                label="Escola"
                onChange={(e: any) => setIdEscola(e.target.value)}
              >
                {EscolasState.map(
                  (escola, index) =>
                    escola.idGestor === TokenData.idUsuario && (
                      <MenuItem value={escola.idEscola} key={index}>
                        {escola.nome}
                      </MenuItem>
                    ),
                )}
              </Select>
            </FormControl>
          </form>
          <Divider />
          <button onClick={addClass} className={styles.class_adder}>
            <AddBoxIcon /> Adicionar turma
          </button>
          <div className="w-full py-2 flex flex-col gap-2 school-classes">
            {classesToAdd.map((num, index) => (
              <ClassToAdd key={index} />
            ))}
          </div>
        </main>
        <Divider />
        <footer className={styles.senders}>
          <button onClick={onClose} className={styles.cancel}>
            Cancelar
          </button>
          <input type="submit" value="Cadastrar" form="create-class" className={styles.submiter} />
        </footer>
      </div>
    </Drawer>
  );
};

export default Create;
