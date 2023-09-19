import React from "react";
import styles from "./Aula.module.css";
import { useAulaContext } from "./RouteStateManager";
import { Checkbox, Divider, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import HistoryIcon from "@mui/icons-material/History";
const Aula: React.FC = () => {
  const {
    Escolas,
    selectedSchool,
    setSelectedSchool,
    Turmas,
    setSelectedClass,
    selectedClass,
    Disciplinas,
    selectedDiscipline,
    setSelectedDiscipline,
    Alunos,
  } = useAulaContext();
  return (
    <div className={styles.content_container}>
      <div className={styles.controllers}>
        <h1 className="font-Montserrat text-center font-medium text-black-text">Informações da Aula</h1>
        <FormControl fullWidth>
          <InputLabel>Escola</InputLabel>
          <Select label="Escola" value={selectedSchool} onChange={(e: any) => setSelectedSchool(e.target.value)}>
            {Escolas.map((escola, index) => (
              <MenuItem key={index} value={escola.idEscola}>
                {escola.nome}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth disabled={Turmas.length < 1}>
          <InputLabel>Turma</InputLabel>
          <Select label="Turma" value={selectedClass} onChange={(e: any) => setSelectedClass(e.target.value)}>
            {Turmas.map((turma, index) => (
              <MenuItem key={index} value={turma.idTurma}>
                {turma.nome}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth disabled={Disciplinas.length < 1}>
          <InputLabel>Disciplina</InputLabel>
          <Select
            label="Disciplina"
            value={selectedDiscipline}
            onChange={(e: any) => setSelectedDiscipline(e.target.value)}
          >
            {Disciplinas.map((disciplina, index) => (
              <MenuItem key={index} value={disciplina.idDisciplina}>
                {disciplina.nome}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Divider className="font-medium text-black-text">Observações</Divider>
        <TextField multiline rows={5} placeholder="(Opcional)" />
        <div className="w-full flex flex-col items-center gap-2">
          <button className="w-full h-[43px] bg-[#2D6DCC] rounded-[3px] font-semibold text-background">
            Iniciar Aula
          </button>
          <span className="text-[10px] flex items-center gap-1 text-black-text underline underline-offset-2 font-medium cursor-pointer">
            Histórico de Aulas <HistoryIcon fontSize="small" />
          </span>
        </div>
      </div>
      {/* <Divider orientation="vertical"/> */}
      <div className={styles.presence_list}>
        <Divider className="font-semibold text-black-text text-lg">Lista de chamada: 23/12/2023</Divider>
        <div className={styles.students_list}>
          {Alunos.length < 1 && <p className="text-center font-medium text-black-text w-full">Nenhum aluno encontrado</p>}
          {Alunos.map((aluno, index) => (
            <div className={styles.student} key={index}>
              <Checkbox />
              {aluno.nome}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Aula;
