import React, { useState } from "react";
import styles from "./Create.module.css";
import { Divider, Drawer, TextField } from "@mui/material";
import { useAlunosContext } from "../RouteStateManager";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import { AxiosError } from "axios";
const Create: React.FC = () => {
	const { DrawerCreate, RouteAPI, EscolasState, TurmasState, showClasses } = useAlunosContext();

	const [idEscola, setIdEscola] = useState("");
	const [idTurma, setIdTurma] = useState("");

	const onClose = () => {
		DrawerCreate.close();
		setIdEscola("");
		setIdTurma("");
	};

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const AlunoNome = e.currentTarget.querySelector<HTMLInputElement>("#aluno-nome");
		try {
			const response = await RouteAPI.post(`/aluno`, { alunos: [{ idTurma, nome: AlunoNome?.value }] });
			console.log(response);
			onClose();
		} catch (error: any) {
			if (error instanceof AxiosError) {
				console.log(error);
				alert(error.response?.data.error.message);
			}
		}
	};

	return (
		<Drawer anchor="right" open={DrawerCreate.situation} onClose={onClose}>
			<div className={styles.insert_container}>
				<header className="py-1">
					<h1 className="font-bold text-lg text-center">Cadastrar Aluno</h1>
				</header>
				<Divider />
				<main className="w-full h-full flex flex-col gap-2 overflow-y-auto">
					<form className={styles.formulary} id="create-student" onSubmit={onSubmit}>
						<FormControl fullWidth>
							<InputLabel>Escola</InputLabel>
							<Select
								value={idEscola}
								required
								label="Escola"
								onChange={(e: any) => {
									setIdEscola(e.target.value);
									showClasses();
								}}
							>
								{EscolasState.map((escola, index) => (
									<MenuItem value={escola.idEscola} key={index}>
										{escola.nome}
									</MenuItem>
								))}
							</Select>
						</FormControl>
						<FormControl fullWidth disabled={TurmasState.length < 1}>
							<InputLabel>Turma</InputLabel>
							<Select
								value={idTurma}
								id="aluno-turma"
								required
								label="Turma"
								onChange={(e: any) => {
									setIdTurma(e.target.value);
								}}
							>
								{TurmasState.length > 0
									? TurmasState.map((turma, index) => (
											<MenuItem value={turma.idTurma} key={index}>
												{turma.nome}
											</MenuItem>
									  ))
									: ""}
							</Select>
						</FormControl>
						<Divider />
						<TextField
							label="Nome do aluno"
							variant="outlined"
							id="aluno-nome"
							fullWidth
							required
							inputProps={{ maxLength: 50 }}
						/>
					</form>
				</main>
				<footer className={styles.senders}>
					<button onClick={onClose} className={styles.cancel}>
						Cancelar
					</button>
					<input type="submit" value="Cadastrar" form="create-student" className={styles.submiter} />
				</footer>
			</div>
		</Drawer>
	);
};

export default Create;
