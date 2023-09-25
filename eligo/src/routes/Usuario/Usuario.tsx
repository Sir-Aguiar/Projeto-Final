import React from "react";
import styles from "./Usuario.module.css";
import { TextField } from "@mui/material";
import { useUsuarioContext } from "./RouteStateManager";

const Usuario: React.FC = () => {
	const { fullName, email, setEmail, setFullName, RouteAPI } = useUsuarioContext();
	const handleUpdate = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		try {
			await RouteAPI.put("/usuario", {
				nome: fullName,
				email,
			});
			window.location.reload();
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<div className={styles.content_section}>
			<div className={styles.data_container}>
				<h1 className="font-semibold font-Montserrat ">Informações de Usuário</h1>
				<div className={styles.dater}>
					<div className={styles.input_container}>
						<TextField
							fullWidth
							type="email"
							value={fullName}
							onChange={(e) => setFullName(e.target.value)}
							label="Nome completo"
						/>
						<TextField fullWidth type="email" value={email} onChange={(e) => setEmail(e.target.value)} label="Email" />
					</div>
					<button className={styles.sender} onClick={handleUpdate}>
						Alterar
					</button>
				</div>
			</div>
		</div>
	);
};

export default Usuario;
