import React from "react";
import styles from "./Turmas.module.css";
import { Checkbox, Divider, Typography } from "@mui/material";
import { useTurmasContext } from "./RouteStateManager";
import Create from "./Drawers/Create";
import Delete from "./Modals/Delete";
import Update from "./Drawers/Update";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import Filter from "./Modals/Filter";
import { Link } from "react-router-dom";
import TableController from "../../components/TableController/TableController";

const StudentLink: React.FC<{ link: string; name: string }> = ({ link, name }) => {
  return (
    <div className="w-full h-[50px] min-h-[50px] flex items-center justify-start gap-3 px-2">
      <a href={link} className="transition-all duration-300 rounded-full hover:bg-slate-200 p-1 group ">
        <OpenInNewIcon className="transition-all duration-300 group-hover:text-blue-600 group-hover:scale-95 " />
      </a>
      <span title={name} className="text-sm whitespace-nowrap overflow-hidden text-ellipsis">
        {name}
      </span>
    </div>
  );
};

const Turmas: React.FC = () => {
  const {
    selectRow,
    selectedRows,
    CreateButton,
    FilterButton,
    RemoveButton,
    UpdateButton,
    Alunos,
    TokenData,
    applyFilters,
  } = useTurmasContext();

  return (
    <div className={styles.content_container}>
      <div className={styles.controllers}>
        <TableController
          page_title="Turmas"
          create={CreateButton}
          update={UpdateButton}
          remove={RemoveButton}
          filter={FilterButton}
        />
        <div className={styles.students}>
          <h1 className="font-semibold text-center pb-1">Alunos</h1>
          <Divider />
          {selectedRows.length !== 1 ? (
            <span className="text-[11px] mobile:text-sm text-center">Seleciona uma turma para ver seus alunos</span>
          ) : Alunos.length > 0 ? (
            Alunos.map((aluno, index) => <StudentLink key={index} name={aluno.nome} link={`/aluno/${aluno.idAluno}`} />)
          ) : (
            <Typography variant="subtitle2" textAlign={"center"} component="span">
              Esta turma ainda não possui alunos
            </Typography>
          )}
        </div>
      </div>
      <div className={styles.table_container}>
        <table className={styles.content_table}>
          <thead className={styles.table_header}>
            <tr>
              <th className="min-w-[50px] w-[50px] max-w-[50px]"></th>
              <th className="min-w-[50px] w-[50px] max-w-[50px]"></th>
              <th className="min-w-[150px] w-[150px]">Turma</th>
              <th className="min-w-[150px] w-[150px]">Série</th>
              <th className="min-w-[350px] w-[350px]">Escola</th>
            </tr>
          </thead>
          <tbody className={styles.table_body}>
            {applyFilters().map((turma, index) => (
              <tr key={index}>
                <td>
                  <Checkbox checked={selectedRows.includes(turma.idTurma)} onChange={() => selectRow(turma.idTurma)} />
                </td>
                <td>
                  {turma.escola.idGestor === TokenData.idUsuario && (
                    <Link to={`/turma/${turma.idTurma}`}>
                      <OpenInNewIcon fontSize="small" />
                    </Link>
                  )}
                </td>
                <td>{turma.nome}</td>
                <td>{turma.curso.nome}</td>
                <td>{turma.escola.nome}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Create />
      <Delete />
      <Update />
      <Filter />
    </div>
  );
};

export default Turmas;
