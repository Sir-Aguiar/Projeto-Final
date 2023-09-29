import React from "react";
import styles from "./TableController.module.css";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import EditIcon from "@mui/icons-material/Edit";
import FilterListIcon from "@mui/icons-material/FilterList";

interface IOptionProps {
  disabled: boolean;
  onClick: () => void;
  title: string;
}

type Props = {
  page_title: string;
  create?: IOptionProps;
  update?: IOptionProps;
  remove?: IOptionProps;
  filter?: IOptionProps;
};

const TableController: React.FC<Props> = ({ create, remove, filter, update, page_title }) => {
  return (
    <header className={styles.controller_container}>
      <h1 className="font-bold text-blue-600">{page_title}</h1>
      <div className={styles.controller_options}>
        {create && (
          <button className={styles.option} disabled={create.disabled} onClick={create.onClick} title={create.title}>
            <LibraryAddIcon />
            <span>Adicionar</span>
          </button>
        )}
        {update && (
          <button className={styles.option} disabled={update.disabled} onClick={update.onClick} title={update.title}>
            <EditIcon />
            <span>Editar</span>
          </button>
        )}
        {remove && (
          <button className={styles.option} disabled={remove.disabled} onClick={remove.onClick} title={remove.title}>
            <DeleteForeverIcon />
            <span>Excluir</span>
          </button>
        )}
        {filter && (
          <button className={styles.option} disabled={filter.disabled} onClick={filter.onClick} title={filter.title}>
            <FilterListIcon />
            <span>Filtros</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default TableController;

/* 
  Criar -> Tem
  Editar -> Tem
*/
