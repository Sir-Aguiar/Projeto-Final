import React, { useEffect, useState } from "react";
import styles from "./AddGrid.module.css";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { Divider, Drawer, TextField } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { AxiosError, AxiosInstance } from "axios";
import { useEscolaContext } from "../../../RouteStateManager";
import Modal from "@mui/material/Modal";
import { CreateDisciplineGrid } from "../../../../../services/CursoDisciplina";
import { useParams } from "react-router-dom";

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

type Props = {
  onClose: () => Promise<void>;
  situation: boolean;
  RouteAPI: AxiosInstance;
};

const AddGrid: React.FC<Props> = ({ onClose, situation, RouteAPI }) => {
  const { idEscola } = useParams();
  const { DisciplinesData } = useEscolaContext();
  const [idDisciplina, setIdDisciplina] = useState("");
  const [courseToAdd, setCourseToAdd] = useState<number[]>([1]);
  const addCourse = () => setCourseToAdd((values) => [...values, 1]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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

    try {
      await CreateDisciplineGrid(RouteAPI, Number(idEscola), Number(idDisciplina), cursos);
    } catch (error) {
      console.log(error);
    }

    onClose();
  };

  useEffect(() => {
    if (!situation) {
      setIdDisciplina("");
      setCourseToAdd([1]);
    }
  }, [situation]);

  return (
    <Modal open={situation} onClose={onClose}>
      <div className={styles.insert_container}>
        <header className="py-1">
          <h1 className="font-bold text-lg">Adicionar Grade</h1>
        </header>
        <Divider />
        <main className="w-full h-full flex flex-col gap-2 overflow-y-auto">
          <form className="py-2 text-start" id="create-grid" onSubmit={onSubmit}>
            <FormControl fullWidth>
              <InputLabel>Disciplina</InputLabel>
              <Select
                value={idDisciplina}
                name="disciplina"
                label="Disciplina"
                onChange={(e: any) => setIdDisciplina(e.target.value)}
              >
                {DisciplinesData.map((disciplina, index) => (
                  <MenuItem value={disciplina.idDisciplina} key={index}>
                    {disciplina.nome}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </form>
          <Divider />
          <div className="w-full py-2 flex flex-col gap-2">
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
          <input type="submit" value="Cadastrar" form="create-grid" className={styles.submiter} />
        </footer>
      </div>
    </Modal>
  );
};

export default AddGrid;
