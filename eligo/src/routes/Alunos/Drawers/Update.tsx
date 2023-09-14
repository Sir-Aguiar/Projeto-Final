import React, { useState, useEffect } from "react";
import styles from "./Update.module.css";
import { Divider, Drawer, TextField } from "@mui/material";
import { useAlunosContext } from "../RouteStateManager";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import { AxiosError } from "axios";
const Update: React.FC = () => {
	const { DrawerUpdate, RouteAPI, EscolasState, TurmasState, showClasses, selectedRows, Alunos } = useAlunosContext();

	const [idTurma, setIdTurma] = useState("");
	const [nomeAluno, setNomeAluno] = useState("");

	const onClose = () => {
		DrawerUpdate.close();
	};

	const onSubmit = async () => {};

	useEffect(() => {
		if (DrawerUpdate.situation) {
			const foundStudent = Alunos.find((aluno) => aluno.idAluno === selectedRows[0]);
			const foundClass = TurmasState.find((turma) => turma.idTurma === foundStudent?.turma.idTurma)!;
			setIdTurma(String(foundClass.idTurma));
			setNomeAluno(foundStudent!.nome);
		}
	}, [DrawerUpdate.situation]);

	return (
		<Drawer anchor="right" open={DrawerUpdate.situation} onClose={onClose}>
			<div className={styles.update_container}>
				<header className="py-1">
					<h1 className="font-bold text-lg text-center">Atualizar Aluno</h1>
				</header>
				<Divider />
				<main className="w-full h-full flex flex-col gap-2 overflow-y-auto">
					<form className={styles.formulary} id="update-student" onSubmit={onSubmit}>
						<FormControl fullWidth disabled={TurmasState.length < 1}>
							<InputLabel>Turma</InputLabel>
							<Select value={idTurma} required label="Turma" onChange={(e: any) => setIdTurma(e.target.value)}>
								{TurmasState.length > 0
									? TurmasState.map((turma, index) => (
											<MenuItem value={turma.idTurma} key={index}>
												{turma.nome}
											</MenuItem>
									  ))
									: ""}
							</Select>
						</FormControl>
						<TextField
							label="Nome do aluno"
							variant="outlined"
							fullWidth
							inputProps={{ maxLength: 50 }}
							value={nomeAluno}
							onChange={(e: any) => setNomeAluno(e.target.value)}
							required
						/>
					</form>
				</main>
				<footer className={styles.senders}>
					<button onClick={onClose} className={styles.cancel}>
						Cancelar
					</button>
					<input type="submit" value="Cadastrar" form="update-student" className={styles.submiter} />
				</footer>
			</div>
		</Drawer>
	);
};

export default Update;
