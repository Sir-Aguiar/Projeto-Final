import React from "react";
import styles from "./Turmas.module.css";
import { Divider } from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import EditIcon from "@mui/icons-material/Edit";
import FilterListIcon from "@mui/icons-material/FilterList";
const Turmas: React.FC = () => {
  return (
    <div className={styles.content_container}>
      <div className={styles.controllers}>
        <header className={styles.actions}>
          <button title="Cadastrar turma">
            <LibraryAddIcon />
          </button>
          <button disabled={true} title="Editar turma">
            <EditIcon />
          </button>
          <button disabled={true} title="Excluir turmas">
            <DeleteForeverIcon />
          </button>
          <button title="Filtrar turmas">
            <FilterListIcon />
          </button>
        </header>
        <div className={styles.students}>
          <h1 className="font-semibold text-center py-1">Alunos</h1>
          <Divider />
        </div>
      </div>
      <div className={styles.table_container}>
        <table className={styles.content_table}>
          <thead className={styles.table_header}>
            <tr>
              <th></th>
            </tr>
          </thead>
          <tbody className={styles.table_body}></tbody>
        </table>
      </div>
    </div>
  );
};

export default Turmas;
