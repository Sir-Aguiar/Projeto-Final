import React, { useState } from "react";
import styles from "./ProfessorModal.module.css";
import Modal from "@mui/material/Modal";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { Fade, Checkbox, Divider, TextField } from "@mui/material";
import { useEscolaContext } from "../../RouteStateManager";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const ModalProfessor: React.FC = () => {
  const [selectedRows, setSelectedRow] = useState<number[]>([]);
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

  const { ProfessorModal, ProfessorsData } = useEscolaContext();
  return (
    <Modal
      className="overflow-y-scroll"
      open={ProfessorModal.situation}
      onClose={() => ProfessorModal.close()}
      closeAfterTransition
    >
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
                  {ProfessorsData.map((professor, index) => (
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
                  <Select value={""} label="Turma"></Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Disciplina</InputLabel>
                  <Select value={""} label="Disciplina"></Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Professor</InputLabel>
                  <Select value={""} label="Professor"></Select>
                </FormControl>
              </div>
              <button className={styles.remove_button} disabled={selectedRows.length < 1}>
                <DeleteForeverIcon className="h-[15px]" /> Remover Associação
              </button>
            </div>
          </div>
        </div>
      </Fade>
    </Modal>
  );
};

export default ModalProfessor;
