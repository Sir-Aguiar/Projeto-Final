import React, { useState, useEffect } from "react";
import styles from "./ProfessorModal.module.css";
import Modal from "@mui/material/Modal";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { Fade, Checkbox, Divider, TextField } from "@mui/material";
import { useEscolaContext } from "../../RouteStateManager";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { AxiosError } from "axios";
import GppMaybeIcon from "@mui/icons-material/GppMaybe";
import DeleteIcon from "@mui/icons-material/Delete";

const ModalProfessor: React.FC = () => {
  const { ProfessorModal, ProfessorsData, RouteAPI, loadProfessorData, DisciplinesData, Classes } = useEscolaContext();
  const [selectedProfessor, setSelectedProfessor] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedDiscipline, setSelectedDiscipline] = useState("");
  const [selectedRows, setSelectedRow] = useState<number[]>([]);
  const [isDeleteOpen, setDeleteOpen] = useState(false);

  const selectRow = (idLeciona: number) => {
    setSelectedRow((values) => {
      let newValues: number[];

      if (values.includes(idLeciona)) {
        newValues = values.filter((value) => value !== idLeciona);
      } else {
        newValues = [...values, idLeciona];
      }
      /*       if (newValues.length === 1) {
        showClassStudents(newValues[0]);
      } else {
        setAlunoTurma([]);
      } */
      return newValues;
    });
  };

  const onClose = async () => {
    setSelectedClass("");
    setSelectedDiscipline("");
    setSelectedProfessor("");
    setSelectedRow([]);
    ProfessorModal.close();
  };

  const handleDelete = async () => {
    try {
      for (const idLeciona of selectedRows) {
        const { turma, disciplina, idProfessor } = ProfessorsData.find(
          (professor) => professor.idLeciona === idLeciona,
        )!;
        await RouteAPI.delete(`/professor-leciona/${idProfessor}/${turma.idTurma}/${disciplina.idDisciplina}`);
      }
      setDeleteOpen(false);
    } catch (error: any) {
      if (error instanceof AxiosError) {
        console.log(error);
      }
    }
    await loadProfessorData(false);
  };

  const applyFilters = () => {
    let filtredData = ProfessorsData;
    if (selectedClass) {
      filtredData = filtredData.filter((data) => data.turma.idTurma === selectedClass);
    }
    if (selectedDiscipline) {
      filtredData = filtredData.filter((data) => data.disciplina.idDisciplina === Number(selectedDiscipline));
    }
    if (selectedProfessor) {
      filtredData = filtredData.filter((data) => data.idProfessor === Number(selectedProfessor));
    }
    return filtredData;
  };

  return (
    <Modal className="overflow-y-scroll" open={ProfessorModal.situation} onClose={onClose} closeAfterTransition>
      <Fade in={ProfessorModal.situation}>
        <div className={styles.modal_container}>
          <h1 className="text-xl font-bold text-black-text font-Montserrat">Professores em Atividade</h1>
          <div className={styles.contentable_container}>
            <div className={styles.table_container}>
              <table className={styles.content_table}>
                <thead className={styles.table_header}>
                  <tr>
                    <th className="min-w-[50px] w-[50px] max-w-[50px]"></th>
                    <th className="min-w-[200px] w-[200px]">Professor</th>
                    <th className="min-w-[100px] w-[100px]">Turma</th>
                    <th className="min-w-[200px] w-[200px]">Disciplina</th>
                  </tr>
                </thead>
                <tbody className={styles.table_body}>
                  {applyFilters().map((professor, index) => (
                    <tr key={index}>
                      <td>
                        <Checkbox
                          checked={selectedRows.includes(professor.idLeciona)}
                          onChange={() => selectRow(professor.idLeciona)}
                        />
                      </td>
                      <td>{professor.nome}</td>
                      <td>{professor.turma.nome}</td>
                      <td>{professor.disciplina.nome}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className={styles.side_bar}>
              <div className="w-full h-full flex flex-col items-center gap-2 px-1">
                <h1 className="font-semibold">Filtros</h1>
                <FormControl fullWidth>
                  <InputLabel>Turma</InputLabel>
                  <Select value={selectedClass} label="Turma" onChange={(e: any) => setSelectedClass(e.target.value)}>
                    <MenuItem value="">Selecione...</MenuItem>
                    {Classes.map((turma, index) => (
                      <MenuItem key={index} value={turma.idTurma}>
                        {turma.nome}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Disciplina</InputLabel>
                  <Select
                    value={selectedDiscipline}
                    label="Disciplina"
                    onChange={(e: any) => setSelectedDiscipline(e.target.value)}
                  >
                    <MenuItem value="">Selecione...</MenuItem>
                    {DisciplinesData.map((disciplina, index) => (
                      <MenuItem key={index} value={disciplina.idDisciplina}>
                        {disciplina.nome}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Professor</InputLabel>
                  <Select
                    value={selectedProfessor}
                    label="Professor"
                    onChange={(e: any) => setSelectedProfessor(e.target.value)}
                  >
                    <MenuItem value="">Selecione...</MenuItem>
                    {ProfessorsData.filter(
                      (value, index, self) =>
                        index === self.findIndex((t) => t.idProfessor === value.idProfessor && t.nome === value.nome),
                    ).map((v, a) => (
                      <MenuItem value={v.idProfessor}>{v.nome}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <button
                className={styles.remove_button}
                disabled={selectedRows.length < 1}
                onClick={() => {
                  setDeleteOpen(true);
                }}
              >
                <DeleteForeverIcon className="h-[15px]" /> Remover Associação
              </button>
            </div>
          </div>
          <Modal open={isDeleteOpen} onClose={() => setDeleteOpen(false)} closeAfterTransition>
            <Fade in={isDeleteOpen}>
              <div className={styles.delete_container}>
                <header>
                  <h1 className="font-semibold text-xl">Remover Professor</h1>
                  <div className="w-full flex flex-col items-center gap-[2px]">
                    <h3 className="text-[12px] ">Você tem certeza que deseja remover esta associação?</h3>
                    <p className="text-[12px] font-medium text-black-smooth">Esta ação não poderá ser revertida</p>
                  </div>
                </header>
                <main>
                  <div className="flex items-start h-full py-1">
                    <GppMaybeIcon className={styles.warn_icon} />
                  </div>
                  <div className="flex flex-col gap-1 h-full">
                    <h1 className="text-lg font-bold text-[#D94F3B]">Cuidado</h1>
                    <p className="text-[12px] leading-4 text-black-smooth">
                      Você está removendo este professor da suas respectiva disciplina e turma
                    </p>
                  </div>
                </main>
                <footer>
                  <button className="bg-black-text" onClick={() => setDeleteOpen(false)}>
                    Cancelar
                  </button>
                  <button className="bg-[#EB4B4B] flex items-center justify-center gap-[2px]" onClick={handleDelete}>
                    Excluir
                    {/*  {isLoading ? (
                      <CircularProgress size={25} color="inherit" />
                    ) : (
                      <>
                        Excluir <DeleteIcon />
                      </>
                    )} */}
                  </button>
                </footer>
              </div>
            </Fade>
          </Modal>
        </div>
      </Fade>
    </Modal>
  );
};

export default ModalProfessor;
