import React, { useEffect, useState } from "react";
import styles from "./AddDiscipline.module.css";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { Divider, Drawer, TextField } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { AxiosError } from "axios";
import { useEscolaContext } from "../../RouteStateManager";

const CourseToAdd: React.FC = () => {
	const [serie, setSerie] = useState("");
	return (
		<div className="w-full flex gap-2 text-start">
			<FormControl fullWidth>
				<InputLabel>Série</InputLabel>
				<Select value={serie} name="serie-disciplina" label="Série" onChange={(e: any) => setSerie(e.target.value)}>
					<MenuItem value="1">1ª Série</MenuItem>
					<MenuItem value="2">2ª Série</MenuItem>
					<MenuItem value="3">3ª Série</MenuItem>
					<MenuItem value="4">4ª Série</MenuItem>
					<MenuItem value="5">5ª Série</MenuItem>
					<MenuItem value="6">6ª Série</MenuItem>
					<MenuItem value="7">7ª Série</MenuItem>
					<MenuItem value="8">8ª Série</MenuItem>
					<MenuItem value="9">9ª Série</MenuItem>
					<MenuItem value="10">1º Ano</MenuItem>
					<MenuItem value="11">2º Ano</MenuItem>
					<MenuItem value="12">3º Ano</MenuItem>
				</Select>
			</FormControl>
		</div>
	);
};

const AddDiscipline: React.FC = () => {
	const { DisciplineDrawer, RouteAPI, SchoolData } = useEscolaContext();
	const [courseToAdd, setCourseToAdd] = useState<number[]>([1]);
	const addCourse = () => setCourseToAdd((values) => [...values, 1]);
	const [nomeDisciplina, setNomeDisciplina] = useState("");
	const onClose = () => {
		DisciplineDrawer.close();
		setNomeDisciplina("");
		setCourseToAdd([1]);
	};

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const cursos: number[] = [];
		const Courses = document.querySelectorAll<HTMLInputElement>('input[name="serie-disciplina"]');

		Courses.forEach((idCurso) => {
			if (!idCurso.value) {
				alert("Preencha todos os campos inseridos");
			}
			cursos.push(Number(idCurso.value));
		});

		try {
			const response = await RouteAPI.post(`/disciplina`, {
				idEscola: SchoolData.idEscola,
				nome: nomeDisciplina,
			});
			const idDisciplina = response.data.insertedValue.idDisciplina;
			await RouteAPI.post(`/curso-disciplina?idDisciplina=${idDisciplina}`, { cursos });
		} catch (error: any) {
			console.log(error);
			if (error instanceof AxiosError) {
				alert(error.response?.data.error.message);
			}
		}
		onClose();
	};

	useEffect(() => {}, [DisciplineDrawer.situation]);

	return (
		<Drawer anchor="right" open={DisciplineDrawer.situation} onClose={onClose}>
			<div className={styles.insert_container}>
				<header className="py-1">
					<h1 className="font-bold text-lg">Adicionar Disciplina</h1>
				</header>
				<Divider />
				<main className="w-full h-full flex flex-col gap-2 overflow-y-auto">
					<form className="py-2 text-start" id="create-discipline" onSubmit={onSubmit}>
						<TextField
							label="Nome da disciplina"
							variant="outlined"
							name="nome-disciplina"
							fullWidth
							inputProps={{ maxLength: 50 }}
							required
							value={nomeDisciplina}
							onChange={(e) => setNomeDisciplina(e.target.value)}
						/>
					</form>
					<Divider />
					<div className="w-full py-2 flex flex-col gap-2">
						<span className="text-[10px] font-light text-black-text">Vincule esta disciplina à um ou mais cursos</span>
						{courseToAdd.map((num, index) => (
							<CourseToAdd key={index} />
						))}
					</div>
					<button onClick={addCourse} className={styles.grid_adder}>
						<AddBoxIcon /> Adicionar Curso
					</button>
				</main>
				<Divider />
				<footer className={styles.senders}>
					<button onClick={onClose} className={styles.cancel}>
						Cancelar
					</button>
					<input type="submit" value="Cadastrar" form="create-discipline" className={styles.submiter} />
				</footer>
			</div>
		</Drawer>
	);
};

export default AddDiscipline;
