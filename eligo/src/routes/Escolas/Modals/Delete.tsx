import React from "react";
import styles from "./Delete.module.css";
import Modal from "@mui/material/Modal";
import GppMaybeIcon from "@mui/icons-material/GppMaybe";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEscolasContext } from "../RouteStateManager";
import { AxiosError } from "axios";
import { CircularProgress, Fade } from "@mui/material";

const Delete: React.FC = () => {
	const { ModalDelete, RouteAPI, selectedRows, setLoading, isLoading, setSnackMessage, setSnackbarOpen } =
		useEscolasContext();

	const handleDelete = async () => {
		try {
			// Realizar uma requisição por vez
			for (const idEscola of selectedRows) {
				await RouteAPI.delete(`/escola/${idEscola}`);
			}
			setSnackMessage("Escola excluída com sucesso");
			setSnackbarOpen(true);
		} catch (error: any) {
			// Se der algum erro, sai
			if (error instanceof AxiosError) {
				return console.log(error.response?.data);
			}
			return console.log(error);
		} finally {
			ModalDelete.close();
		}
	};

	return (
		<Modal open={ModalDelete.situation} onClose={() => ModalDelete.close()} closeAfterTransition>
			<Fade in={ModalDelete.situation}>
				<div className={styles.delete_container}>
					<header>
						<h1 className="font-semibold text-xl">Remover Escolas</h1>
						<div className="w-full flex flex-col items-center gap-[2px]">
							<h3 className="text-[12px] ">
								Você tem certeza que deseja excluir {selectedRows.length} escola{selectedRows.length > 1 ? "s" : ""}?
							</h3>
							<p className="text-[12px] font-medium text-icon-black">Esta ação não poderá ser revertida</p>
						</div>
					</header>
					<main>
						<div className="flex items-start h-full py-1">
							<GppMaybeIcon className={styles.warn_icon} />
						</div>
						<div className="flex flex-col gap-1 h-full">
							<h1 className="text-lg font-bold text-[#D94F3B]">Cuidado</h1>
							<p className="text-[12px] leading-4 text-icon-black">
								Todas as turmas, das respectivas escolas, serão apagadas assim como seus dados.
							</p>
						</div>
					</main>
					<footer>
						<button className="bg-black-text" onClick={() => ModalDelete.close()}>
							Cancelar
						</button>
						<button className="bg-[#EB4B4B] flex items-center justify-center gap-[2px]" onClick={handleDelete}>
							{isLoading ? (
								<CircularProgress size={25} color="inherit" />
							) : (
								<>
									Excluir <DeleteIcon />
								</>
							)}
						</button>
					</footer>
				</div>
			</Fade>
		</Modal>
	);
};

export default Delete;
