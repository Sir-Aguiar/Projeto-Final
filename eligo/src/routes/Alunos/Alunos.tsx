import React, { useState } from "react";
import styles from "./Alunos.module.css";
import { Checkbox, Divider, Typography } from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import EditIcon from "@mui/icons-material/Edit";
import Delete from "./Modals/Delete";
import Update from "./Drawers/Update";
import Create from "./Drawers/Create";
import { useAlunosContext } from "./RouteStateManager";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
const Alunos: React.FC = () => {
	const {
		Alunos,
		AlunosQTD,
		selectRow,
		selectedRows,
		loadMore,
		DrawerCreate,
		ModalDelete,
		DrawerUpdate,
		EscolasState,
		TurmasState,
		showStudent,
		showClasses,
	} = useAlunosContext();
	const [selectedIdEscola, setSelectedIdEscola] = useState("");
	const [selectedIdTurma, setSelectedIdTurma] = useState("");
	return (
		<div className={styles.content_container}>
			<div className={styles.controllers}>
				<header className={styles.actions}>
					<button title="Cadastrar aluno" onClick={() => DrawerCreate.open()}>
						<LibraryAddIcon />
					</button>
					<button disabled={selectedRows.length !== 1} title="Editar alunos" onClick={() => DrawerUpdate.open()}>
						<EditIcon />
					</button>
					<button disabled={selectedRows.length < 1} title="Excluir alunos" onClick={() => ModalDelete.open()}>
						<DeleteForeverIcon />
					</button>
				</header>

				<div className={styles.classes}>
					<FormControl fullWidth>
						<InputLabel>Escola</InputLabel>
						<Select
							value={selectedIdEscola}
							required
							label="Escola"
							onChange={(e: any) => {
								setSelectedIdEscola(e.target.value);
								showStudent(Number(e.target.value));
								showClasses(Number(e.target.value));
							}}
						>
							{EscolasState.length > 0 &&
								EscolasState.map((escola, index) => (
									<MenuItem key={index} value={escola.idEscola}>
										{escola.nome}
									</MenuItem>
								))}
						</Select>
					</FormControl>
					<FormControl fullWidth disabled={TurmasState.length < 1}>
						<InputLabel>Turma</InputLabel>
						<Select
							value={selectedIdTurma}
							required
							label="Turma"
							onChange={(e: any) => {
								setSelectedIdTurma(e.target.value);
								showStudent(Number(e.target.value));
							}}
						>
							{TurmasState.length > 0 &&
								TurmasState.map((turma, index) => (
									<MenuItem key={index} value={turma.idTurma}>
										{turma.nome}
									</MenuItem>
								))}
						</Select>
					</FormControl>
				</div>
			</div>
			<div className={styles.table_container}>
				<table className={styles.content_table}>
					<thead className={styles.table_header}>
						<tr>
							<th className="min-w-[50px] w-[50px] max-w-[50px]"></th>
							<th className="min-w-[150px] w-[200px]">Nome</th>
							<th className="min-w-[100px] w-[100px]">Turma</th>
							<th className="min-w-[125px] w-[125px]">Série</th>
							<th className="min-w-[200px] w-[250px]">Escola</th>
						</tr>
					</thead>
					<tbody className={styles.table_body}>
						{Alunos.length > 0 &&
							Alunos.map((aluno, index) => (
								<tr key={index}>
									<td>
										<Checkbox
											checked={selectedRows.includes(aluno.idAluno)}
											onChange={() => selectRow(aluno.idAluno)}
										/>
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
