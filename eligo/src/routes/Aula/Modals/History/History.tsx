import { Fade, Modal } from "@mui/material";
import React from "react";

import styles from "./History.module.css";
import { useAulaContext } from "../../RouteStateManager";

const History: React.FC = () => {
	const { HistoryModal } = useAulaContext();
	const onClose = () => {
		HistoryModal.close();
	};
	return (
		<Modal className="overflow-y-scroll" open={HistoryModal.situation} onClose={onClose} closeAfterTransition>
			<Fade in={HistoryModal.situation}>
				<div className={styles.modal_content}>
					<header className={styles.header}></header>
					<main className={styles.main}>
						<div className={styles.register_content}>
							<div className={styles.table_container}>
								<table className={styles.content_table}>
									<thead className={styles.table_header}>
										<tr>
											<th></th>
											<th>Turma</th>
											<th>Série</th>
											<th>Escola</th>
										</tr>
									</thead>
									<tbody className={styles.table_body}></tbody>
								</table>
							</div>
							<div className="w-full h-[40px] min-h-[40px]"></div>
						</div>
						<div className={styles.class_info}>
							<div className={styles.info_section}>
								<h2>Professor:</h2>
								<p>Felipe Ferreira Aguiar</p>
							</div>
							<div className={styles.info_section}>
								<h2>Turma:</h2>
								<p>3 Ano D</p>
							</div>
							<div className={styles.info_section}>
								<h2>Disciplina:</h2>
								<p>Matemática Básica</p>
							</div>
							<div className={styles.info_section}>
								<h2>Alunos Presentes:</h2>
								<div className={styles.presents}>
									<p>Lorem ipsum dolor sit.</p>
									<p>Lorem ipsum dolor sit.</p>
									<p>Lorem ipsum dolor sit.</p>
									<p>Lorem ipsum dolor sit.</p>
									<p>Lorem ipsum dolor sit.</p>
									<p>Lorem ipsum dolor sit.</p>
									<p>Lorem ipsum dolor sit.</p>
									<p>Lorem ipsum dolor sit.</p>
									<p>Lorem ipsum dolor sit.</p>
									<p>Lorem ipsum dolor sit.</p>
									<p>Lorem ipsum dolor sit.</p>
									<p>Lorem ipsum dolor sit.</p>
									<p>Lorem ipsum dolor sit.</p>
									<p>Lorem ipsum dolor sit.</p>
								</div>
							</div>
						</div>
					</main>
				</div>
			</Fade>
		</Modal>
	);
};

export default History;
