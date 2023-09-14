import React from "react";
import styles from "./Alunos.module.css";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import EditIcon from "@mui/icons-material/Edit";
import Delete from "./Modals/Delete";
import Update from "./Drawers/Update";
import Create from "./Drawers/Create";

const Alunos: React.FC = () => {
	return (
		<div className={styles.content_container}>
			<div className={styles.controllers}>
				<header className={styles.actions}>
					<button title="Cadastrar escola">
						<LibraryAddIcon />
					</button>
					<button disabled title="Editar escola">
						<EditIcon />
					</button>
					<button disabled title="Excluir escola">
						<DeleteForeverIcon />
					</button>
				</header>

				<div className={styles.classes}></div>
			</div>
			<div className={styles.table_container}>
				<table className={styles.content_table}>
					<thead className={styles.table_header}></thead>
					<tbody className={styles.table_body}></tbody>
				</table>
			</div>
			<Create />
			<Update />
			<Delete />
		</div>
	);
};

export default Alunos;
