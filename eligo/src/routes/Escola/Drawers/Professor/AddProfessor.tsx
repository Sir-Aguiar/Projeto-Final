import React, { useEffect, useMemo, useState } from "react";
import styles from "./AddProfessor.module.css";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { Divider, Drawer, TextField } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { AxiosError } from "axios";
import { useEscolaContext } from "../../RouteStateManager";
import Turmas from "../../../Turmas/Turmas";

const NewAssociation: React.FC<{ turmas: any[]; disciplinas: any[] }> = ({ turmas, disciplinas }) => {
  const [idTurma, setIdTurma] = useState("");
  const [idDisciplina, setIdDisciplina] = useState("");

  const avaliableDisciplines = useMemo(() => {
    if (!idTurma) {
      return [];
    }
    const selectedClass = turmas.find((turma) => turma.idTurma === idTurma);
    return disciplinas.filter((disciplina) => disciplina.curso.idCurso === selectedClass.idCurso);
  }, [idTurma]);

  useEffect(() => {
    if (!disciplinas || disciplinas.length < 1) {
      setIdDisciplina("");
    }
    if (!turmas || turmas.length < 1) {
      setIdTurma("");
    }
  }, [disciplinas, turmas]);

  return (
    <div className="w-full flex gap-1 relations-to-add text-start">
      <FormControl style={{ width: "75%" }}>
        <InputLabel>Turma</InputLabel>
        <Select value={idTurma} name="professor-turma" label="Turma" onChange={(e: any) => setIdTurma(e.target.value)}>
          {turmas.map((turma, index) => (
            <MenuItem value={turma.idTurma} key={index}>
              {turma.nome}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl
        fullWidth
        disabled={avaliableDisciplines.length < 1}
        title="Nenhuma disciplina encontrada para esta turma"
      >
        <InputLabel>Disciplina</InputLabel>
        <Select
          value={idDisciplina}
          name="professor-disciplina"
          label="Disciplina"
          onChange={(e: any) => setIdDisciplina(e.target.value)}
        >
          {avaliableDisciplines.map((disciplina, index) => (
            <MenuItem value={disciplina.idDisciplina} key={index}>
              {disciplina.nome}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

const AddProfessor: React.FC = () => {
  const { ProfessorDrawer, ProfessorsData, RouteAPI, SchoolData, DisciplinesData, GridData } = useEscolaContext();
  const [Turmas, setTurmas] = useState<any[]>([]);
  const [associationsToAdd, setAssociations] = useState([0]);
  const addAssociation = () => {
    setAssociations((values) => [...values, 1]);
  };
  useEffect(() => {
    if (ProfessorDrawer.situation) {
      RouteAPI.get(`/turma?idEscola=${SchoolData.idEscola}`).then((res) => setTurmas(res.data.turmas));
    }
  }, [ProfessorDrawer.situation]);

  const onClose = async () => {
    setAssociations([0]);
    setTurmas([]);
    ProfessorDrawer.close();
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const emailProfessor = e.currentTarget.querySelector<HTMLInputElement>('input[name="professor-email"]')?.value;
    const relacoes: any[] = [];
    const RelationsContainer = document.querySelectorAll(".relations-to-add");

    RelationsContainer.forEach((relation) => {
      const idTurma = relation.querySelector<HTMLInputElement>('input[name="professor-turma"]')?.value;
      const idDisciplina = relation.querySelector<HTMLInputElement>('input[name="professor-disciplina"]')?.value;
      if (!idTurma || !idDisciplina) {
        alert("Preencha todos os campos inseridos");
        return;
      }
      relacoes.push({ idDisciplina, idTurma });
    });

    for (const relacao of relacoes) {
      try {
        const { idDisciplina, idTurma } = relacao;
        await RouteAPI.post(`/professor-leciona`, {
          email: emailProfessor,
          idDisciplina,
          idTurma,
        });
      } catch (error: any) {
        console.log(error);
        if (error instanceof AxiosError) {
          alert(error.response?.data.error.message);
        }
      }
    }
    onClose();
  };

  return (
    <Drawer anchor="right" open={ProfessorDrawer.situation} onClose={onClose}>
      <div className={styles.insert_container}>
        <header className="py-1">
          <h1 className="font-bold text-lg">Vincular Professor</h1>
        </header>
        <Divider />
        <main className="w-full h-full gap-2 flex flex-col overflow-y-auto">
          <form className="py-2" id="create-class" onSubmit={onSubmit}>
            <TextField
              label="Email do professor"
              variant="outlined"
              type="email"
              name="professor-email"
              fullWidth
              required
              inputProps={{ maxLength: 255 }}
            />
          </form>
          <Divider />
          {associationsToAdd.map((num, index) => (
            <NewAssociation key={index} disciplinas={GridData} turmas={Turmas} />
          ))}
          <button onClick={addAssociation} className={styles.class_adder}>
            <AddBoxIcon /> Adicionar
          </button>
        </main>
        <Divider />
        <footer className={styles.senders}>
          <button onClick={onClose} className={styles.cancel}>
            Cancelar
          </button>
          <input type="submit" value="Enviar" form="create-class" className={styles.submiter} />
        </footer>
      </div>
    </Drawer>
  );
};

export default AddProfessor;
