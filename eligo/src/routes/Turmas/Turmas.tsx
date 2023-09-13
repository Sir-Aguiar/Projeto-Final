import React from "react";
import styles from "./Turmas.module.css";
import { Checkbox, Divider } from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import EditIcon from "@mui/icons-material/Edit";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useTurmasContext } from "./RouteStateManager";
import Create from "./Drawers/Create";
import Delete from "./Modals/Delete";
const Turmas: React.FC = () => {
	const { TurmasState, selectRow, selectedRows, DrawerCreate, ModalDelete } = useTurmasContext();

	return (
		<div className={styles.content_container}>
			<div className={styles.controllers}>
				<header className={styles.actions}>
					<button title="Cadastrar turma" onClick={() => DrawerCreate.open()}>
						<LibraryAddIcon />
					</button>
					<button disabled={true} title="Editar turma">
						<EditIcon />
					</button>
					<button disabled={selectedRows.length < 1} title="Excluir turmas" onClick={() => ModalDelete.open()}>
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
							<th className="min-w-[50px] w-[50px] max-w-[50px]"></th>
							<th className="min-w-[150px] w-[150px]">Turma</th>
							<th className="min-w-[150px] w-[150px]">Série</th>
							<th className="min-w-[350px] w-[350px]">Escola</th>
						</tr>
					</thead>
					<tbody className={styles.table_body}>
						{TurmasState.map((turma, index) => (
							<tr key={index}>
								<td className="min-w-[50px] w-[50px] max-w-[50px]">
									<Checkbox checked={selectedRows.includes(turma.idTurma)} onChange={() => selectRow(turma.idTurma)} />
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
		</div>
	);
};

export default Turmas;
