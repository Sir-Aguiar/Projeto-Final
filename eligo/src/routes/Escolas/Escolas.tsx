import React from "react";
import styles from "./Escolas.module.css";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import EditIcon from "@mui/icons-material/Edit";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import Checkbox from "@mui/material/Checkbox";
import { Divider, Typography } from "@mui/material";
import { useEscolasContext } from "./RouteStateManager";
import Create from "./Drawers/Create";
import Update from "./Drawers/Update";
import Delete from "./Modals/Delete";
import { Link } from "react-router-dom";
import { ITurma } from "../../@types/Turmas";
import TableController from "../../components/TableController/TableController";

type ClassLinkProps = {
  turma: ITurma;
  link?: boolean;
};

const ClassLink: React.FC<ClassLinkProps> = ({ turma, link = false }) => {
  return (
    <div className=" w-full h-[50px] min-h-[50px] flex items-center justify-start gap-4 px-2 text-black-smooth">
      {link && (
        <a
          href={`/turma/${turma.idTurma}`}
          className="transition-all duration-300 rounded-full hover:bg-slate-200 p-1 group "
        >
          <OpenInNewIcon className="transition-all duration-300 group-hover:text-blue-600 group-hover:scale-90 " />
        </a>
      )}
      <span>{turma.nome}</span>
    </div>
  );
};

const Escolas: React.FC = () => {
  const { selectedRows, DrawerCreate, DrawerUpdate, Escolas, ModalDelete, selectRow, Turmas, TokenData } =
    useEscolasContext();

  const CreateButton = {
    disabled: false,
    onClick: () => DrawerCreate.open(),
    title: "Cadastrar Escola",
  };
  const UpdateButton = {
    disabled:
      selectedRows.length !== 1 ||
      Escolas.find((escola) => escola.idEscola === selectedRows[0])?.idGestor !== TokenData.idUsuario,
    onClick: () => DrawerUpdate.open(),
    title: "Atualizar Escola",
  };
  const RemoveButton = {
    disabled:
      selectedRows.length < 1 ||
      selectedRows.filter((idEscola) => {
        const escolaSelecionada = Escolas.find((escola) => escola.idEscola === idEscola);
        return escolaSelecionada?.idGestor !== TokenData.idUsuario;
      }).length > 0,
    onClick: () => ModalDelete.open(),
    title: "Exclui Escola",
  };

  return (
    <div className={styles.content_container}>
      <div className={styles.controllers}>
        <TableController page_title="Escolas" create={CreateButton} update={UpdateButton} remove={RemoveButton} />
        <div className={styles.class_controller}>
          <h1 className="font-semibold text-center pb-2">Turmas</h1>
          <Divider />
          <div className={styles.classes}>
            {selectedRows.length !== 1 ? (
              <span className="text-[11px] mobile:text-sm text-center">Seleciona uma escola para ver suas turmas</span>
            ) : Turmas.length > 0 ? (
              Turmas.map((turma, index) => (
                <ClassLink key={index} turma={turma} link={turma.escola.idGestor === TokenData.idUsuario} />
              ))
            ) : (
              <span className="text-sm mobile:text-sm text-center">Esta escola não possui turmas</span>
            )}
          </div>
        </div>
      </div>
      <div className={styles.table_container}>
        <table className={styles.content_table}>
          <thead className={styles.table_header}>
            <tr>
              <th className="min-w-[50px] w-[50px] max-w-[50px]"></th>
              <th className="min-w-[50px] w-[50px] max-w-[50px]"></th>
              <th>Nome</th>
            </tr>
          </thead>
          <tbody className={styles.table_body}>
            {Escolas.map((escola, index) => (
              <tr key={index}>
                <td>
                  <Checkbox
                    checked={selectedRows.includes(escola.idEscola)}
                    onChange={() => selectRow(escola.idEscola)}
                  />
                </td>
                <td>
                  {escola.idGestor === TokenData.idUsuario && (
                    <Link to={`/escola/${escola.idEscola}`}>
                      <OpenInNewIcon fontSize="small" />
                    </Link>
                  )}
                </td>
                <td className="min-w-[450px]">{escola.nome}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Create />
      <Update />
      <Delete />
    </div>
  );
};

export default Escolas;
