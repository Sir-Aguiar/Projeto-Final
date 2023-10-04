import React, { useEffect, useState } from "react";
import styles from "./AddDiscipline.module.css";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { CircularProgress, Divider, Drawer, TextField } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { AxiosError } from "axios";
import { useEscolaContext } from "../../RouteStateManager";

const CourseToAdd: React.FC = () => {
  const [serie, setSerie] = useState("");
  return (
    <div className="w-full flex gap-2 text-start">
      <FormControl fullWidth>
        <InputLabel>Série</InputLabel>
        <Select value={serie} name="serie-disciplina" label="Série" onChange={(e: any) => setSerie(e.target.value)}>
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

const AddDiscipline: React.FC = () => {
  const { DisciplineDrawer, handleCreateDiscipline, isLoading } = useEscolaContext();
  const [courseToAdd, setCourseToAdd] = useState<number[]>([1]);
  const addCourse = () => setCourseToAdd((values) => [...values, 1]);

  const onClose = () => {
    DisciplineDrawer.close();
    setCourseToAdd([1]);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const nome = document.querySelector<HTMLInputElement>('input[name="nome-disciplina"]');

    const cursos: number[] = [];
    const Courses = document.querySelectorAll<HTMLInputElement>('input[name="serie-disciplina"]');

    Courses.forEach((idCurso) => {
      if (!idCurso.value) {
        return;
      }
      if (cursos.includes(Number(idCurso.value))) return;
      cursos.push(Number(idCurso.value));
    });

    if (cursos.length < 1) {
      alert("Por favor, insira cursos a serem associados");
      return;
    }

    await handleCreateDiscipline(nome!.value, cursos);
    onClose();
  };

  return (
    <Drawer anchor="right" open={DisciplineDrawer.situation} onClose={onClose}>
      <div className={styles.insert_container}>
        <header className="py-1">
          <h1 className="font-bold text-lg">Adicionar Disciplina</h1>
        </header>
        <Divider />
        <main className="w-full h-full flex flex-col gap-2 overflow-y-auto">
          <form className="py-2 text-start" id="create-discipline" onSubmit={onSubmit}>
            <TextField
              label="Nome da disciplina"
              variant="outlined"
              name="nome-disciplina"
              fullWidth
              inputProps={{ maxLength: 50 }}
              required
            />
          </form>
          <Divider />
          <div className="w-full py-2 flex flex-col gap-2">
            <span className="text-[10px] font-light text-black-smooth">Vincule esta disciplina à um ou mais cursos</span>
            {courseToAdd.map((num, index) => (
              <CourseToAdd key={index} />
            ))}
          </div>
          <button onClick={addCourse} className={styles.grid_adder}>
            <AddBoxIcon /> Adicionar Curso
          </button>
        </main>
        <Divider />
        <footer className={styles.senders}>
          <button onClick={onClose} className={styles.cancel}>
            Cancelar
          </button>
          <button type="submit" form="create-discipline" className={`${styles.submiter} bg-blue-600`}>
            {isLoading ? <CircularProgress size={25} color="inherit" /> : "Cadastrar"}
          </button>
        </footer>
      </div>
    </Drawer>
  );
};

export default AddDiscipline;
