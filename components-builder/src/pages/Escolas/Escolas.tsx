import React from "react";
import styles from "./Escolas.module.css";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import EditIcon from "@mui/icons-material/Edit";
import TuneIcon from "@mui/icons-material/Tune";
import Checkbox from "@mui/material/Checkbox";

const Escolas: React.FC = () => {
	return (
		<div className={styles.content_container}>
			<div className={styles.controllers}>
				<header className={styles.actions}>
					<LibraryAddIcon />
					<EditIcon />
					<DeleteForeverIcon />
				</header>
				<div className={styles.filters}></div>
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
						<tr>
							<td className="min-w-[50px] w-[50px]">
								<Checkbox defaultChecked style={{ margin: "0 auto" }} />
							</td>
							<td className="min-w-[450px]">Escola Estadual Professora Eliane Digigov Santana</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default Escolas;
