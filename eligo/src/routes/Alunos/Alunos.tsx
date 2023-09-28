import React, { useState } from "react";
import styles from "./Alunos.module.css";
import { Checkbox, Divider, Typography, CircularProgress } from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import EditIcon from "@mui/icons-material/Edit";
import Delete from "./Modals/Delete";
import Update from "./Drawers/Update";
import Create from "./Drawers/Create";
import { useAlunosContext } from "./RouteStateManager";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Link } from "react-router-dom";
const Alunos: React.FC = () => {
  const {
    Alunos,
    selectRow,
    selectedRows,
    DrawerCreate,
    ModalDelete,
    DrawerUpdate,
    Escolas,
    Turmas,
    isLoading,
    showClasses,
    selectedSchool,
    selectedClass,
    setSelectedSchool,
    TokenData,
    setSelectedClass,
  } = useAlunosContext();

  const applyFilters = () => {
    let filtredData = Alunos;

    if (selectedClass) {
      filtredData = filtredData.filter((aluno) => aluno.turma.idTurma === Number(selectedClass));
    }
    return filtredData;
  };

  return (
    <div className={styles.content_container}>
      <div className={styles.controllers}>
        <header className={styles.actions}>
          <button title="Cadastrar aluno" onClick={() => DrawerCreate.open()}>
            <LibraryAddIcon />
          </button>
          <button disabled={selectedRows.length !== 1} title="Editar alunos" onClick={() => DrawerUpdate.open()}>
            <EditIcon />
          </button>
          <button disabled={selectedRows.length < 1} title="Excluir alunos" onClick={() => ModalDelete.open()}>
            <DeleteForeverIcon />
          </button>
        </header>

        <div className={styles.classes}>
          <FormControl fullWidth>
            <InputLabel>Escola</InputLabel>
            <Select
              value={selectedSchool}
              required
              label="Escola"
              onChange={(e: any) => {
                setSelectedSchool(e.target.value);
                setSelectedClass("");
                showClasses(Number(e.target.value));
              }}
            >
              {Escolas.length > 0 &&
                Escolas.map((escola, index) => (
                  <MenuItem key={index} value={escola.idEscola}>
                    {escola.nome}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          <FormControl fullWidth disabled={Turmas.length < 1}>
            <InputLabel>Turma</InputLabel>
            <Select
              value={selectedClass}
              required
              label="Turma"
              onChange={(e: any) => setSelectedClass(e.target.value)}
            >
              <MenuItem value="">Selecione</MenuItem>
              {Turmas.length > 0 &&
                Turmas.map((turma, index) => (
                  <MenuItem key={index} value={turma.idTurma}>
                    {turma.nome}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </div>
      </div>
      <div className={styles.table_container}>
        {selectedSchool ? (
          isLoading ? (
            <div className="w-full h-[50px] flex justify-center items-center">
              <CircularProgress />
            </div>
          ) : Alunos.length < 1 ? (
            <div className="w-full h-[50px] text-center">
              <h1>Nenhum aluno foi encontrado</h1>
            </div>
          ) : (
            <table className={styles.content_table}>
              <thead className={styles.table_header}>
                <tr>
                  <th className="min-w-[50px] w-[50px] max-w-[50px]"></th>
                  <th className="min-w-[50px] w-[50px] max-w-[50px]"></th>
                  <th className="min-w-[150px] w-[200px]">Nome</th>
                  <th className="min-w-[100px] w-[100px]">Turma</th>
                  <th className="min-w-[125px] w-[125px]">Série</th>
                  <th className="min-w-[200px] w-[250px]">Escola</th>
                </tr>
              </thead>
              <tbody className={styles.table_body}>
                {applyFilters().map((aluno, index) => (
                  <tr key={index}>
                    <td>
                      {aluno.escola.idGestor === TokenData.idUsuario && (
                        <Checkbox
                          checked={selectedRows.includes(aluno.idAluno)}
                          onChange={() => selectRow(aluno.idAluno)}
                        />
                      )}
                    </td>
                    <td>
                      {aluno.escola.idGestor === TokenData.idUsuario && (
                        <Link to={`/aluno/${aluno.idAluno}`}>
                          <OpenInNewIcon fontSize="small" />
                        </Link>
                      )}
                    </td>
                    <td>{aluno.nome}</td>
                    <td>{aluno.turma.nome}</td>
                    <td>{aluno.turma.curso.nome}</td>
                    <td>{aluno.escola.nome}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        ) : (
          <h1 className="w-full py-1 font-light text-black-text text-center">Selecione uma Escola</h1>
        )}
      </div>
      <Create />
      <Update />
      <Delete />
    </div>
  );
};

export default Alunos;
