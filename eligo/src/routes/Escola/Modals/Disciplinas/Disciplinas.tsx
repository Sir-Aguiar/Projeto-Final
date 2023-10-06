import React, { useState } from "react";
import styles from "./DisciplinaModal.module.css";
import Modal from "@mui/material/Modal";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import EditIcon from "@mui/icons-material/Edit";
import GridOnIcon from "@mui/icons-material/GridOn";
import { Fade, Checkbox, Divider, TextField } from "@mui/material";
import { useEscolaContext } from "../../RouteStateManager";
import DeleteGrid from "./DeleteGrid/DeleteGrid";
import { AxiosError } from "axios";
import DeleteDiscipline from "./DeleteDiscipline/DeleteDiscipline";
import UpdateDiscipline from "./UpdateDiscipline/UpdateDiscipline";
import AddGrid from "./AddGrid/AddGrid";
import { useToast } from "../../../../components/Toast/Toast";
import { HandleError } from "../../../../utils/defaultErrorHandler";

const ModalDisciplina: React.FC = () => {
  const { notify } = useToast();
  const { DisciplineModal, DisciplinesData, GridData, loadGridData, loadDisciplineData, RouteAPI } = useEscolaContext();
  const [isDeleteAssociationOpen, setDeleteAssociation] = useState(false);
  const [associationToDelete, setAssociationToDelete] = useState<number[]>([]);
  const [isDeleteDisciplineOpen, setDeleteDiscipline] = useState(false);
  const [selectedDisciplines, setDisciplines] = useState<number[]>([]);
  const [isUpdateDisciplineOpen, setUpdateDiscipline] = useState(false);
  const [isAddGridOpen, setAddGrid] = useState(false);
  const closeDeleteAssociation = async () => {
    setAssociationToDelete([]);
    await loadGridData();
    setDeleteAssociation(false);
  };

  const deleteGridAssociation = async () => {
    try {
      await RouteAPI.delete(`/curso-disciplina/${associationToDelete[0]}/${associationToDelete[1]}`);
      notify({ title: "Grade excluída com sucesso" });
    } catch (error: any) {
      HandleError(error, notify, "Erro ao remover grade");
    }
    await closeDeleteAssociation();
  };
  const deleteDiscipline = async () => {
    try {
      for (const idDisciplina of selectedDisciplines) {
        await RouteAPI.delete(`/disciplina/${idDisciplina}`);
      }
      notify({ title: "Disciplinas excluídas com sucesso" });
    } catch (error: any) {
      HandleError(error, notify, "Erro ao excluir disciplina");
    }
    await closeDeleteDiscipline();
  };
  const closeDeleteDiscipline = async () => {
    setDisciplines([]);
    setDeleteDiscipline(false);
    await loadDisciplineData(false);
    await loadGridData();
  };

  const selectDiscipline = (idDisciplina: number) => {
    setDisciplines((values) => {
      let newValues: number[];
      if (values.includes(idDisciplina)) {
        newValues = values.filter((value) => value !== idDisciplina);
      } else {
        newValues = [...values, idDisciplina];
      }
      return newValues;
    });
  };

  const updateDiscipline = async (data: { nome: string }) => {
    try {
      await RouteAPI.put(`/disciplina/${selectedDisciplines[0]}`, { toUpdate: data });
      notify({ title: "Disciplina atualizada com sucesso" });
    } catch (error: any) {
      HandleError(error, notify, "Erro ao atualizar disciplina");
    }
    await closeUpdateDiscipline();
  };

  const closeUpdateDiscipline = async () => {
    setDisciplines([]);
    await loadDisciplineData(false);
    await loadGridData();
    setUpdateDiscipline(false);
  };

  const closeAddGrid = async () => {
    await loadDisciplineData();
    await loadGridData();
    setAddGrid(false);
  };

  const onClose = async () => {
    DisciplineModal.close();
    setDisciplines([]);
  };

  return (
    <Modal className="overflow-y-scroll" open={DisciplineModal.situation} onClose={onClose} closeAfterTransition>
      <>
        <Fade in={DisciplineModal.situation}>
          <div className={styles.modal_container}>
            <div className={styles.controllers}>
              <h1 className="font-bold text-blue-600">Disciplinas</h1>
              <header className={styles.controller_options}>
                <button
                  className={styles.option}
                  disabled={selectedDisciplines.length < 1}
                  onClick={() => setDeleteDiscipline(true)}
                >
                  <DeleteForeverIcon />
                  Remover
                </button>
                <button
                  className={styles.option}
                  disabled={selectedDisciplines.length !== 1}
                  onClick={() => setUpdateDiscipline(true)}
                >
                  <EditIcon />
                  Editar
                </button>
                <button className={styles.option} onClick={() => setAddGrid(true)}>
                  <GridOnIcon />
                  Adicionar Grade
                </button>
              </header>
              <div className={styles.discipline_list}>
                {DisciplinesData.map((disciplina, index) => (
                  <div key={index} className={styles.disciplina}>
                    <Checkbox
                      checked={selectedDisciplines.includes(disciplina.idDisciplina)}
                      onChange={() => selectDiscipline(disciplina.idDisciplina)}
                    />
                    {disciplina.nome}
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.table_container}>
              <table className={styles.content_table}>
                <thead className={styles.table_header}>
                  <tr>
                    <th className="w-[50px] max-w-[50px] min-w-[50px]"></th>
                    <th className="min-w-[275px] w-[275px]">Disciplina</th>
                    <th className="min-w-[150px] w-[150px]">Curso</th>
                  </tr>
                </thead>
                <tbody className={styles.table_body}>
                  {GridData.map((grade, index) => (
                    <tr key={index}>
                      <td>
                        <button
                          onClick={() => {
                            setDeleteAssociation(true);
                            setAssociationToDelete([grade.curso.idCurso, grade.idDisciplina]);
                          }}
                        >
                          <DeleteForeverIcon />
                        </button>
                      </td>
                      <td>{grade.nome}</td>
                      <td>{grade.curso.nome}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Fade>
        <DeleteGrid
          handleDelete={deleteGridAssociation}
          situation={isDeleteAssociationOpen}
          onClose={closeDeleteAssociation}
        />
        <DeleteDiscipline
          situation={isDeleteDisciplineOpen}
          handleDelete={deleteDiscipline}
          onClose={closeDeleteDiscipline}
        />
        <UpdateDiscipline
          disciplina={DisciplinesData.find((d) => d.idDisciplina === selectedDisciplines[0])!}
          onClose={closeUpdateDiscipline}
          handleUpdate={updateDiscipline}
          situation={isUpdateDisciplineOpen}
        />
        <AddGrid onClose={closeAddGrid} situation={isAddGridOpen} RouteAPI={RouteAPI} />
      </>
    </Modal>
  );
};

export default ModalDisciplina;
