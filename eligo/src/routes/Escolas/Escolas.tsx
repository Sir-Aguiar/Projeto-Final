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
type ClassLinkProps = {
  name: string;
  link: string;
};

const ClassLink: React.FC<ClassLinkProps> = ({ link, name }) => {
  return (
    <div className=" w-full h-[50px] min-h-[50px] flex items-center justify-start gap-4 px-2">
      <a href={link} className="transition-all duration-300 rounded-full hover:bg-slate-200 p-1 group ">
        <OpenInNewIcon className="transition-all duration-300 group-hover:text-blue-icon group-hover:scale-90 " />
      </a>
      <span className="font-medium">{name}</span>
    </div>
  );
};

const Escolas: React.FC = () => {
  const { selectedRows, DrawerCreate, DrawerUpdate, Escolas, ModalDelete, selectRow, Turmas, RouteAPI } =
    useEscolasContext();
  return (
    <div className={styles.content_container}>
      <div className={styles.controllers}>
        <header className={styles.actions}>
          <button title="Cadastrar escola" onClick={() => DrawerCreate.open()}>
            <LibraryAddIcon />
          </button>
          <button disabled={selectedRows.length !== 1} title="Editar escola" onClick={() => DrawerUpdate.open()}>
            <EditIcon />
          </button>
          <button disabled={selectedRows.length < 1} onClick={() => ModalDelete.open()} title="Excluir escola">
            <DeleteForeverIcon />
          </button>
        </header>
        <div className={styles.classes}>
          <h1 className="font-semibold text-center py-1">Turmas</h1>
          <Divider />
          {selectedRows.length !== 1 ? (
            <Typography variant="subtitle2" textAlign={"center"} component="span">
              Selecione <span className="font-bold">uma</span> escola
            </Typography>
          ) : Turmas.length > 0 ? (
            Turmas.map((turma, index) => <ClassLink key={index} link="#" name={turma.nome} />)
          ) : (
            <Typography variant="subtitle2" textAlign={"center"} component="span">
              Esta escola ainda não possui turmas
            </Typography>
          )}
        </div>
      </div>
      <div className={styles.table_container}>
        <table className={styles.content_table}>
          <thead className={styles.table_header}>
            <tr>
              <th></th>
              <th>Nome</th>
            </tr>
          </thead>
          <tbody className={styles.table_body}>
            {Escolas.map((escola, index) => (
              <tr key={index}>
                <td className="min-w-[50px] w-[50px] max-w-[50px]">
                  <Checkbox
                    checked={selectedRows.includes(escola.idEscola)}
                    onChange={() => selectRow(escola.idEscola)}
                  />
                </td>
                <td className="min-w-[450px]">{escola.nome}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Create onClose={() => DrawerCreate.close()} open={DrawerCreate.situation} API={RouteAPI} />
      <Update />
      <Delete />
    </div>
  );
};

export default Escolas;
