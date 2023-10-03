import React, { useState } from "react";
import styles from "./Alunos.module.css";
import { Checkbox, Divider, Typography, CircularProgress } from "@mui/material";
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
import TableController from "../../components/TableController/TableController";
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
    alunosCount,
    showStudent,
  } = useAlunosContext();

  const CreateButton = {
    disabled: false,
    onClick: () => DrawerCreate.open(),
    title: "Cadastrar Aluno",
  };
  const UpdateButton = {
    disabled: selectedRows.length !== 1,
    onClick: () => DrawerUpdate.open(),
    title: "Atualizar Aluno",
  };

  const RemoveButton = {
    disabled: selectedRows.length < 1,
    onClick: () => ModalDelete.open(),
    title: "Excluir Alunos",
  };

  return (
    <div className={styles.content_container}>
      <div className={styles.controllers}>
        <TableController page_title="Alunos" create={CreateButton} update={UpdateButton} remove={RemoveButton} />
        <div className={styles.filters}>
          <h1 className="font-semibold text-center">Filtros</h1>
          <FormControl fullWidth>
            <InputLabel>Escola</InputLabel>
            <Select
              value={selectedSchool}
              required
              label="Escola"
              onChange={(e: any) => {
                setSelectedClass("");
                setSelectedSchool(e.target.value);
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
          Alunos.length < 1 ? (
            isLoading ? (
              <div className="w-full flex items-center justify-center p-2">
                <CircularProgress size={20} />
              </div>
            ) : (
              <div className="w-full h-[50px] text-center p-2">
                <h1>Nenhum aluno foi encontrado</h1>
              </div>
            )
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
                {Alunos.map((aluno, index) => (
                  <tr key={index}>
                    <td>
                      {aluno.turma.escola.idGestor === TokenData.idUsuario && (
                        <Checkbox
                          checked={selectedRows.includes(aluno.idAluno)}
                          onChange={() => selectRow(aluno.idAluno)}
                        />
                      )}
                    </td>
                    <td>
                      {aluno.turma.escola.idGestor === TokenData.idUsuario && (
                        <Link to={`/aluno/${aluno.idAluno}`}>
                          <OpenInNewIcon fontSize="small" />
                        </Link>
                      )}
                    </td>
                    <td>{aluno.nome}</td>
                    <td>{aluno.turma.nome}</td>
                    <td>{aluno.turma.curso.nome}</td>
                    <td>{aluno.turma.escola.nome}</td>
                  </tr>
                ))}
                {Alunos.length < alunosCount && (
                  <tr onClick={() => showStudent()}>
                    <td colSpan={6}>
                      <div className="flex items-center justify-center underline cursor-pointer font-medium">
                        {isLoading ? <CircularProgress size={20} /> : "Carregar mais"}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )
        ) : (
          <h1 className="w-full py-4 font-light text-black-text text-center">Selecione uma Escola</h1>
        )}
      </div>
      <Create />
      <Update />
      <Delete />
    </div>
  );
};

export default Alunos;
