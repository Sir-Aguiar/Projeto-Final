import React from "react";
import styles from "./Escola.module.css";
import { useParams } from "react-router-dom";
import { useEscolaContext } from "./RouteStateManager";
import DisciplinaIcon from "../../assets/Escola/disciplina-icon.png";
import ProfessorIcon from "../../assets/Escola/professor-icon.png";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import ModalProfessor from "./Modals/Professor/ProfessorModal";
import ModalDisciplina from "./Modals/Disciplinas/Disciplinas";
import AddDiscipline from "./Drawers/Disciplines/AddDiscipline";
const Escola: React.FC = () => {
	const { SchoolData, professorsCount, disciplinesCount, ProfessorModal, DisciplineModal, DisciplineDrawer } =
		useEscolaContext();
	return (
		<div className={styles.content_container}>
			<header className={styles.header}>
				<h1 className="text-2xl font-bold text-black-text">{SchoolData.nome}</h1>
				<div className="flex items-center w-full gap-2">
					<button className={`${styles.button}`} onClick={() => DisciplineDrawer.open()}>
						<img src={DisciplinaIcon} className="max-h-[20px]" />
						Adicionar Disciplina
					</button>
					<button className={`${styles.button} ${styles.secundary_button}`}>
						<img src={ProfessorIcon} className="max-h-[18px]" />
						Adicionar Professor
					</button>
				</div>
			</header>
			<main className={styles.content_data}>
				<aside className={styles.info_cards}>
					<div className={`${styles.info_card}`}>
						<OpenInFullIcon onClick={() => ProfessorModal.open()} /> Professores: <span>{professorsCount}</span>
					</div>
					<div className={`${styles.info_card}`}>
						<OpenInFullIcon onClick={() => DisciplineModal.open()} /> Disciplinas ministradas:{" "}
						<span>{disciplinesCount}</span>
					</div>
					<div className={`${styles.info_card}`}>
						<HelpOutlineIcon /> Alunos cadastrados: <span>312</span>
					</div>
				</aside>
				<div className={styles.today_classes}></div>
			</main>
			<ModalProfessor />
			<ModalDisciplina />
			<AddDiscipline />
		</div>
	);
};

export default Escola;
