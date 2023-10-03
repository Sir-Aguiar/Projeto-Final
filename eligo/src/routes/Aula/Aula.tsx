import React, { useState } from "react";
import styles from "./Aula.module.css";
import { useAulaContext } from "./RouteStateManager";
import { Checkbox, CircularProgress, Divider, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import HistoryIcon from "@mui/icons-material/History";
import History from "./Modals/History/History";

const Aula: React.FC = () => {
  const {
    Escolas,
    selectedSchool,
    setSelectedSchool,
    Turmas,
    setSelectedClass,
    selectedClass,
    Disciplinas,
    HistoryModal,
    selectedDiscipline,
    setSelectedDiscipline,
    Alunos,
    endClass,
    started,
    startClass,
    studentPresence,
    toggleStudentPresence,
    classObservations,
    setClassObservations,
    classStartTime,
    isLoading
  } = useAulaContext();
  return (
    <div className={styles.content_container}>
      <div className={styles.controllers}>
        <h1 className="text-center font-medium">Informações da Aula</h1>
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
        <div
          className="w-full flex flex-col gap-2 overflow-hidden transition-all duration-500"
          style={{ maxHeight: started ? "200px" : "0" }}
        >
          <Divider className="font-medium">Observações</Divider>
          <TextField
            multiline
            rows={5}
            placeholder="(Opcional)"
            value={classObservations}
            onChange={(e: any) => setClassObservations(e.target.value)}
          />
        </div>
        <div className="w-full flex flex-col items-center gap-2">
          <button
            className={`${styles.starter}`}
            disabled={!selectedSchool || !selectedClass || !selectedDiscipline}
            onClick={started ? () => endClass() : () => startClass()}
          >
            {isLoading ? <CircularProgress size={25} color="inherit" /> : started ? "Encerrar Aula" : "Iniciar Aula"}
          </button>
          <button
            className="disabled:opacity-60 disabled:cursor-not-allowed text-[10px] flex items-center gap-1  underline underline-offset-2 font-medium cursor-pointer"
            onClick={() => HistoryModal.open()}
            disabled={!!started}
          >
            Histórico de Aulas <HistoryIcon fontSize="small" />
          </button>
        </div>
      </div>

      <div className={styles.presence_list}>
        <Divider className="font-medium  text-lg">
          {started
            ? `Lista de chamada: ${classStartTime?.toLocaleString("pt-BR", { dateStyle: "short" })}`
            : "Lista de Alunos"}
        </Divider>
        <div className={styles.students_list}>
          {Alunos.length > 1 && started && (
            <p className={styles.presence_warn}>Marque os alunos para atribuir presença</p>
          )}
          {!selectedSchool ? (
            <p className={styles.presence_warn}>Selecione uma escola</p>
          ) : !selectedClass ? (
            <p className={styles.presence_warn}>Selecione uma turma</p>
          ) : Alunos.length < 1 ? (
            <p className={styles.presence_warn}>Não foram encontrados alunos nesta turma</p>
          ) : (
            Alunos.map((aluno, index) => (
              <div className={`${styles.student} px-2 mobile:${started ? "px-0" : "px-2"}`} key={index}>
                {started && (
                  <Checkbox
                    checked={studentPresence.includes(aluno.idAluno)}
                    onChange={() => toggleStudentPresence(aluno.idAluno)}
                  />
                )}
                {aluno.nome}
              </div>
            ))
          )}
        </div>
      </div>
      <History />
    </div>
  );
};

export default Aula;
