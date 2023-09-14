import React from "react";
import styles from "./Alunos.module.css";
import { Checkbox, Divider, Typography } from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import EditIcon from "@mui/icons-material/Edit";
import Delete from "./Modals/Delete";
import Update from "./Drawers/Update";
import Create from "./Drawers/Create";
import { useAlunosContext } from "./RouteStateManager";

const Alunos: React.FC = () => {
	const { Alunos, AlunosQTD, selectRow, selectedRows, loadMore } = useAlunosContext();
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
					<thead className={styles.table_header}>
						<tr>
							<th className="min-w-[50px] w-[50px] max-w-[50px]"></th>
							<th className="min-w-[150px] w-[150px]">Nome</th>
							<th className="min-w-[100px] w-[100px]">Turma</th>
							<th className="min-w-[125px] w-[125px]">Série</th>
							<th className="min-w-[300px] w-[300px]">Escola</th>
						</tr>
					</thead>
					<tbody className={styles.table_body}>
						{Alunos.map((aluno, index) => (
							<tr key={index}>
								<td>
									<Checkbox checked={selectedRows.includes(aluno.idAluno)} onChange={() => selectRow(aluno.idAluno)} />
								</td>
								<td>{aluno.nome}</td>
								<td>{aluno.turma.nome}</td>
								<td>{aluno.turma.curso.nome}</td>
								<td>{aluno.escola.nome}</td>
							</tr>
						))}
						{Alunos.length < AlunosQTD && (
							<tr onClick={loadMore}>
								<td
									colSpan={5}
									className="text-center cursor-pointer underline transition-all duration-200 hover:text-blue-600 "
								>
									<span className="text-[16px] font-bold">Carregar mais</span>
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
			<Create />
			<Update />
			<Delete />
		</div>
	);
};

export default Alunos;
