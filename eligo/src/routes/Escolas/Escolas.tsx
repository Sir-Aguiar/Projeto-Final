import React, { useState, useEffect } from "react";
import styles from "./Escolas.module.css";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import EditIcon from "@mui/icons-material/Edit";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import Checkbox from "@mui/material/Checkbox";
import { Box, Divider, Drawer, Typography, TextField } from "@mui/material";
import axios from "axios";
import { useAuthHeader } from "react-auth-kit";

type ClassLinkProps = {
	name: string;
	link: string;
};

const ClassLink: React.FC<ClassLinkProps> = ({ link, name }) => {
	return (
		<div className=" w-full h-[50px] min-h-[50px] flex items-center justify-start gap-4 px-2">
			<a href={link} className="transition-all duration-300 rounded-full hover:bg-slate-200 p-1 group ">
				<OpenInNewIcon className="transition-all duration-300 group-hover:text-blue-icon group-hover:scale-90 " />
			</a>
			<span className="font-medium">{name}</span>
		</div>
	);
};

const Escolas: React.FC = () => {
	const authHeader = useAuthHeader();

	const [insertDrawer, toggleInsert] = useState(false);
	const [updateDrawer, toggleUpdate] = useState(false);
	const [escolas, setEscolas] = useState<any[]>([]);

	useEffect(() => {
		axios
			.get("http://localhost:8080/escolas", {
				headers: {
					Authorization: authHeader(),
				},
			})
			.then((res) => {
				setEscolas(res.data.escolas);
			});
	}, []);

	return (
		<div className={styles.content_container}>
			<div className={styles.controllers}>
				<header className={styles.actions}>
					<button title="Cadastrar escola" onClick={() => toggleInsert(true)}>
						<LibraryAddIcon />
					</button>
					<button disabled title="Editar escola" onClick={() => toggleUpdate(true)}>
						<EditIcon />
					</button>
					<button disabled title="Excluir escola">
						<DeleteForeverIcon />
					</button>
				</header>
				<div className={styles.classes}>
					<h1 className="font-semibold text-center py-1">Turmas</h1>
					<Divider />
					<ClassLink link="#" name="Lorem Ipsum" />
					<ClassLink link="#" name="Lorem Ipsum" />
					<ClassLink link="#" name="Lorem Ipsum" />
					<ClassLink link="#" name="Lorem Ipsum" />
				</div>
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
						{escolas.map((escola, index) => (
							<tr key={index}>
								<td className="min-w-[50px] w-[50px]">
									<Checkbox />
								</td>
								<td className="min-w-[450px]">{escola.nome}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<Drawer anchor="right" open={insertDrawer} onClose={() => toggleInsert(false)}>
				<Box p={2} width="320px" textAlign="center" role="presentation" className={styles.insert_container}>
					<h1 className="font-bold text-lg mb-2">Cadastrar Escola</h1>
					<Divider />
					<div className="flex flex-col items-center w-full py-5">
						<TextField fullWidth id="nome" label="Nome da escola" variant="outlined" />
						<span className="text-[10px] my-2 font-medium">Estes dados podem ser alterados no futuro</span>
					</div>
					<Divider />
					<div className="w-full flex-col items-center py-2 gap-2">
						<h1 className="font-semibold">Adicionar turmas</h1>
					</div>
				</Box>
			</Drawer>

			<Drawer anchor="right" open={updateDrawer} onClose={() => toggleUpdate(false)}>
				<Box p={2} width="320px" textAlign="center" role="presentation">
					<Typography variant="h5" component="div">
						Lorem Ipsum Dolor
					</Typography>
				</Box>
			</Drawer>
		</div>
	);
};

export default Escolas;
